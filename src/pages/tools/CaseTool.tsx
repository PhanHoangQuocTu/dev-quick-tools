import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const splitWords = (input: string): string[] => {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-./]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const transforms: { label: string; fn: (w: string[]) => string }[] = [
  { label: "camelCase", fn: (w) => w.map((s, i) => (i === 0 ? s.toLowerCase() : s[0].toUpperCase() + s.slice(1).toLowerCase())).join("") },
  { label: "PascalCase", fn: (w) => w.map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join("") },
  { label: "snake_case", fn: (w) => w.map((s) => s.toLowerCase()).join("_") },
  { label: "CONSTANT_CASE", fn: (w) => w.map((s) => s.toUpperCase()).join("_") },
  { label: "kebab-case", fn: (w) => w.map((s) => s.toLowerCase()).join("-") },
  { label: "Title Case", fn: (w) => w.map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ") },
  { label: "Sentence case", fn: (w) => { const s = w.map((x) => x.toLowerCase()).join(" "); return s ? s[0].toUpperCase() + s.slice(1) : ""; } },
  { label: "lower case", fn: (w) => w.join(" ").toLowerCase() },
  { label: "UPPER CASE", fn: (w) => w.join(" ").toUpperCase() },
  { label: "path/case", fn: (w) => w.map((s) => s.toLowerCase()).join("/") },
  { label: "dot.case", fn: (w) => w.map((s) => s.toLowerCase()).join(".") },
];

const CaseTool = () => {
  const tool = getTool("case")!;
  const [input, setInput] = useState("hello world from dev hub");

  const words = useMemo(() => splitWords(input), [input]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput("hello world from dev hub")}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
      </div>

      <TerminalTextarea
        label="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Enter any text..."
        className="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {transforms.map(({ label, fn }) => {
          const out = fn(words);
          return (
            <button
              key={label}
              onClick={() => copy(out)}
              className="flex flex-col items-start gap-1 border border-border bg-input/20 hover:border-primary hover:bg-muted/40 transition-colors p-3 text-left group"
            >
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                {label}
              </span>
              <span className="text-sm font-mono break-all w-full">{out || <span className="text-muted-foreground">—</span>}</span>
            </button>
          );
        })}
      </div>
    </ToolShell>
  );
};

export default CaseTool;
