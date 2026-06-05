import { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `SELECT u.id, u.email, p.title, p.created_at FROM users u JOIN posts p ON u.id = p.user_id WHERE p.status = 'published' AND u.active = true ORDER BY p.created_at DESC LIMIT 20;`;

type Dialect = "postgresql" | "mysql" | "sqlite" | "bigquery" | "redshift" | "spark" | "sql";

const SqlTool = () => {
  const tool = getTool("sql")!;
  const [input, setInput] = useState<string>(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");

  const [mode, setMode] = useState<"pretty" | "minify">("pretty");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      if (mode === "minify") {
        const out = input
          .replace(/--[^\n]*/g, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s+/g, " ")
          .replace(/\s*([(),;])\s*/g, "$1")
          .trim();
        return { ok: true, output: out, error: null };
      }
      const output = format(input, {
        language: dialect,
        keywordCase: keywordCase as any,
        linesBetweenQueries: 2,
      });
      return { ok: true, output, error: null };
    } catch (e) {
      return { ok: false, output: "", error: (e as Error).message };
    }
  }, [input, dialect, keywordCase, mode]);

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">dialect:</span>
        {(["postgresql", "mysql", "sqlite", "sql"] as Dialect[]).map((d) => (
          <TerminalButton
            key={d}
            variant={dialect === d ? "primary" : "ghost"}
            onClick={() => setDialect(d)}
          >
            {d}
          </TerminalButton>
        ))}
        <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">case:</span>
        {(["upper", "lower", "preserve"] as const).map((c) => (
          <TerminalButton
            key={c}
            variant={keywordCase === c ? "primary" : "ghost"}
            onClick={() => setKeywordCase(c)}
          >
            {c}
          </TerminalButton>
        ))}
        <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
        <TerminalButton variant={mode === "pretty" ? "primary" : "ghost"} onClick={() => setMode("pretty")}>pretty</TerminalButton>
        <TerminalButton variant={mode === "minify" ? "primary" : "ghost"} onClick={() => setMode("minify")}>minify</TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!result.ok || !result.output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-24rem)] min-h-[420px]">
        <TerminalTextarea
          label="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE active = true;"
        />
        <OutputPane ok={result.ok} error={result.error}>
          {result.output}
        </OutputPane>
      </div>
    </ToolShell>
  );
};

export default SqlTool;
