import Link from "next/link";
import type { Image } from "sanity";
import { CoverTile } from "@/components/cover-tile";
import { urlFor } from "@/sanity/image";
import { client } from "@/sanity/client";
import { daysAgo } from "@/lib/dates";
import {
  albumsQuery,
  booksQuery,
  inspirationUpdatedQuery,
  mixesQuery,
  moviesQuery,
  nonprofitsQuery,
  referenceIntrosQuery,
  softwareQuery,
  talksQuery,
} from "@/sanity/queries";
import {
  albumCover,
  bookCover,
  movieCover,
  softwareCover,
  talkCover,
} from "@/lib/covers";

type Movie = {
  _id: string;
  title: string;
  director: string;
  year: number;
  annotation: string | null;
  url: string | null;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  yearRead: number | null;
  annotation: string | null;
  url: string | null;
  coverImage: Image | null;
};

type Album = {
  _id: string;
  title: string;
  artist: string;
  year: number | null;
  annotation: string | null;
  url: string | null;
  coverImage: Image | null;
};

type Software = {
  _id: string;
  name: string;
  url: string;
};

type Talk = {
  _id: string;
  title: string;
  speaker: string;
  url: string;
  annotation: string | null;
};

type Mix = {
  _id: string;
  title: string;
  url: string;
  annotation: string | null;
};

type Nonprofit = {
  _id: string;
  name: string;
  url: string;
  oneLiner: string;
};

type Intros = {
  booksIntro: string | null;
  talksIntro: string | null;
  albumsIntro: string | null;
  mixesIntro: string | null;
  moviesIntro: string | null;
  softwareIntro: string | null;
  nonprofitsIntro: string | null;
} | null;

export const revalidate = 60;

export default async function ReferencePage() {
  const [
    intros,
    movies,
    books,
    albums,
    mixes,
    software,
    talks,
    nonprofits,
    updatedAt,
  ] = await Promise.all([
    client.fetch<Intros>(referenceIntrosQuery).catch(() => null),
    client.fetch<Movie[]>(moviesQuery).catch(() => [] as Movie[]),
    client.fetch<Book[]>(booksQuery).catch(() => [] as Book[]),
    client.fetch<Album[]>(albumsQuery).catch(() => [] as Album[]),
    client.fetch<Mix[]>(mixesQuery).catch(() => [] as Mix[]),
    client.fetch<Software[]>(softwareQuery).catch(() => [] as Software[]),
    client.fetch<Talk[]>(talksQuery).catch(() => [] as Talk[]),
    client.fetch<Nonprofit[]>(nonprofitsQuery).catch(() => [] as Nonprofit[]),
    client.fetch<string | null>(inspirationUpdatedQuery).catch(() => null),
  ]);
  const updated = daysAgo(updatedAt);

  const [bookCoversFetched, albumCoversFetched, movieCovers] = await Promise.all([
    Promise.all(books.map((b) => bookCover(b.title, b.author))),
    Promise.all(albums.map((a) => albumCover(a.title, a.artist))),
    Promise.all(movies.map((m) => movieCover(m.title, m.year))),
  ]);

  const bookCovers = books.map((b, i) => {
    if (b.coverImage?.asset) {
      return urlFor(b.coverImage)
        .width(400)
        .height(600)
        .fit("crop")
        .auto("format")
        .url();
    }
    return bookCoversFetched[i];
  });

  const albumCovers = albums.map((a, i) => {
    if (a.coverImage?.asset) {
      return urlFor(a.coverImage)
        .width(600)
        .height(600)
        .fit("crop")
        .auto("format")
        .url();
    }
    return albumCoversFetched[i];
  });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-8 pb-32 pt-8">
        <h1 className="mb-16 text-4xl">
          Inspiration
          {updated && (
            <span className="ml-3 align-middle text-xs font-normal text-ink-muted">
              (updated {updated})
            </span>
          )}
        </h1>

        <Section title="Books" intro={intros?.booksIntro} empty={books.length === 0}>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-6">
            {books.map((b, i) => (
              <CoverTile
                key={b._id}
                imageUrl={bookCovers[i]}
                href={b.url}
                aspect="portrait"
                label={`${b.title} — ${b.author}`}
              />
            ))}
          </div>
        </Section>

        <Section title="Talks" intro={intros?.talksIntro} empty={talks.length === 0}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {talks.map((t) => (
              <CoverTile
                key={t._id}
                imageUrl={talkCover(t.url)}
                href={t.url}
                aspect="video"
                label={`${t.title} — ${t.speaker}`}
              />
            ))}
          </div>
        </Section>

        <Section title="Albums" intro={intros?.albumsIntro} empty={albums.length === 0}>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-6">
            {albums.map((a, i) => (
              <CoverTile
                key={a._id}
                imageUrl={albumCovers[i]}
                href={a.url}
                aspect="square"
                label={`${a.title} — ${a.artist}${a.year ? ` (${a.year})` : ""}`}
              />
            ))}
          </div>
        </Section>

        <Section title="Mixes" intro={intros?.mixesIntro} empty={mixes.length === 0}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {mixes.map((m) => (
              <CoverTile
                key={m._id}
                imageUrl={talkCover(m.url)}
                href={m.url}
                aspect="video"
                label={m.title}
              />
            ))}
          </div>
        </Section>

        <Section title="Movies" intro={intros?.moviesIntro} empty={movies.length === 0}>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-6">
            {movies.map((m, i) => (
              <CoverTile
                key={m._id}
                imageUrl={movieCovers[i]}
                href={m.url}
                aspect="portrait"
                label={`${m.title} — ${m.director}${m.year ? ` (${m.year})` : ""}`}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Software"
          intro={intros?.softwareIntro}
          empty={software.length === 0}
        >
          <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
            {software.map((s) => (
              <CoverTile
                key={s._id}
                imageUrl={softwareCover(s.url)}
                href={s.url}
                aspect="square"
                label={s.name}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Community Organizations"
          intro={intros?.nonprofitsIntro}
          empty={nonprofits.length === 0}
        >
          <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
            {nonprofits.map((n) => (
              <CoverTile
                key={n._id}
                imageUrl={softwareCover(n.url)}
                href={n.url}
                aspect="square"
                label={`${n.name} — ${n.oneLiner}`}
              />
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  intro,
  children,
  empty,
}: {
  title: string;
  intro?: string | null;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-2 text-xs uppercase tracking-widest text-ink-muted">
        {title}
      </h2>
      {intro && (
        <p className="mb-6 text-sm leading-relaxed text-ink-muted">
          {intro}
        </p>
      )}
      {empty ? (
        <p className="text-sm text-ink-muted">—</p>
      ) : (
        <div>{children}</div>
      )}
    </section>
  );
}
