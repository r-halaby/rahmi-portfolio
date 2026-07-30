import type { Image } from "sanity";
import { resolveEmbed } from "@/lib/covers";
import { urlFor } from "@/sanity/image";

export type GalleryImage = Image & {
  _type?: "image";
  _key?: string;
  caption?: string | null;
};

export type GalleryEmbed = {
  _type: "embed";
  _key?: string;
  url: string;
  caption?: string | null;
};

export type GalleryVideo = {
  _type: "video";
  _key?: string;
  caption?: string | null;
  file?: {
    asset?: { url?: string | null; mimeType?: string | null } | null;
  } | null;
  poster?: Image | null;
};

export type GalleryItem = GalleryImage | GalleryEmbed | GalleryVideo;

export function GalleryCarousel({ images }: { images: GalleryItem[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="mt-4 -mx-8 overflow-x-auto px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-3" style={{ scrollSnapType: "x mandatory" }}>
        {images.map((item, i) => (
          <GalleryFigure key={itemKey(item, i)} item={item} />
        ))}
      </div>
    </div>
  );
}

function itemKey(item: GalleryItem, i: number) {
  if (item._type === "embed") return item._key ?? item.url ?? `embed-${i}`;
  if (item._type === "video") return item._key ?? `video-${i}`;
  return item._key ?? item.asset?._ref ?? `img-${i}`;
}

function GalleryFigure({ item }: { item: GalleryItem }) {
  if (item._type === "video") {
    const videoUrl = item.file?.asset?.url;
    if (!videoUrl) return null;
    const posterUrl = item.poster?.asset
      ? urlFor(item.poster as Image).width(800).auto("format").url()
      : undefined;
    return (
      <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-64 w-auto"
        />
        {item.caption && (
          <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (item._type === "embed") {
    const resolved = resolveEmbed(item.url);
    if (!resolved) {
      return (
        <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-64 w-64 items-center justify-center bg-ink/5 text-xs text-ink-muted underline"
          >
            Open link
          </a>
          {item.caption && (
            <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    if (resolved.kind === "instagram") {
      const containerWidth = 144;
      const containerHeight = 256;
      const nativeIframeWidth = 328;
      const nativeIframeHeight = 720;
      const scale = containerWidth / nativeIframeWidth;
      const topShift = -Math.round(60 * scale);
      return (
        <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
          <div
            style={{
              width: containerWidth,
              height: containerHeight,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              src={resolved.src}
              title={item.caption ?? "Instagram embed"}
              allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              scrolling="no"
              style={{
                position: "absolute",
                top: topShift,
                left: 0,
                width: nativeIframeWidth,
                height: nativeIframeHeight,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                border: 0,
              }}
            />
          </div>
          {item.caption && (
            <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
              {item.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    const { width, height } = embedSize(resolved.aspect);
    return (
      <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
        <div style={{ width, height }}>
          <iframe
            src={resolved.src}
            title={item.caption ?? "Embed"}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            className="block h-full w-full border-0"
          />
        </div>
        {item.caption && (
          <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const url = item.asset
    ? urlFor(item as Image).width(1200).auto("format").url()
    : null;
  if (!url) return null;
  return (
    <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={item.caption ?? ""}
        className="block h-64 w-auto object-cover"
        loading="lazy"
      />
      {item.caption && (
        <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

function embedSize(aspect: "video" | "audio" | "portrait") {
  if (aspect === "portrait") return { width: 320, height: 400 };
  if (aspect === "audio") return { width: 400, height: 256 };
  return { width: 456, height: 256 };
}
