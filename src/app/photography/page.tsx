import Link from "next/link";
import { client } from "@/sanity/client";
import { photographyQuery, photosQuery } from "@/sanity/queries";
import { PhotoCanvas, type Photo } from "./photo-canvas";

const PLACEHOLDER_PHOTOS: Photo[] = Array.from({ length: 28 }, (_, i) => {
  const shapes = [
    { w: 400, h: 300 },
    { w: 300, h: 400 },
    { w: 400, h: 400 },
    { w: 600, h: 300 },
    { w: 300, h: 450 },
    { w: 450, h: 350 },
  ];
  const shape = shapes[i % shapes.length];
  return {
    _id: `placeholder-${i}`,
    image: {
      asset: {
        url: `https://picsum.photos/seed/rahmi-${i}/${shape.w}/${shape.h}`,
        metadata: {
          dimensions: {
            width: shape.w,
            height: shape.h,
            aspectRatio: shape.w / shape.h,
          },
        },
      },
    },
    location: null,
    dateTaken: null,
    series: null,
    featured: false,
  };
});

type PhotographyDoc = { description: string | null } | null;

export const revalidate = 60;

export default async function PhotographyPage() {
  const [photos, page] = await Promise.all([
    client.fetch<Photo[]>(photosQuery).catch(() => [] as Photo[]),
    client.fetch<PhotographyDoc>(photographyQuery).catch(() => null),
  ]);
  const displayPhotos = (photos.length ? photos : PLACEHOLDER_PHOTOS).slice(0, 60);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          BACK
        </Link>
      </header>
      {page?.description && (
        <div
          style={{ maxWidth: "33vw" }}
          className="fixed bottom-6 right-8 z-0 text-right text-xs leading-relaxed text-ink"
        >
          {page.description}
        </div>
      )}
      <div className="pointer-events-none relative z-10">
        <PhotoCanvas photos={displayPhotos} />
      </div>
    </main>
  );
}
