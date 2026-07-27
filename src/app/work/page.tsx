import Link from "next/link";
import type { Image } from "sanity";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { educationsQuery, rolesQuery, volunteersQuery } from "@/sanity/queries";

type GalleryImage = Image & { caption?: string | null };

type Role = {
  _id: string;
  title: string;
  company: string;
  logo: Image | null;
  employmentType: string | null;
  workMode: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gallery: GalleryImage[] | null;
};

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

type Volunteer = {
  _id: string;
  role: string;
  organization: string;
  logo: Image | null;
  cause: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

export const revalidate = 60;

function formatMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function yearOnly(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const y = iso.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : null;
}

function durationBetween(start: string, end: string | null): string | null {
  if (!start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth()) +
    1;
  if (months < 1) return null;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (mos) parts.push(`${mos} mo${mos > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

function titleCase(s: string | null): string | null {
  if (!s) return s;
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

function logoUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(120).height(120).fit("crop").auto("format").url();
}

export default async function ExperiencePage() {
  const [roles, educations, volunteers] = await Promise.all([
    client.fetch<Role[]>(rolesQuery).catch(() => [] as Role[]),
    client.fetch<Education[]>(educationsQuery).catch(() => [] as Education[]),
    client.fetch<Volunteer[]>(volunteersQuery).catch(() => [] as Volunteer[]),
  ]);

  return (
    <main className="min-h-screen bg-warm text-ink">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-sm tracking-wide">RAHMI HALABY</div>
        <Link href="/" className="text-sm tracking-wide hover:opacity-70">
          -BACK
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-8 pb-32 pt-6">
        <h1 className="mb-16 text-4xl">Work</h1>

        {roles.length > 0 && (
          <Section title="Experience">
            <div className="space-y-10">
              {roles.map((r) => (
                <RoleEntry key={r._id} entry={r} />
              ))}
            </div>
          </Section>
        )}

        {educations.length > 0 && (
          <Section title="Education">
            <div className="space-y-10">
              {educations.map((e) => (
                <EducationEntry key={e._id} entry={e} />
              ))}
            </div>
          </Section>
        )}

        {volunteers.length > 0 && (
          <Section title="Volunteering">
            <div className="space-y-10">
              {volunteers.map((v) => (
                <VolunteerEntry key={v._id} entry={v} />
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

function RoleEntry({ entry }: { entry: Role }) {
  const start = formatMonthYear(entry.startDate);
  const end = entry.endDate ? formatMonthYear(entry.endDate) : "Present";
  const duration = durationBetween(entry.startDate, entry.endDate);
  const companyLine = [entry.company, titleCase(entry.employmentType)]
    .filter(Boolean)
    .join(" · ");
  const dateLine = [
    [start, end].filter(Boolean).join(" – "),
    duration,
  ]
    .filter(Boolean)
    .join(" · ");
  const locLine = [entry.location, titleCase(entry.workMode)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <LogoBox image={entry.logo} />
      <div className="mt-3 text-xl leading-tight">{entry.title}</div>
      <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        {companyLine && <div>{companyLine}</div>}
        {dateLine && <div>{dateLine}</div>}
        {locLine && <div>{locLine}</div>}
      </div>
      {entry.description && (
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {entry.description}
        </p>
      )}
      {entry.gallery && entry.gallery.length > 0 && (
        <RoleCarousel images={entry.gallery} />
      )}
    </div>
  );
}

function RoleCarousel({ images }: { images: GalleryImage[] }) {
  return (
    <div className="mt-4 -mx-8 overflow-x-auto px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex gap-3"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((img, i) => {
          const url = img?.asset
            ? urlFor(img).width(1200).auto("format").url()
            : null;
          if (!url) return null;
          return (
            <figure
              key={img.asset?._ref ?? i}
              className="shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={img.caption ?? ""}
                className="block h-64 w-auto object-cover"
                loading="lazy"
              />
              {img.caption && (
                <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
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

function VolunteerEntry({ entry }: { entry: Volunteer }) {
  const start = formatMonthYear(entry.startDate);
  const end = entry.endDate ? formatMonthYear(entry.endDate) : "Present";
  const duration = durationBetween(entry.startDate, entry.endDate);
  const dateLine = [
    [start, end].filter(Boolean).join(" – "),
    duration,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <LogoBox image={entry.logo} />
      <div className="mt-3 text-xl leading-tight">{entry.role}</div>
      <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        <div>{entry.organization}</div>
        {dateLine && <div>{dateLine}</div>}
        {entry.cause && <div>{entry.cause}</div>}
      </div>
      {entry.description && (
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {entry.description}
        </p>
      )}
    </div>
  );
}
