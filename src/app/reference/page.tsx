import Link from "next/link";
import { client } from "@/sanity/client";
import {
  albumsQuery,
  booksQuery,
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
  youtubeEmbedUrl,
} from "@/lib/covers";

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

type Album = {
  _id: string;
  title: string;
  artist: string;
  year: number | null;
  annotation: string;
  url: string | null;
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
  annotation: string;
};

type Mix = {
  _id: string;
  title: string;
  url: string;
  annotation: string;
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
  const [intros, movies, books, albums, mixes, software, talks, nonprofits] =
    await Promise.all([
      client.fetch<Intros>(referenceIntrosQuery).catch(() => null),
      client.fetch<Movie[]>(moviesQuery).catch(() => [] as Movie[]),
      client.fetch<Book[]>(booksQuery).catch(() => [] as Book[]),
      client.fetch<Album[]>(albumsQuery).catch(() => [] as Album[]),
      client.fetch<Mix[]>(mixesQuery).catch(() => [] as Mix[]),
      client.fetch<Software[]>(softwareQuery).catch(() => [] as Software[]),
      client.fetch<Talk[]>(talksQuery).catch(() => [] as Talk[]),
      client.fetch<Nonprofit[]>(nonprofitsQuery).catch(() => [] as Nonprofit[]),
    ]);

  const [bookCovers, albumCovers, movieCovers] = await Promise.all([
    Promise.all(books.map((b) => bookCover(b.title, b.author))),
    Promise.all(albums.map((a) => albumCover(a.title, a.artist))),
    Promise.all(movies.map((m) => movieCover(m.title, m.year))),
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
        <h1 className="mb-16 text-4xl">Inspiration</h1>

        <Section title="Books" intro={intros?.booksIntro} empty={books.length === 0}>
          {books.map((b, i) => (
            <Entry
              key={b._id}
              coverUrl={bookCovers[i]}
              coverAspect="portrait"
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

        <Section title="Talks" intro={intros?.talksIntro} empty={talks.length === 0}>
          {talks.map((t) => (
            <Entry
              key={t._id}
              coverUrl={talkCover(t.url)}
              coverAspect="video"
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

        <Section title="Albums" intro={intros?.albumsIntro} empty={albums.length === 0}>
          {albums.map((a, i) => (
            <Entry
              key={a._id}
              coverUrl={albumCovers[i]}
              coverAspect="square"
              header={
                <>
                  {a.url ? (
                    <ExternalLink href={a.url}>{a.title}</ExternalLink>
                  ) : (
                    <span>{a.title}</span>
                  )}
                  <Meta>
                    {a.artist}
                    {a.year ? ` · ${a.year}` : ""}
                  </Meta>
                </>
              }
              annotation={a.annotation}
            />
          ))}
        </Section>

        <Section
          title="Mixes"
          intro={intros?.mixesIntro}
          empty={mixes.length === 0}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {mixes.map((m) => {
              const embed = youtubeEmbedUrl(m.url);
              return (
                <div key={m._id}>
                  {embed ? (
                    <div className="mb-3 aspect-video w-full overflow-hidden bg-ink/5">
                      <iframe
                        src={embed}
                        title={m.title}
                        allow="accelerometer; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 aspect-video w-full bg-ink/5" />
                  )}
                  <div className="mb-1 text-base">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-hairline underline-offset-4 hover:decoration-ink"
                    >
                      {m.title}
                    </a>
                  </div>
                  <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
                    {m.annotation}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Movies" intro={intros?.moviesIntro} empty={movies.length === 0}>
          {movies.map((m, i) => (
            <Entry
              key={m._id}
              coverUrl={movieCovers[i]}
              coverAspect="portrait"
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

        <Section
          title="Software"
          intro={intros?.softwareIntro}
          empty={software.length === 0}
        >
          <div className="grid grid-cols-4 gap-x-8 gap-y-8">
            {software.map((s) => (
              <Entry
                key={s._id}
                coverUrl={softwareCover(s.url)}
                coverAspect="square"
                header={<ExternalLink href={s.url}>{s.name}</ExternalLink>}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Nonprofits"
          intro={intros?.nonprofitsIntro}
          empty={nonprofits.length === 0}
        >
          {nonprofits.map((n) => (
            <Entry
              key={n._id}
              coverUrl={softwareCover(n.url)}
              coverAspect="square"
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
        <p className="mb-8 max-w-prose text-sm leading-relaxed text-ink-muted">
          {intro}
        </p>
      )}
      {!intro && <div className="mb-6" />}
      {empty ? (
        <p className="text-sm text-ink-muted">—</p>
      ) : (
        <div className="space-y-6">{children}</div>
      )}
    </section>
  );
}

type CoverAspect = "portrait" | "square" | "video";

function Entry({
  coverUrl,
  coverAspect,
  header,
  annotation,
}: {
  coverUrl: string | null;
  coverAspect: CoverAspect;
  header: React.ReactNode;
  annotation?: string | null;
}) {
  const coverSize =
    coverAspect === "portrait"
      ? "h-24 w-16"
      : coverAspect === "video"
        ? "h-16 w-28"
        : "h-16 w-16";
  return (
    <div className="flex gap-4">
      <div className={`shrink-0 overflow-hidden bg-ink/5 ${coverSize}`}>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="block h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-base">{header}</div>
        {annotation && (
          <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
            {annotation}
          </p>
        )}
      </div>
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
