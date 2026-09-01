import crypto from "node:crypto";

/** Client PA-API 5 sans dépendance. Appelé uniquement au build, côté serveur :
 *  la clé secrète ne doit jamais atteindre le navigateur. */

const HOST = "webservices.amazon.fr";
const REGION = "eu-west-1";
const SERVICE = "ProductAdvertisingAPI";
const MARCHE = "www.amazon.fr";

export type Produit = {
  asin: string;
  titre: string;
  image: string | null;
  largeur: number;
  hauteur: number;
  prix: string | null;
  lien: string;
  releve: string;      // horodatage du relevé de prix, exigé par Amazon
};

const sha = (s: string) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (k: crypto.BinaryLike, s: string) => crypto.createHmac("sha256", k).update(s, "utf8").digest();

function signer(cible: string, chemin: string, corps: string) {
  const secret = process.env.AMAZON_SECRET_KEY!;
  const acces = process.env.AMAZON_ACCESS_KEY!;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const jour = amzDate.slice(0, 8);

  const entetes: Record<string, string> = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host: HOST,
    "x-amz-date": amzDate,
    "x-amz-target": cible,
  };
  const noms = Object.keys(entetes).sort();
  const canonique = [
    "POST", chemin, "",
    noms.map((h) => `${h}:${entetes[h]}\n`).join(""),
    noms.join(";"),
    sha(corps),
  ].join("\n");

  const scope = `${jour}/${REGION}/${SERVICE}/aws4_request`;
  const aSigner = ["AWS4-HMAC-SHA256", amzDate, scope, sha(canonique)].join("\n");
  let cle = hmac(`AWS4${secret}`, jour);
  for (const p of [REGION, SERVICE, "aws4_request"]) cle = hmac(cle, p);
  const signature = crypto.createHmac("sha256", cle).update(aSigner, "utf8").digest("hex");

  return {
    ...entetes,
    Authorization: `AWS4-HMAC-SHA256 Credential=${acces}/${scope}, ` +
      `SignedHeaders=${noms.join(";")}, Signature=${signature}`,
  };
}

const RESSOURCES = [
  "Images.Primary.Large",
  "ItemInfo.Title",
  "Offers.Listings.Price",
];

function versProduit(it: Record<string, any>, tag: string): Produit {
  const img = it.Images?.Primary?.Large;
  return {
    asin: it.ASIN,
    titre: it.ItemInfo?.Title?.DisplayValue ?? "",
    image: img?.URL ?? null,
    largeur: img?.Width ?? 500,
    hauteur: img?.Height ?? 500,
    prix: it.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? null,
    lien: `https://www.amazon.fr/dp/${it.ASIN}?tag=${tag}`,
    releve: new Date().toISOString(),
  };
}

async function appeler(operation: string, charge: object): Promise<any | null> {
  if (!process.env.AMAZON_ACCESS_KEY || !process.env.AMAZON_SECRET_KEY) return null;
  const chemin = `/paapi5/${operation.toLowerCase()}`;
  const cible = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`;
  const corps = JSON.stringify(charge);
  try {
    const r = await fetch(`https://${HOST}${chemin}`, {
      method: "POST",
      headers: signer(cible, chemin, corps),
      body: corps,
      // Amazon impose de rafraîchir les prix au moins toutes les 24 heures.
      next: { revalidate: 21600 },
    });
    if (!r.ok) {
      const t = await r.text();
      console.warn(`[PA-API] ${operation} ${r.status} — ${t.slice(0, 200)}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.warn("[PA-API] échec réseau", e);
    return null;
  }
}

/** Meilleur produit correspondant à une recherche. null si l'API est fermée. */
export async function chercherProduit(mots: string, tag: string): Promise<Produit | null> {
  const d = await appeler("SearchItems", {
    Keywords: mots,
    SearchIndex: "PetSupplies",
    ItemCount: 3,
    PartnerTag: tag,
    PartnerType: "Associates",
    Marketplace: MARCHE,
    Resources: RESSOURCES,
  });
  const items = d?.SearchResult?.Items ?? [];
  // On retient le premier résultat qui a une image ET un prix : un produit sans
  // prix affichable est presque toujours indisponible.
  const bon = items.find((i: any) => i.Images?.Primary?.Large && i.Offers?.Listings?.[0]?.Price);
  return bon ? versProduit(bon, tag) : null;
}

/** Produits figés par ASIN, une fois les bons identifiés. */
export async function produitsParAsin(asins: string[], tag: string): Promise<Record<string, Produit>> {
  if (asins.length === 0) return {};
  const d = await appeler("GetItems", {
    ItemIds: asins.slice(0, 10),
    PartnerTag: tag,
    PartnerType: "Associates",
    Marketplace: MARCHE,
    Resources: RESSOURCES,
  });
  const out: Record<string, Produit> = {};
  for (const it of d?.ItemsResult?.Items ?? []) out[it.ASIN] = versProduit(it, tag);
  return out;
}

export const apiDisponible = () =>
  Boolean(process.env.AMAZON_ACCESS_KEY && process.env.AMAZON_SECRET_KEY);
