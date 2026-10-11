import { EPINGLES } from "@/lib/epingles";
import { publications } from "@/lib/publication";

/** Flux lu par scripts/pinterest-auto-pins.user.js : les épingles à publier,
 *  dans l'ordre de publication. Régénéré à chaque déploiement. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { genere: new Date().toISOString(), epingles: publications(EPINGLES) },
    { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
