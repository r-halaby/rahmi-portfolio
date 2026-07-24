import Link from "next/link";
import { client } from "@/sanity/client";
import { photosQuery } from "@/sanity/queries";
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

export const revalidate = 60;

export default async function PhotographyPage() {
  let photos: Photo[] = [];
  try {
    photos = await client.fetch<Photo[]>(photosQuery);
  } catch {
    photos = [];
  }
  if (!photos.length) photos = PLACEHOLDER_PHOTOS;
  const capped = photos.slice(0, 60);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          -BACK
        </Link>
      </header>
      <PhotoCanvas photos={capped} />
    </main>
  );
}
