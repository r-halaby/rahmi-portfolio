"use client";

export function DownloadResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed bottom-8 right-8 z-40 rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 print:hidden"
    >
      Download PDF
    </button>
  );
}
