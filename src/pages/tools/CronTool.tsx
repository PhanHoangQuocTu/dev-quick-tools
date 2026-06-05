import { useMemo, useState } from "react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";

const PRESETS = [
  { label: "Every 5 min", v: "*/5 * * * *" },
  { label: "Hourly", v: "0 * * * *" },
  { label: "Daily 9am", v: "0 9 * * *" },
  { label: "Weekly Mon", v: "0 9 * * 1" },
  { label: "Monthly 1st", v: "0 0 1 * *" },
  { label: "Workdays", v: "0 9 * * 1-5" },
];

const CronTool = () => {
  const tool = getTool("cron")!;
  const [expr, setExpr] = useState("*/5 * * * *");

  const result = useMemo(() => {
    try {
      const human = cronstrue.toString(expr, { use24HourTimeFormat: true });
      const it = CronExpressionParser.parse(expr);
      const next: string[] = [];
      for (let i = 0; i < 8; i++) next.push(it.next().toDate().toLocaleString());
      return { ok: true, human, next, err: null as string | null };
    } catch (e) {
      return { ok: false, human: "", next: [], err: (e as Error).message };
    }
  }, [expr]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">expression</span>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            spellCheck={false}
            className="w-full bg-input/30 border border-border px-3 py-3 text-lg font-mono mt-1.5 focus:outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESETS.map((p) => (
              <TerminalButton key={p.v} variant="ghost" onClick={() => setExpr(p.v)}>
                {p.label}
              </TerminalButton>
            ))}
          </div>
        </div>

        {result.ok ? (
          <>
            <div className="border border-border bg-input/30 p-4">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">human</div>
              <div className="text-primary font-mono">{result.human}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">next 8 runs</div>
              <div className="border border-border bg-input/30 divide-y divide-border/60">
                {result.next.map((d, i) => (
                  <div key={i} className="px-3 py-2 text-sm font-mono flex justify-between">
                    <span className="text-muted-foreground">#{i + 1}</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <pre className="border border-destructive/60 bg-input/30 text-destructive p-3 text-sm font-mono">{result.err}</pre>
        )}
      </div>
    </ToolShell>
  );
};

export default CronTool;
