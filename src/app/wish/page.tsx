import Link from "next/link";
import type { Image } from "sanity";
import { daysAgo, formatMonthYear as flexMonthYear } from "@/lib/dates";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  wishPageQuery,
  wishProjectsQuery,
  wishUpdatedQuery,
} from "@/sanity/queries";

type WishProject = {
  _id: string;
  title: string;
  creator: string;
  url: string | null;
  projectDate: string | null;
  coverImage: Image | null;
  annotation: string | null;
};

export const revalidate = 60;

const formatMonthYear = flexMonthYear;

function coverUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(400).height(225).fit("crop").auto("format").url();
}

type WishPageDoc = { description: string | null } | null;

export default async function WishPage() {
  const [rows, page, updatedAt] = await Promise.all([
    client
      .fetch<WishProject[]>(wishProjectsQuery)
      .catch(() => [] as WishProject[]),
    client.fetch<WishPageDoc>(wishPageQuery).catch(() => null),
    client.fetch<string | null>(wishUpdatedQuery).catch(() => null),
  ]);
  const updated = daysAgo(updatedAt);

  return (
    <main className="min-h-screen bg-warm text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-8 pb-32 pt-6">
        <h1 className="mb-6 text-4xl">
          Projects I Wish I Made
          {updated && (
            <span className="ml-3 align-middle text-xs font-normal text-ink-muted">
              (updated {updated})
            </span>
          )}
        </h1>
        {page?.description && (
          <p className="mb-16 text-sm leading-relaxed text-ink-muted">
            {page.description}
          </p>
        )}

        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          <ul>
            {rows.map((r) => (
              <li key={r._id}>
                <WishRow row={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function WishRow({ row }: { row: WishProject }) {
  const dateLabel = formatMonthYear(row.projectDate);
  const image = coverUrl(row.coverImage);

  const inner = (
    <div className="group flex flex-col gap-3 border-b border-hairline py-4 sm:grid sm:grid-cols-[7rem_1fr_auto_auto] sm:items-center sm:gap-6">
      <div
        style={{ aspectRatio: "16 / 9" }}
        className="w-32 shrink-0 overflow-hidden bg-ink/5 sm:w-full"
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="block h-full w-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
          />
        )}
      </div>
      <div className="min-w-0 text-base text-ink group-hover:opacity-70 sm:max-w-[24rem] sm:truncate">
        {row.title}
      </div>
      <div className="text-xs uppercase tracking-wide text-ink-muted">
        {row.creator}
      </div>
      <div className="text-xs uppercase tracking-wide text-ink-muted sm:w-24 sm:text-right">
        {dateLabel ?? "—"}
      </div>
    </div>
  );

  return row.url ? (
    <a href={row.url} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
