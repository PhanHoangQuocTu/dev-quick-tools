import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";

const FLAGS = ["g", "i", "m", "s", "u", "y"] as const;
type Flag = (typeof FLAGS)[number];

const RegexTool = () => {
  const tool = getTool("regex")!;
  const [pattern, setPattern] = useState<string>("\\b(\\w+)@(\\w+\\.\\w+)\\b");
  const [flags, setFlags] = useState<Set<Flag>>(new Set(["g", "i"]));
  const [text, setText] = useState<string>(
    "Contact us: hello@dev.io or admin@example.com for more info.",
  );

  const toggleFlag = (f: Flag) =>
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const { regex, error } = useMemo(() => {
    try {
      return { regex: new RegExp(pattern, [...flags].join("")), error: null as string | null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !text) return [];
    const out: { match: string; index: number; groups: string[] }[] = [];
    if (regex.global) {
      let m: RegExpExecArray | null;
      const re = new RegExp(regex.source, regex.flags);
      while ((m = re.exec(text)) !== null) {
        out.push({ match: m[0], index: m.index, groups: m.slice(1) });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    } else {
      const m = regex.exec(text);
      if (m) out.push({ match: m[0], index: m.index, groups: m.slice(1) });
    }
    return out;
  }, [regex, text]);

  const highlighted = useMemo(() => {
    if (!regex || matches.length === 0) return null;
    const parts: { text: string; mark: boolean }[] = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.index > cursor) parts.push({ text: text.slice(cursor, m.index), mark: false });
      parts.push({ text: m.match, mark: true });
      cursor = m.index + m.match.length;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), mark: false });
    return parts;
  }, [matches, regex, text]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">pattern</span>
          <div className="flex items-stretch border border-border focus-within:border-primary mt-1.5">
            <span className="px-2 py-2 text-muted-foreground bg-input/30">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-input/30 px-2 py-2 text-sm font-mono focus:outline-none"
            />
            <span className="px-2 py-2 text-muted-foreground bg-input/30">/</span>
            <span className="px-2 py-2 text-primary bg-input/30 text-sm font-mono min-w-[60px]">{[...flags].join("")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {FLAGS.map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-2 py-1 text-[11px] uppercase tracking-widest border transition-colors ${
                  flags.has(f)
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-[11px] uppercase tracking-widest">
              {error ? (
                <span className="text-destructive">[ {error} ]</span>
              ) : (
                <span className="text-primary">[ {matches.length} match{matches.length === 1 ? "" : "es"} ]</span>
              )}
            </span>
          </div>
        </div>

        <TerminalTextarea
          label="test_string"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />

        {highlighted && (
          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">highlighted</span>
            <div className="mt-1.5 border border-border bg-input/30 p-3 text-sm font-mono whitespace-pre-wrap break-words">
              {highlighted.map((p, i) =>
                p.mark ? (
                  <mark key={i} className="bg-primary text-primary-foreground px-0.5">{p.text}</mark>
                ) : (
                  <span key={i}>{p.text}</span>
                ),
              )}
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">matches // {matches.length}</span>
            <div className="mt-1.5 border border-border max-h-64 overflow-auto scrollbar-terminal">
              <table className="w-full text-sm font-mono">
                <thead className="bg-muted/40 text-muted-foreground text-[11px] uppercase">
                  <tr>
                    <th className="text-left px-3 py-2 w-12">#</th>
                    <th className="text-left px-3 py-2 w-20">idx</th>
                    <th className="text-left px-3 py-2">match</th>
                    <th className="text-left px-3 py-2">groups</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 text-muted-foreground">{m.index}</td>
                      <td className="px-3 py-2 text-primary break-all">{m.match}</td>
                      <td className="px-3 py-2 break-all">
                        {m.groups.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          m.groups.map((g, gi) => (
                            <span key={gi} className="mr-2">
                              <span className="text-muted-foreground">${gi + 1}</span> {g}
                            </span>
                          ))
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default RegexTool;
