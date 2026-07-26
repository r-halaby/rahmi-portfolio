import Link from "next/link";
import { fetchArticleMeta } from "@/lib/articles";
import { client } from "@/sanity/client";
import { articlesArchiveQuery } from "@/sanity/queries";

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
  publication: string | null;
  category: string | null;
  year: number | null;
  publishedAt: string | null;
};

export const revalidate = 60;

function yearOf(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const y = parseInt(iso.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

function groupByYear(rows: ArticleRow[]): Array<[number | "Undated", ArticleRow[]]> {
  const buckets = new Map<number | "Undated", ArticleRow[]>();
  for (const r of rows) {
    const key: number | "Undated" = r.year ?? "Undated";
    const list = buckets.get(key) ?? [];
    list.push(r);
    buckets.set(key, list);
  }
  const numericKeys = [...buckets.keys()]
    .filter((k): k is number => typeof k === "number")
    .sort((a, b) => b - a);
  const ordered: Array<[number | "Undated", ArticleRow[]]> = numericKeys.map(
    (k) => [k, buckets.get(k)!],
  );
  if (buckets.has("Undated")) ordered.push(["Undated", buckets.get("Undated")!]);
  return ordered;
}

export default async function WritingPage() {
  const docs = await client
    .fetch<ArticleDoc[]>(articlesArchiveQuery)
    .catch(() => [] as ArticleDoc[]);

  const rows: ArticleRow[] = await Promise.all(
    docs.map(async (d) => {
      const meta = await fetchArticleMeta(d.url);
      const publishedAt = d.publishedAt ?? meta.publishedTime ?? null;
      return {
        _id: d._id,
        title: d.title || meta.title || "Untitled",
        publication: d.publication || meta.siteName,
        category: d.category,
        year: yearOf(publishedAt),
        publishedAt,
      };
    }),
  );

  const groups = groupByYear(rows);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          -BACK
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-8 pb-32 pt-6">
        <h1 className="mb-16 text-4xl">Writing</h1>

        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          groups.map(([label, items]) => (
            <Section key={String(label)} title={String(label)}>
              <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                {items.map((r) => (
                  <ArticleEntry key={r._id} row={r} />
                ))}
              </div>
            </Section>
          ))
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 border-b border-hairline pb-2 text-6xl leading-none">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ArticleEntry({ row }: { row: ArticleRow }) {
  const meta = [row.publication, row.category].filter(Boolean).join(" · ");
  return (
    <div>
      <Link
        href={`/writing/${row._id}`}
        className="block text-2xl leading-tight hover:opacity-70"
      >
        {row.title}
      </Link>
      {meta && (
        <div className="mt-2 text-xs uppercase tracking-wide text-ink-muted">
          {meta}
        </div>
      )}
    </div>
  );
}
