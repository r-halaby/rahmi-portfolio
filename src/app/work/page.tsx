import Link from "next/link";
import { WorkArchive, type WorkRow } from "@/components/work-archive";
import { client } from "@/sanity/client";
import { projectsArchiveQuery } from "@/sanity/queries";

type ProjectDoc = {
  _id: string;
  title: string;
  slug: string | null;
  client: string | null;
  category: string | null;
  year: number | null;
};

export const revalidate = 60;

export default async function WorkPage() {
  const docs = await client
    .fetch<ProjectDoc[]>(projectsArchiveQuery)
    .catch(() => [] as ProjectDoc[]);

  const rows: WorkRow[] = docs.map((d) => ({
    _id: d._id,
    title: d.title,
    client: d.client,
    category: d.category,
    year: d.year,
  }));

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          -BACK
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-8 pb-32 pt-6">
        <h1 className="mb-16 text-6xl leading-none">Selected Work</h1>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          <WorkArchive rows={rows} />
        )}
      </div>
    </main>
  );
}
