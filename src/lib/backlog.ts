import { unstable_cache } from "next/cache";

export type BacklogEntry = {
  sha: string;
  date: string;
  message: string;
};

export type ActivityPoint = {
  date: string; // YYYY-MM-DD
  count: number;
};

export type Backlog = {
  createdAt: string | null;
  updatedAt: string | null;
  totalCommits: number;
  daysSpanned: number;
  activity: ActivityPoint[];
  entries: BacklogEntry[];
};

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
};

type GitHubRepo = {
  created_at: string;
  updated_at: string;
  pushed_at: string;
};

const REPO = "r-halaby/rahmi-portfolio";
const COMMIT_LIMIT = 100;
const RECENT_LIMIT = 20;

function ghHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchRepo(): Promise<GitHubRepo | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: ghHeaders(),
    next: { revalidate: 60 * 30 },
  });
  if (!res.ok) return null;
  return (await res.json()) as GitHubRepo;
}

async function fetchCommits(): Promise<GitHubCommit[]> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/commits?per_page=${COMMIT_LIMIT}`,
    { headers: ghHeaders(), next: { revalidate: 60 * 30 } },
  );
  if (!res.ok) return [];
  return (await res.json()) as GitHubCommit[];
}

function toDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildActivity(
  commits: GitHubCommit[],
  createdAt: string | null,
): ActivityPoint[] {
  if (commits.length === 0) return [];
  const counts = new Map<string, number>();
  for (const c of commits) {
    const key = toDayKey(c.commit.author.date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const startIso = createdAt ?? commits[commits.length - 1].commit.author.date;
  const start = new Date(toDayKey(startIso));
  const end = new Date(toDayKey(new Date().toISOString()));
  const days: ActivityPoint[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = toDayKey(cursor.toISOString());
    days.push({ date: key, count: counts.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

async function buildBacklog(): Promise<Backlog> {
  const [repo, commits] = await Promise.all([fetchRepo(), fetchCommits()]);

  const activity = buildActivity(commits, repo?.created_at ?? null);

  const entries: BacklogEntry[] = commits.slice(0, RECENT_LIMIT).map((c) => ({
    sha: c.sha.slice(0, 7),
    date: c.commit.author.date,
    message: c.commit.message.split("\n")[0],
  }));

  return {
    createdAt: repo?.created_at ?? null,
    updatedAt: repo?.pushed_at ?? repo?.updated_at ?? null,
    totalCommits: commits.length,
    daysSpanned: activity.length,
    activity,
    entries,
  };
}

export const getBacklog = unstable_cache(buildBacklog, ["backlog-v4"], {
  revalidate: 60 * 30,
  tags: ["backlog"],
});
