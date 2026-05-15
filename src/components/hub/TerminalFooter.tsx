export const TerminalFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
        <div>Dev Utility Hub © {year} — built for developers. No login, no tracking.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary">Feedback</a>
          <a href="#" className="hover:text-primary">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
