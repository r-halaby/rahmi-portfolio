import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import {
  fetchArticleMeta,
  fetchArticleReader,
  stripReaderHeaders,
} from "@/lib/articles";
import { client } from "@/sanity/client";
import { articleByIdQuery } from "@/sanity/queries";

type ArticleDoc = {
  _id: string;
  title: string | null;
  publication: string | null;
  category: string | null;
  url: string;
  publishedAt: string | null;
  excerpt: string | null;
};

export const revalidate = 60 * 60 * 24;

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const doc = await client
    .fetch<ArticleDoc | null>(articleByIdQuery, { id: params.id })
    .catch(() => null);

  if (!doc) notFound();

  const [meta, reader] = await Promise.all([
    fetchArticleMeta(doc.url),
    fetchArticleReader(doc.url),
  ]);

  const title = doc.title || meta.title || "Untitled";
  const publication = doc.publication || meta.siteName || null;
  const publishedAt = doc.publishedAt || meta.publishedTime || null;

  const { markdown } = reader ? stripReaderHeaders(reader) : { markdown: "" };
  const bodyHtml = markdown ? marked.parse(markdown) : "";

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link
          href="/writing"
          className="text-sm tracking-wide hover:opacity-70"
        >
          -BACK
        </Link>
      </header>

      <article className="mx-auto max-w-2xl px-8 pb-32 pt-8">
        <div className="mb-2 text-xs uppercase tracking-widest text-ink-muted">
          {[publication, formatDate(publishedAt)].filter(Boolean).join(" · ")}
        </div>
        <h1 className="mb-6 text-4xl leading-tight">{title}</h1>

        {meta.imageUrl && (
          <div
            style={{ aspectRatio: "16 / 9" }}
            className="mb-10 w-full overflow-hidden bg-ink/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.imageUrl}
              alt=""
              className="block h-full w-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {reader ? (
          <div
            className="reader-body space-y-5 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: bodyHtml as string }}
          />
        ) : (
          <p className="text-sm text-ink-muted">
            Couldn't load the article content. You can{" "}
            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              read it on the source site
            </a>
            .
          </p>
        )}

        <div className="mt-16 border-t border-hairline pt-6 text-xs text-ink-muted">
          Originally published at{" "}
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ink"
          >
            {new URL(doc.url).hostname}
          </a>
        </div>
      </article>
    </main>
  );
}
