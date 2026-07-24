import { NavBox } from "@/components/nav-box";

const NAV = [
  { href: "/work", label: "Selected Work" },
  { href: "/writing", label: "Writing" },
  { href: "/photography", label: "Photography" },
  { href: "/reference", label: "Reference Stack" },
  { href: "/futures", label: "Designing Futures" },
  { href: "/wish", label: "Projects I Wish I Made" },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-home text-ink">
      <div className="px-8 py-6 text-sm tracking-wide">RAHMI HALABY</div>
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="grid w-full max-w-3xl grid-cols-6 gap-3">
          {NAV.map((item) => (
            <NavBox key={item.href} {...item} />
          ))}
        </div>
      </div>
      <div className="px-8 py-6">
        <button
          type="button"
          className="text-sm tracking-wide hover:opacity-70"
        >
          -BIO
        </button>
      </div>
    </main>
  );
}
