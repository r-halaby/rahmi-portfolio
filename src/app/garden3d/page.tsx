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
  resumeFile: {
    asset?: { url?: string | null; originalFilename?: string | null } | null;
  } | null;
} | null;

export const revalidate = 60;

export default async function WelcomePage() {
  const doc = await client
    .fetch<WelcomeDoc>(welcomeQuery)
    .catch(() => null);

  const videoFileUrl = doc?.videoFile?.asset?.url ?? null;
  const embedResolved = doc?.videoEmbedUrl
    ? resolveEmbed(doc.videoEmbedUrl)
    : null;

  const links: { label: string; href: string; download?: boolean }[] = [];
  if (doc?.portfolioUrl) {
    links.push({ label: "Portfolio", href: doc.portfolioUrl });
  }
  if (doc?.loomUrl) {
    links.push({ label: "Loom", href: doc.loomUrl });
  }
  const resumeUrl = doc?.resumeFile?.asset?.url;
  if (resumeUrl) {
    links.push({ label: "Resume", href: resumeUrl, download: true });
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-home text-ink">
      <div className="px-8 py-6 text-sm tracking-wide">RAHMI HALABY</div>

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

        {links.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-8 text-sm tracking-widest">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                download={l.download ? "" : undefined}
                className="uppercase hover:opacity-70"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </main>
  );
}
