import { GardenVideoPlayer } from "@/components/garden-video-player";
import { resolveEmbed } from "@/lib/covers";
import { client } from "@/sanity/client";
import { welcomeQuery } from "@/sanity/queries";

type WelcomeDoc = {
  videoEmbedUrl: string | null;
  videoFile: {
    asset?: { url?: string | null; mimeType?: string | null } | null;
  } | null;
  portfolioUrl: string | null;
  loomUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  email: string | null;
} | null;

type LinkEntry = { label: string; href: string };

export const revalidate = 60;

export default async function GardenPage() {
  const doc = await client
    .fetch<WelcomeDoc>(welcomeQuery)
    .catch(() => null);

  const videoFileUrl = doc?.videoFile?.asset?.url ?? null;
  const embedResolved = doc?.videoEmbedUrl
    ? resolveEmbed(doc.videoEmbedUrl)
    : null;

  const rowOne: LinkEntry[] = [];
  if (doc?.portfolioUrl) {
    rowOne.push({ label: "Portfolio", href: doc.portfolioUrl });
  }
  if (doc?.loomUrl) {
    rowOne.push({ label: "Loom", href: doc.loomUrl });
  }

  const rowTwo: LinkEntry[] = [];
  if (doc?.instagramUrl) {
    rowTwo.push({ label: "Instagram", href: doc.instagramUrl });
  }
  if (doc?.linkedinUrl) {
    rowTwo.push({ label: "LinkedIn", href: doc.linkedinUrl });
  }
  if (doc?.email) {
    rowTwo.push({ label: "Email", href: `mailto:${doc.email}` });
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-home text-ink">
      <div className="flex items-center justify-between px-8 py-6 text-sm tracking-wide">
        <span>RAHMI HALABY</span>
        <span>HEAD OF MARKETING AND COMMUNICATION AT GARDEN3D</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8 pb-16">
        {videoFileUrl ? (
          <GardenVideoPlayer src={videoFileUrl} />
        ) : embedResolved ? (
          <div
            style={{ aspectRatio: "16 / 9", maxWidth: "900px" }}
            className="w-full overflow-hidden bg-ink/5"
          >
            <iframe
              src={embedResolved.src}
              title="Rahmi Halaby"
              allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              className="block h-full w-full border-0"
            />
          </div>
        ) : null}

        {(rowOne.length > 0 || rowTwo.length > 0) && (
          <div className="flex flex-col items-center gap-3 text-sm tracking-widest">
            {rowOne.length > 0 && <LinkRow links={rowOne} />}
            {rowTwo.length > 0 && <LinkRow links={rowTwo} />}
          </div>
        )}
      </div>
    </main>
  );
}

function LinkRow({ links }: { links: LinkEntry[] }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-3">
      {links.map((l, i) => (
        <span key={l.label} className="flex items-center gap-3">
          {i > 0 && <span className="text-ink-muted">|</span>}
          <a
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            className="uppercase hover:opacity-70"
          >
            {l.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
