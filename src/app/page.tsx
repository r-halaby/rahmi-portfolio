import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";
import { BioTrigger } from "@/components/bio-trigger";
import type {
  BioClient,
  BioEducation,
  BioExperience,
} from "@/components/bio-overlay";
import { NavBox } from "@/components/nav-box";
import type { SanitySkill } from "@/components/skill-detail-modal";
import { SkillsTrigger } from "@/components/skills-trigger";
import { SKILL_NAMES } from "@/lib/skills";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { bioQuery, landingQuery, skillsQuery } from "@/sanity/queries";

type LandingKey = "work" | "writing" | "photography" | "reference" | "futures" | "wish";
type Landing = Partial<Record<LandingKey, Image | null>> | null;

type Bio = {
  photo: Image | null;
  body: PortableTextBlock[] | null;
  education: BioEducation[] | null;
  clients: BioClient[] | null;
  experience: BioExperience[] | null;
} | null;

const NAV: { key: LandingKey; href: string; label: string }[] = [
  { key: "work", href: "/work", label: "Selected Work" },
  { key: "writing", href: "/writing", label: "Writing" },
  { key: "photography", href: "/photography", label: "Photography" },
  { key: "reference", href: "/reference", label: "Inspiration" },
  { key: "futures", href: "/futures", label: "Playspace" },
  { key: "wish", href: "/wish", label: "Projects I Wish I Made" },
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

export default async function Home() {
  const [landing, bio, sanitySkills] = await Promise.all([
    client.fetch<Landing>(landingQuery).catch(() => null),
    client.fetch<Bio>(bioQuery).catch(() => null),
    client.fetch<SanitySkill[]>(skillsQuery).catch(() => [] as SanitySkill[]),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col bg-home text-ink">
      <div className="px-8 py-6 text-sm tracking-wide">RAHMI HALABY</div>
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="grid w-full max-w-3xl grid-cols-6 gap-3">
          {NAV.map((item) => (
            <NavBox
              key={item.href}
              href={item.href}
              label={item.label}
              imageUrl={tileUrl(landing?.[item.key])}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 px-8 py-6">
        <SkillsTrigger skills={SKILL_NAMES} sanitySkills={sanitySkills} />
        <BioTrigger
          photoUrl={bioPhotoUrl(bio?.photo)}
          body={bio?.body ?? null}
          education={bio?.education ?? []}
          clients={bio?.clients ?? []}
          experience={bio?.experience ?? []}
        />
      </div>
    </main>
  );
}
