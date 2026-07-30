import { unstable_cache } from "next/cache";

export type BacklogEntry = {
  sha: string;
  date: string;
  message: string;
};

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
};

const REPO = "r-halaby/rahmi-portfolio";
const LIMIT = 20;

async function fetchCommits(): Promise<GitHubCommit[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/commits?per_page=${LIMIT}`,
    { headers, next: { revalidate: 60 * 30 } },
  );
  if (!res.ok) return [];
  return (await res.json()) as GitHubCommit[];
}

async function translateBatch(subjects: string[]): Promise<string[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return subjects;

  const prompt = `Rewrite each of the following git commit subjects in plain, friendly English that a non-technical reader can understand. Keep each rewrite to one short sentence. Return exactly ${subjects.length} lines, one per input, in the same order, with no numbering or bullets.\n\n${subjects
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n")}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return subjects;
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
    if (lines.length !== subjects.length) return subjects;
    return lines;
  } catch {
    return subjects;
  }
}

async function buildBacklog(): Promise<BacklogEntry[]> {
  const commits = await fetchCommits();
  if (commits.length === 0) return [];

  const subjects = commits.map((c) => c.commit.message.split("\n")[0]);
  const messages = await translateBatch(subjects);

  return commits.map((c, i) => ({
    sha: c.sha.slice(0, 7),
    date: c.commit.author.date,
    message: messages[i] ?? subjects[i],
  }));
}

export const getBacklog = unstable_cache(buildBacklog, ["backlog-v1"], {
  revalidate: 60 * 60 * 6,
  tags: ["backlog"],
});
