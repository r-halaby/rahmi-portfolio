import Link from "next/link";
import type { Image } from "sanity";
import { DownloadResumeButton } from "@/components/download-resume-button";
import {
  ExperienceList,
  type ExperienceRole,
} from "@/components/experience-list";
import {
  VolunteerList,
  type VolunteerRole,
} from "@/components/volunteer-list";
import { daysAgo, yearFrom } from "@/lib/dates";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  bioQuery,
  educationsQuery,
  rolesQuery,
  volunteersQuery,
  workUpdatedQuery,
} from "@/sanity/queries";

type Role = ExperienceRole;

type Education = {
  _id: string;
  institution: string;
  logo: Image | null;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  activities: string | null;
  coursework: string | null;
};

type Volunteer = VolunteerRole;

type Client = { name: string; url: string | null };
type BioEducation = {
  institution: string;
  program: string | null;
  location: string | null;
  activities: string | null;
  coursework: string | null;
};
type BioForWork = {
  clients: Client[] | null;
  education: BioEducation[] | null;
} | null;

export const revalidate = 60;

function yearOnly(iso: string | null | undefined): string | null {
  const y = yearFrom(iso);
  return y == null ? null : String(y);
}

function logoUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(120).height(120).fit("crop").auto("format").url();
}

export default async function ExperiencePage() {
  const [roles, educations, volunteers, bio, updatedAt] = await Promise.all([
    client.fetch<Role[]>(rolesQuery).catch(() => [] as Role[]),
    client.fetch<Education[]>(educationsQuery).catch(() => [] as Education[]),
    client.fetch<Volunteer[]>(volunteersQuery).catch(() => [] as Volunteer[]),
    client.fetch<BioForWork>(bioQuery).catch(() => null),
    client.fetch<string | null>(workUpdatedQuery).catch(() => null),
  ]);
  const clients = bio?.clients ?? [];
  const bioEducations = bio?.education ?? [];
  const updated = daysAgo(updatedAt);

  return (
    <main className="min-h-screen bg-warm text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link
          href="/"
          className="text-sm tracking-wide hover:opacity-70 print:hidden"
        >
          BACK
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-8 pb-32 pt-6">
        <h1 className="mb-16 text-4xl">
          Work
          {updated && (
            <span className="ml-3 align-middle text-xs font-normal text-ink-muted">
              (updated {updated})
            </span>
          )}
        </h1>

        {roles.length > 0 && (
          <Section title="Experience">
            <ExperienceList roles={roles} />
          </Section>
        )}

        {clients.length > 0 && (
          <Section title="Clients">
            <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-base">
              {clients.map((c, i) =>
                c.url ? (
                  <a
                    key={`${c.name}-${i}`}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-70"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span key={`${c.name}-${i}`}>{c.name}</span>
                ),
              )}
            </div>
          </Section>
        )}

        {volunteers.length > 0 && (
          <Section title="Volunteering">
            <VolunteerList roles={volunteers} />
          </Section>
        )}

        {(educations.length > 0 || bioEducations.length > 0) && (
          <Section title="Education">
            <div className="space-y-10">
              {educations.map((e) => (
                <EducationEntry key={e._id} entry={e} />
              ))}
              {bioEducations.map((e, i) => (
                <BioEducationEntry key={`bio-edu-${i}`} entry={e} />
              ))}
            </div>
          </Section>
        )}

        {roles.length === 0 &&
          educations.length === 0 &&
          volunteers.length === 0 && (
            <p className="text-sm text-ink-muted">—</p>
          )}
      </div>
      <DownloadResumeButton />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 border-b border-hairline pb-2 text-6xl leading-none">
        {title}
      </h2>
      {children}
    </section>
  );
}

function LogoBox({ image, size = 64 }: { image: Image | null; size?: number }) {
  const url = logoUrl(image);
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 overflow-hidden bg-ink/5"
    >
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="block h-full w-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

function EducationEntry({ entry }: { entry: Education }) {
  const startY = yearOnly(entry.startDate);
  const endY = yearOnly(entry.endDate);
  const yearLine = [startY, endY].filter(Boolean).join(" – ");
  const degreeLine = [entry.degree, entry.fieldOfStudy]
    .filter(Boolean)
    .join(", ");
  return (
    <div>
      <LogoBox image={entry.logo} />
      <div className="mt-3 text-xl leading-tight">{entry.institution}</div>
      <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        {degreeLine && <div>{degreeLine}</div>}
        {yearLine && <div>{yearLine}</div>}
      </div>
      {(entry.activities || entry.coursework) && (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
          {entry.activities && (
            <div>
              <span className="text-xs uppercase tracking-wide text-ink-muted">
                Activities and Societies:{" "}
              </span>
              {entry.activities}
            </div>
          )}
          {entry.coursework && (
            <div>
              <span className="text-xs uppercase tracking-wide text-ink-muted">
                Coursework Included:{" "}
              </span>
              {entry.coursework}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BioEducationEntry({ entry }: { entry: BioEducation }) {
  return (
    <div>
      <div className="text-xl leading-tight">{entry.institution}</div>
      <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        {entry.program && <div>{entry.program}</div>}
        {entry.location && <div>{entry.location}</div>}
      </div>
      {(entry.activities || entry.coursework) && (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
          {entry.activities && (
            <div>
              <span className="text-xs uppercase tracking-wide text-ink-muted">
                Activities and Societies:{" "}
              </span>
              {entry.activities}
            </div>
          )}
          {entry.coursework && (
            <div>
              <span className="text-xs uppercase tracking-wide text-ink-muted">
                Coursework Included:{" "}
              </span>
              {entry.coursework}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

