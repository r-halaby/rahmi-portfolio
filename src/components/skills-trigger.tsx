"use client";

import { useMemo, useState } from "react";
import {
  SkillDetailModal,
  type SanitySkill,
} from "./skill-detail-modal";
import { SkillsOverlay } from "./skills-overlay";

type Props = {
  skills: string[];
  sanitySkills: SanitySkill[];
};

export function SkillsTrigger({ skills, sanitySkills }: Props) {
  const [listOpen, setListOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const skillMap = useMemo(() => {
    const map = new Map<string, SanitySkill>();
    for (const s of sanitySkills) {
      if (s?.name) map.set(s.name, s);
    }
    return map;
  }, [sanitySkills]);

  const selectedSkill = selectedName ? skillMap.get(selectedName) ?? null : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setListOpen((prev) => !prev)}
        className="text-sm tracking-wide hover:opacity-70"
      >
        -SKILLS
      </button>
      <SkillsOverlay
        open={listOpen}
        onClose={() => setListOpen(false)}
        skills={skills}
        onSelect={(name) => setSelectedName(name)}
      />
      <SkillDetailModal
        open={selectedName !== null}
        onClose={() => setSelectedName(null)}
        name={selectedName ?? ""}
        skill={selectedSkill}
      />
    </>
  );
}
