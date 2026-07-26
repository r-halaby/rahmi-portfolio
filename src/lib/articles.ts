const REVALIDATE_24H = 60 * 60 * 24;

export type ArticleMeta = {
  title: string | null;
  siteName: string | null;
  publishedTime: string | null;
  imageUrl: string | null;
};

const EMPTY: ArticleMeta = {
  title: null,
  siteName: null,
  publishedTime: null,
  imageUrl: null,
};

function decodeEntities(s: string | null): string | null {
  if (!s) return s;
  return s
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pickMeta(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(`<meta\\s+[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return decodeEntities(m[1]);
  }
  return null;
}

export async function fetchArticleMeta(url: string): Promise<ArticleMeta> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_24H },
      headers: { "User-Agent": "Mozilla/5.0 (portfolio bot)" },
    });
    if (!res.ok) return EMPTY;
    const html = await res.text();
    return {
      title: pickMeta(html, "og:title"),
      siteName: pickMeta(html, "og:site_name"),
      publishedTime: pickMeta(html, "article:published_time"),
      imageUrl:
        pickMeta(html, "og:image") ??
        pickMeta(html, "twitter:image") ??
        null,
    };
  } catch {
    return EMPTY;
  }
}

export async function fetchArticleReader(url: string): Promise<string | null> {
  try {
    const readerUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(readerUrl, {
      next: { revalidate: REVALIDATE_24H },
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "markdown",
      },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

const READER_HEADER_RE = /^(Title|URL Source|Published Time|Markdown Content):\s?(.*)$/m;

export function stripReaderHeaders(raw: string): { markdown: string } {
  const lines = raw.split("\n");
  const bodyStart = lines.findIndex((l) => /^Markdown Content:/i.test(l));
  if (bodyStart === -1) return { markdown: raw };
  return { markdown: lines.slice(bodyStart + 1).join("\n").trim() };
}

void READER_HEADER_RE;
