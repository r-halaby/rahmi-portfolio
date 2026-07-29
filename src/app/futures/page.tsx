import Link from "next/link";
import type { Image } from "sanity";
import { fetchArticleMeta } from "@/lib/articles";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { futuresQuery } from "@/sanity/queries";

type FutureDoc = {
  _id: string;
  title: string | null;
  status: "active" | "aspirational";
  url: string;
  coverImage: Image | null;
  description: string | null;
};

type FutureCard = {
  _id: string;
  title: string;
  status: "active" | "aspirational";
  url: string;
  imageUrl: string | null;
  description: string | null;
};

export const revalidate = 60;

function coverOverride(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(800).height(450).fit("crop").auto("format").url();
}

export default async function PlayspacePage() {
  const docs = await client
    .fetch<FutureDoc[]>(futuresQuery)
    .catch(() => [] as FutureDoc[]);

  const cards: FutureCard[] = await Promise.all(
    docs.map(async (d) => {
      const override = coverOverride(d.coverImage);
      let title = d.title;
      let imageUrl = override;
      if (!title || !imageUrl) {
        const meta = await fetchArticleMeta(d.url);
        title = title || meta.title || "Untitled";
        imageUrl = imageUrl ?? meta.imageUrl ?? null;
      }
      return {
        _id: d._id,
        title: title!,
        status: d.status,
        url: d.url,
        imageUrl,
        description: d.description,
      };
    }),
  );

  const active = cards.filter((c) => c.status === "active");
  const aspirational = cards.filter((c) => c.status === "aspirational");

  return (
    <main className="min-h-screen bg-warm text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-8 pb-32 pt-6">
        <h1 className="mb-16 text-4xl">Playspace</h1>

        {cards.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          <>
            {active.length > 0 && (
              <Section title="Works in Progress" cards={active} />
            )}
            {aspirational.length > 0 && (
              <Section title="Backlog" cards={aspirational} />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  cards,
}: {
  title: string;
  cards: FutureCard[];
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 border-b border-hairline pb-2 text-6xl leading-none">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <FutureCardTile key={c._id} card={c} />
        ))}
      </div>
    </section>
  );
}

function FutureCardTile({ card }: { card: FutureCard }) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <div
        style={{ aspectRatio: "16 / 9" }}
        className="relative w-full overflow-hidden bg-ink/5"
      >
        {card.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt=""
            className="block h-full w-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 flex items-end p-4"
          style={{
            background:
              "linear-gradient(to top, rgba(18,18,18,0.75) 0%, rgba(18,18,18,0.15) 45%, rgba(18,18,18,0) 70%)",
          }}
        >
          <span className="text-lg leading-tight text-paper">
            {card.title}
          </span>
        </div>
      </div>
      {card.description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {card.description}
        </p>
      )}
    </a>
  );
}
