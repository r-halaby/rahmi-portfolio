export function DownloadResumeButton() {
  return (
    <a
      href="/rahmi-resume.pdf"
      download="Rahmi-Resume.pdf"
      className="fixed bottom-8 right-8 z-40 rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 print:hidden"
    >
      Download PDF
    </a>
  );
}
