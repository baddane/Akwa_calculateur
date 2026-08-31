import type { Photo } from "@/lib/unsplash";
import { UNSPLASH_URL } from "@/lib/unsplash";

/** Attribution exigée par les conditions d'utilisation de l'API Unsplash. */
export function Credit({ photo, inverse = false }: { photo: Photo; inverse?: boolean }) {
  return (
    <span className={inverse ? "credit credit-inv" : "credit"}>
      Photo <a href={photo.authorUrl} target="_blank" rel="noopener nofollow">{photo.author}</a>
      {" / "}
      <a href={UNSPLASH_URL} target="_blank" rel="noopener nofollow">Unsplash</a>
    </span>
  );
}
