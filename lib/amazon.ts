export const TAG = "baddane0a-21";

/** Lien affilié vers une recherche Amazon.fr. Aucun prix n'est affiché sur le site :
 *  les informations tarifaires ne peuvent venir que de l'API Produits d'Amazon. */
export function amz(query: string): string {
  return `https://www.amazon.fr/s?k=${encodeURIComponent(query)}&tag=${TAG}`;
}
