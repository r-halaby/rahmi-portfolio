const REVALIDATE_24H = 60 * 60 * 24;

async function safeFetch(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_24H } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function encode(s: string) {
  return encodeURIComponent(s.trim());
}

// --- Books: OpenLibrary ---------------------------------------------------
export async function bookCover(title: string, author: string) {
  const url = `https://openlibrary.org/search.json?title=${encode(title)}&author=${encode(author)}&limit=1`;
  const data = (await safeFetch(url)) as
    | { docs?: Array<{ cover_i?: number }> }
    | null;
  const coverId = data?.docs?.[0]?.cover_i;
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;
}

// --- Albums: iTunes Search ------------------------------------------------
export async function albumCover(title: string, artist: string) {
  const term = `${title} ${artist}`;
  const url = `https://itunes.apple.com/search?entity=album&limit=1&term=${encode(term)}`;
  const data = (await safeFetch(url)) as
    | { results?: Array<{ artworkUrl100?: string }> }
    | null;
  const art = data?.results?.[0]?.artworkUrl100;
  return art ? art.replace(/\/\d+x\d+bb\.jpg$/, "/600x600bb.jpg") : null;
}

// --- Movies: TMDB ---------------------------------------------------------
export async function movieCover(title: string, year?: number | null) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const params = new URLSearchParams({
    api_key: key,
    query: title,
  });
  if (year) params.set("year", String(year));
  const url = `https://api.themoviedb.org/3/search/movie?${params.toString()}`;
  const data = (await safeFetch(url)) as
    | { results?: Array<{ poster_path?: string | null }> }
    | null;
  const poster = data?.results?.[0]?.poster_path;
  return poster ? `https://image.tmdb.org/t/p/w500${poster}` : null;
}

// --- Talks: YouTube thumbnail from URL -----------------------------------
export function talkCover(url: string): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function youtubeIdFromUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1) || null;
    }
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch) return shortsMatch[1];
      const embedMatch = url.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return embedMatch[1];
    }
    return null;
  } catch {
    return null;
  }
}

// --- Software: favicon from URL ------------------------------------------
export function softwareCover(url: string): string | null {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}
