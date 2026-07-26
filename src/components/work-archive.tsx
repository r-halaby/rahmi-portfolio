"use client";

import { useMemo, useState } from "react";

export type WorkRow = {
  _id: string;
  title: string;
  client: string | null;
  category: string | null;
  year: number | null;
};

type Sort = { key: "year" | "category"; dir: "asc" | "desc" };

export function WorkArchive({ rows }: { rows: WorkRow[] }) {
  const [sort, setSort] = useState<Sort | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sort]);

  const toggle = (key: Sort["key"]) =>
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" },
    );

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-hairline text-ink-muted">
          <th className="w-12 py-3 text-left font-normal">No.</th>
          <SortHeader label="Year" active={sort?.key === "year"} dir={sort?.dir ?? "desc"} onClick={() => toggle("year")} className="w-24" />
          <th className="py-3 text-left font-normal">Title</th>
          <th className="w-56 py-3 text-right font-normal">Client</th>
          <SortHeader label="Category" active={sort?.key === "category"} dir={sort?.dir ?? "desc"} onClick={() => toggle("category")} className="w-48 text-right" />
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr
            key={r._id}
            className="border-b border-hairline text-ink-muted transition-colors hover:text-ink"
          >
            <td className="py-4">{i + 1}</td>
            <td className="py-4">{r.year ?? "—"}</td>
            <td className="py-4">{r.title}</td>
            <td className="py-4 text-right">{r.client ?? "—"}</td>
            <td className="py-4 text-right">{r.category ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={`py-3 text-left font-normal ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 hover:text-ink ${
          className.includes("text-right") ? "flex-row-reverse" : ""
        }`}
      >
        {label}
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${
            active && dir === "asc" ? "rotate-180" : ""
          } ${active ? "opacity-100" : "opacity-40"}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </th>
  );
}
