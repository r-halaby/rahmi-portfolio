import Link from "next/link";
import { client } from "@/sanity/client";
import {
  booksQuery,
  moviesQuery,
  nonprofitsQuery,
  talksQuery,
} from "@/sanity/queries";

type Movie = {
  _id: string;
  title: string;
  director: string;
  year: number;
  annotation: string;
  url: string | null;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  yearRead: number | null;
  annotation: string;
};

type Talk = {
  _id: string;
  title: string;
  speaker: string;
  url: string;
  annotation: string;
};

type Nonprofit = {
  _id: string;
  name: string;
  url: string;
  oneLiner: string;
};

export const revalidate = 60;

export default async function ReferencePage() {
  const [movies, books, talks, nonprofits] = await Promise.all([
    client.fetch<Movie[]>(moviesQuery).catch(() => [] as Movie[]),
    client.fetch<Book[]>(booksQuery).catch(() => [] as Book[]),
    client.fetch<Talk[]>(talksQuery).catch(() => [] as Talk[]),
    client.fetch<Nonprofit[]>(nonprofitsQuery).catch(() => [] as Nonprofit[]),
  ]);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          -BACK
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-8 pb-32 pt-8">
        <h1 className="mb-20 text-4xl">Reference Stack</h1>

        <Section title="Movies" empty={movies.length === 0}>
          {movies.map((m) => (
            <Entry
              key={m._id}
              header={
                <>
                  {m.url ? (
                    <ExternalLink href={m.url}>{m.title}</ExternalLink>
                  ) : (
                    <span>{m.title}</span>
                  )}
                  <Meta>
                    {m.director} · {m.year}
                  </Meta>
                </>
              }
              annotation={m.annotation}
            />
          ))}
        </Section>

        <Section title="Books" empty={books.length === 0}>
          {books.map((b) => (
            <Entry
              key={b._id}
              header={
                <>
                  <span>{b.title}</span>
                  <Meta>
                    {b.author}
                    {b.yearRead ? ` · ${b.yearRead}` : ""}
                  </Meta>
                </>
              }
              annotation={b.annotation}
            />
          ))}
        </Section>

        <Section title="Talks" empty={talks.length === 0}>
          {talks.map((t) => (
            <Entry
              key={t._id}
              header={
                <>
                  <ExternalLink href={t.url}>{t.title}</ExternalLink>
                  <Meta>{t.speaker}</Meta>
                </>
              }
              annotation={t.annotation}
            />
          ))}
        </Section>

        <Section title="Nonprofits" empty={nonprofits.length === 0}>
          {nonprofits.map((n) => (
            <Entry
              key={n._id}
              header={<ExternalLink href={n.url}>{n.name}</ExternalLink>}
              annotation={n.oneLiner}
            />
          ))}
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xs uppercase tracking-widest text-ink-muted">
        {title}
      </h2>
      {empty ? (
        <p className="text-sm text-ink-muted">—</p>
      ) : (
        <div className="space-y-8">{children}</div>
      )}
    </section>
  );
}

function Entry({
  header,
  annotation,
}: {
  header: React.ReactNode;
  annotation: string;
}) {
  return (
    <div>
      <div className="mb-1 text-base">{header}</div>
      <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
        {annotation}
      </p>
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="text-ink-muted"> · {children}</span>;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-hairline underline-offset-4 hover:decoration-ink"
    >
      {children}
    </a>
  );
}
