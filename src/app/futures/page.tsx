import Link from "next/link";
import type { Image } from "sanity";
import { ExpandableDescription } from "@/components/expandable-description";
import { fetchArticleMeta } from "@/lib/articles";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { futuresQuery } from "@/sanity/queries";

type FutureDoc = {
  _id: string;
  title: string | null;
  status: "active" | "shipped" | "aspirational";
  url: string | null;
  coverImage: Image | null;
  description: string | null;
};

type FutureCard = {
  _id: string;
  title: string;
  status: "active" | "shipped" | "aspirational";
  url: string | null;
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
      if (d.url && (!title || !imageUrl)) {
        const meta = await fetchArticleMeta(d.url);
        title = title || meta.title || null;
        imageUrl = imageUrl ?? meta.imageUrl ?? null;
      }
      return {
        _id: d._id,
        title: title || "Untitled",
        status: d.status,
        url: d.url,
        imageUrl,
        description: d.description,
      };
    }),
  );

  const active = cards.filter((c) => c.status === "active");
  const shipped = cards.filter((c) => c.status === "shipped");
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
            {shipped.length > 0 && (
              <Section title="Shipped" cards={shipped} />
            )}
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
      <h2 className="mb-10 border-b border-hairline pb-2 text-4xl leading-none sm:text-6xl">
        {title}
      </h2>
      <div className="space-y-24">
        {cards.map((c, i) => (
          <FutureCardRow key={c._id} card={c} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

function FutureCardRow({
  card,
  index,
}: {
  card: FutureCard;
  index: number;
}) {
  return (
    <article className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
      <div>
        <div className="text-xs tabular-nums text-ink-muted">
          {String(index).padStart(2, "0")}
        </div>
        <h3 className="mt-1 text-4xl leading-tight">{card.title}</h3>
        {card.description && (
          <div className="mt-4">
            <ExpandableDescription text={card.description} />
          </div>
        )}
      </div>
      {card.url ? (
        <a
          href={card.url}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          <div
            style={{ aspectRatio: "16 / 9" }}
            className="w-full overflow-hidden bg-ink/5"
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
          </div>
        </a>
      ) : (
        <div
          style={{ aspectRatio: "16 / 9" }}
          className="w-full overflow-hidden bg-ink/5"
        >
          {card.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imageUrl}
              alt=""
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      )}
    </article>
  );
}
