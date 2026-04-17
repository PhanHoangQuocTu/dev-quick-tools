import { useMemo, useState } from "react";
import { diffWords, diffLines } from "diff";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";

type Mode = "lines" | "words";

const DiffTool = () => {
  const tool = getTool("diff")!;
  const [left, setLeft] = useState("the quick brown fox\njumps over the lazy dog");
  const [right, setRight] = useState("the quick red fox\njumps over the sleepy dog");
  const [mode, setMode] = useState<Mode>("words");

  const parts = useMemo(() => {
    return mode === "lines" ? diffLines(left, right) : diffWords(left, right);
  }, [left, right, mode]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    parts.forEach((p) => {
      if (p.added) added += p.value.length;
      else if (p.removed) removed += p.value.length;
    });
    return { added, removed };
  }, [parts]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">granularity:</span>
        <TerminalButton variant={mode === "words" ? "primary" : "ghost"} onClick={() => setMode("words")}>words</TerminalButton>
        <TerminalButton variant={mode === "lines" ? "primary" : "ghost"} onClick={() => setMode("lines")}>lines</TerminalButton>
        <div className="flex-1" />
        <span className="text-[11px] uppercase tracking-widest">
          <span className="text-primary">+{stats.added}</span>{" "}
          <span className="text-destructive">-{stats.removed}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TerminalTextarea label="original" value={left} onChange={(e) => setLeft(e.target.value)} rows={12} />
        <TerminalTextarea label="modified" value={right} onChange={(e) => setRight(e.target.value)} rows={12} />
      </div>

      <div className="mt-4">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">unified_diff</span>
        <pre className="mt-1.5 border border-border bg-input/30 p-3 text-sm font-mono whitespace-pre-wrap break-words min-h-[180px] overflow-auto scrollbar-terminal">
          {parts.map((p, i) => (
            <span
              key={i}
              className={
                p.added
                  ? "bg-primary/20 text-primary"
                  : p.removed
                    ? "bg-destructive/20 text-destructive line-through"
                    : "text-muted-foreground"
              }
            >
              {p.value}
            </span>
          ))}
        </pre>
      </div>
    </ToolShell>
  );
};

export default DiffTool;
