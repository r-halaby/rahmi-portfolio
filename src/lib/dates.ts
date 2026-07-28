export const FLEX_DATE_REGEX = /^\d{4}(-\d{2}(-\d{2})?)?$/;
export const FLEX_DATE_HINT = "YYYY, YYYY-MM, or YYYY-MM-DD";

export type DatePrecision = "year" | "month" | "day";

export type FlexDate = {
  precision: DatePrecision;
  date: Date;
  raw: string;
};

export function parseFlexDate(s: string | null | undefined): FlexDate | null {
  if (!s) return null;
  if (/^\d{4}$/.test(s)) {
    return {
      precision: "year",
      date: new Date(`${s}-01-01T00:00:00Z`),
      raw: s,
    };
  }
  if (/^\d{4}-\d{2}$/.test(s)) {
    return {
      precision: "month",
      date: new Date(`${s}-01T00:00:00Z`),
      raw: s,
    };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return {
      precision: "day",
      date: new Date(`${s}T00:00:00Z`),
      raw: s,
    };
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return { precision: "day", date: d, raw: s };
}

export function formatFlexDate(s: string | null | undefined): string | null {
  const p = parseFlexDate(s);
  if (!p) return null;
  const { precision, date } = p;
  if (precision === "year") return String(date.getUTCFullYear());
  if (precision === "month") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonthYear(s: string | null | undefined): string | null {
  const p = parseFlexDate(s);
  if (!p) return null;
  if (p.precision === "year") return String(p.date.getUTCFullYear());
  return p.date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function yearFrom(s: string | null | undefined): number | null {
  const p = parseFlexDate(s);
  return p ? p.date.getUTCFullYear() : null;
}

export function daysAgo(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ms = Date.now() - d.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function durationBetween(
  start: string | null | undefined,
  end: string | null | undefined,
): string | null {
  const s = parseFlexDate(start);
  if (!s) return null;
  const e = end ? parseFlexDate(end) : null;
  const endDate = e ? e.date : new Date();
  const months =
    (endDate.getUTCFullYear() - s.date.getUTCFullYear()) * 12 +
    (endDate.getUTCMonth() - s.date.getUTCMonth()) +
    1;
  if (months < 1) return null;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (mos) parts.push(`${mos} mo${mos > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}
