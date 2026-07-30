import Link from "next/link";
import { fetchArticleMeta } from "@/lib/articles";
import { daysAgo, formatMonthYear as flexMonthYear } from "@/lib/dates";
import { client } from "@/sanity/client";
import {
  articlesArchiveQuery,
  publicationsQuery,
  writingPageQuery,
  writingUpdatedQuery,
} from "@/sanity/queries";

type ArticleDoc = {
  _id: string;
  title: string | null;
  publication: string | null;
  category: string | null;
  url: string;
  publishedAt: string | null;
};

type ArticleRow = {
  _id: string;
  title: string;
  publication: string;
  category: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  url: string;
};

type PublicationDoc = {
  _id: string;
  name: string;
  description: string | null;
  url: string | null;
};

export const revalidate = 60;

const OTHER = "Other";

const formatMonthYear = flexMonthYear;

function groupByPublication(rows: ArticleRow[]): Map<string, ArticleRow[]> {
  const groups = new Map<string, ArticleRow[]>();
  for (const r of rows) {
    const key = r.publication || OTHER;
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => {
      const at = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bt - at;
    });
  }
  return groups;
}

type WritingPageDoc = { description: string | null } | null;

export default async function WritingPage() {
  const [docs, publications, page, updatedAt] = await Promise.all([
    client
      .fetch<ArticleDoc[]>(articlesArchiveQuery)
      .catch(() => [] as ArticleDoc[]),
    client
      .fetch<PublicationDoc[]>(publicationsQuery)
      .catch(() => [] as PublicationDoc[]),
    client.fetch<WritingPageDoc>(writingPageQuery).catch(() => null),
    client.fetch<string | null>(writingUpdatedQuery).catch(() => null),
  ]);
  const updated = daysAgo(updatedAt);

  const rows: ArticleRow[] = await Promise.all(
    docs.map(async (d) => {
      const meta = await fetchArticleMeta(d.url);
      return {
        _id: d._id,
        title: d.title || meta.title || "Untitled",
        publication: (d.publication || meta.siteName || "").trim(),
        category: d.category,
        publishedAt: d.publishedAt ?? meta.publishedTime ?? null,
        imageUrl: meta.imageUrl,
        url: d.url,
      };
    }),
  );

  const groups = groupByPublication(rows);
  const pubMap = new Map(publications.map((p) => [p.name, p]));

  const orderedNames = [...groups.keys()].sort((a, b) => {
    if (a === OTHER) return 1;
    if (b === OTHER) return -1;
    return a.localeCompare(b);
  });

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
          Writing
          {updated && (
            <span className="ml-3 align-middle text-xs font-normal text-ink-muted">
              (updated {updated})
            </span>
          )}
        </h1>
        {page?.description && (
          <p className="mb-16 text-xs leading-relaxed text-ink-muted">
            {page.description}
          </p>
        )}

        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          orderedNames.map((name) => {
            const pub = pubMap.get(name);
            return (
              <PublicationSection
                key={name}
                name={name}
                description={pub?.description ?? null}
                url={pub?.url ?? null}
                rows={groups.get(name) ?? []}
              />
            );
          })
        )}
      </div>
    </main>
  );
}

function PublicationSection({
  name,
  description,
  url,
  rows,
}: {
  name: string;
  description: string | null;
  url: string | null;
  rows: ArticleRow[];
}) {
  return (
    <section className="group mb-20">
      <h2 className="mb-3 border-b border-hairline pb-2 text-4xl leading-none sm:text-6xl">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </h2>
      {description && (
        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:mb-8 group-hover:max-h-96 group-hover:opacity-100">
          <p className="text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        </div>
      )}
      <ul>
        {rows.map((r) => (
          <li key={r._id}>
            <ArticleRow row={r} publicationName={name} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleRow({
  row,
  publicationName,
}: {
  row: ArticleRow;
  publicationName: string;
}) {
  const dateLabel = formatMonthYear(row.publishedAt);
  return (
    <a
      href={row.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-3 border-b border-hairline py-4 sm:grid sm:grid-cols-[7rem_1fr_auto_auto] sm:items-center sm:gap-6"
    >
      <div
        style={{ aspectRatio: "16 / 9" }}
        className="w-32 shrink-0 overflow-hidden bg-ink/5 sm:w-full"
      >
        {row.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.imageUrl}
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
        {publicationName}
      </div>
      <div className="text-xs uppercase tracking-wide text-ink-muted sm:w-24 sm:text-right">
        {dateLabel ?? "—"}
      </div>
    </a>
  );
}
