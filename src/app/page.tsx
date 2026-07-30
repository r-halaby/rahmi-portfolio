import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";
import { BioTrigger } from "@/components/bio-trigger";
import type {
  BioClient,
  BioEducation,
  BioExperience,
} from "@/components/bio-overlay";
import { LandingBackground } from "@/components/landing-background";
import { NavBox } from "@/components/nav-box";
import { SidePanel } from "@/components/side-panel";
import type { SanitySkill } from "@/components/skill-detail-modal";
import { SkillsTrigger } from "@/components/skills-trigger";
import { getBacklog } from "@/lib/backlog";
import { SKILL_NAMES } from "@/lib/skills";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  bioQuery,
  landingQuery,
  skillsQuery,
  wallpapersQuery,
} from "@/sanity/queries";

type LandingKey = "work" | "writing" | "photography" | "reference" | "futures" | "wish";
type Landing = Partial<Record<LandingKey, Image | null>> | null;

type Bio = {
  photo: Image | null;
  photoCaption: string | null;
  body: PortableTextBlock[] | null;
  education: BioEducation[] | null;
  clients: BioClient[] | null;
  experience: BioExperience[] | null;
} | null;

type WallpaperItem = Image & {
  _key: string;
  title: string | null;
};

const NAV: {
  key: LandingKey;
  href: string;
  label: string;
  labelKey: string;
}[] = [
  { key: "work", href: "/work", label: "Experience", labelKey: "nav.experience" },
  { key: "writing", href: "/writing", label: "Writing", labelKey: "nav.writing" },
  { key: "photography", href: "/photography", label: "Photography", labelKey: "nav.photography" },
  { key: "reference", href: "/reference", label: "Inspiration", labelKey: "nav.reference" },
  { key: "futures", href: "/futures", label: "Playspace", labelKey: "nav.futures" },
  { key: "wish", href: "/wish", label: "Projects I Wish I Made", labelKey: "nav.wish" },
];

function tileUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image)
    .width(600)
    .height(600)
    .fit("crop")
    .auto("format")
    .url();
}

function bioPhotoUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(560).auto("format").url();
}

export const revalidate = 60;

function wallpaperImage(item: WallpaperItem, w: number, h?: number) {
  if (!item.asset) return null;
  const b = urlFor(item).width(w);
  return (h ? b.height(h).fit("crop") : b).auto("format").url();
}

export default async function Home() {
  const [landing, bio, sanitySkills, wallpaperItems, backlog] = await Promise.all([
    client.fetch<Landing>(landingQuery).catch(() => null),
    client.fetch<Bio>(bioQuery).catch(() => null),
    client.fetch<SanitySkill[]>(skillsQuery).catch(() => [] as SanitySkill[]),
    client.fetch<WallpaperItem[]>(wallpapersQuery).catch(() => [] as WallpaperItem[]),
    getBacklog().catch(() => ({
      createdAt: null,
      updatedAt: null,
      totalCommits: 0,
      daysSpanned: 0,
      activity: [],
      entries: [],
    })),
  ]);

  const wallpapers = (wallpaperItems ?? [])
    .filter((w) => w?.asset)
    .map((w) => ({
      _id: w._key,
      title: w.title,
      imageUrl: wallpaperImage(w, 2400) ?? "",
      thumbUrl: wallpaperImage(w, 200, 200) ?? "",
    }))
    .filter((w) => w.imageUrl && w.thumbUrl);

  return (
    <>
    <main
      data-landing
      className="relative flex min-h-screen flex-col bg-home text-ink"
    >
      <LandingBackground />
      <div className="relative z-10 px-8 py-6 text-sm tracking-wide">RAHMI HALABY</div>
      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {NAV.map((item) => (
            <NavBox
              key={item.href}
              href={item.href}
              label={item.label}
              labelKey={item.labelKey}
              imageUrl={tileUrl(landing?.[item.key])}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-start gap-2 px-8 py-6">
        <SkillsTrigger skills={SKILL_NAMES} sanitySkills={sanitySkills} />
        <BioTrigger
          photoUrl={bioPhotoUrl(bio?.photo)}
          photoCaption={bio?.photoCaption ?? null}
          body={bio?.body ?? null}
          experience={bio?.experience ?? []}
        />
      </div>
    </main>
    <SidePanel wallpapers={wallpapers} backlog={backlog} />
    </>
  );
}
