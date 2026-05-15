import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools";

export const TerminalHeader = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.short.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 text-xs md:text-sm font-bold tracking-wide">
            DevHub
          </span>
        </Link>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full bg-input/40 border border-border py-1.5 pl-9 pr-14 text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-1">
            <kbd className="text-[10px] text-muted-foreground border border-border px-1">⌘</kbd>
            <kbd className="text-[10px] text-muted-foreground border border-border px-1">K</kbd>
          </div>

          {open && query && (
            <div className="absolute left-0 right-0 top-full mt-1 border border-border bg-popover max-h-72 overflow-auto scrollbar-terminal z-50">
              {matches.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
              ) : (
                matches.map((t) => (
                  <button
                    key={t.slug}
                    onMouseDown={() => {
                      navigate(`/${t.slug}`);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted hover:text-primary border-b border-border/50 last:border-0"
                  >
                    <span className="text-primary">{t.name}</span>
                    <span className="text-muted-foreground"> — {t.short}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block w-12" />
      </div>
    </header>
  );
};
