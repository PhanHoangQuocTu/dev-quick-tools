import { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `SELECT u.id, u.email, p.title, p.created_at FROM users u JOIN posts p ON u.id = p.user_id WHERE p.status = 'published' AND u.active = true ORDER BY p.created_at DESC LIMIT 20;`;

type Dialect = "postgresql" | "mysql" | "sqlite" | "bigquery" | "redshift" | "spark" | "sql";

const SqlTool = () => {
  const tool = getTool("sql")!;
  const [input, setInput] = useState<string>(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      const output = format(input, {
        language: dialect,
        keywordCase: keywordCase as any,
        linesBetweenQueries: 2,
      });
      return { ok: true, output, error: null };
    } catch (e) {
      return { ok: false, output: "", error: (e as Error).message };
    }
  }, [input, dialect, keywordCase]);

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
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!result.ok || !result.output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TerminalTextarea
          label="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={18}
          placeholder="SELECT * FROM users WHERE active = true;"
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            output {result.ok ? <span className="text-primary">[ ok ]</span> : <span className="text-destructive">[ err ]</span>}
          </span>
          {result.ok ? (
            <pre className="w-full bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal min-h-[420px] whitespace-pre-wrap break-all">
              {result.output}
            </pre>
          ) : (
            <pre className="w-full bg-input/30 border border-destructive/60 text-destructive p-3 text-sm font-mono overflow-auto scrollbar-terminal min-h-[420px] whitespace-pre-wrap">
              {result.error}
            </pre>
          )}
        </div>
      </div>
    </ToolShell>
  );
};

export default SqlTool;
