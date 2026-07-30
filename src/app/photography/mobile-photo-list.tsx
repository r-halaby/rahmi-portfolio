import type { Photo } from "./photo-canvas";

function sanityImageAt(url: string, targetWidth: number) {
  if (!url) return url;
  const w = Math.round(targetWidth * 2);
  if (url.includes("cdn.sanity.io")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${w}&auto=format&fit=max`;
  }
  return url;
}

export function MobilePhotoList({ photos }: { photos: Photo[] }) {
  return (
    <div className="flex flex-col gap-6 px-6 pb-24 pt-24">
      {photos.map((p) => (
        <div key={p._id} className="w-full overflow-hidden bg-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sanityImageAt(p.image.asset.url, 800)}
            alt=""
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
