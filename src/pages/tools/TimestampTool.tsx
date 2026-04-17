import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Unit = "s" | "ms";

const TimestampTool = () => {
  const tool = getTool("timestamp")!;
  const [now, setNow] = useState(() => Date.now());
  const [tsInput, setTsInput] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<Unit>("s");
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = useMemo(() => {
    const n = Number(tsInput.trim());
    if (!tsInput.trim() || Number.isNaN(n)) return null;
    const ms = unit === "s" ? n * 1000 : n;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [tsInput, unit]);

  const fromDate = useMemo(() => {
    if (!dateInput.trim()) return null;
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [dateInput]);

  const copy = async (txt: string) => {
    await navigator.clipboard.writeText(txt);
    toast.success("copied");
  };

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Now */}
        <div className="border border-border p-4 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">now // live</span>
          <div className="text-2xl font-bold tabular-nums glow-text">{Math.floor(now / 1000)}</div>
          <div className="text-xs text-muted-foreground tabular-nums">{now} ms</div>
          <div className="text-xs text-muted-foreground">{new Date(now).toISOString()}</div>
          <div className="mt-2 flex gap-2">
            <TerminalButton onClick={() => copy(String(Math.floor(now / 1000)))}>copy s</TerminalButton>
            <TerminalButton variant="ghost" onClick={() => copy(String(now))}>copy ms</TerminalButton>
          </div>
        </div>

        {/* TS -> date */}
        <div className="border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">timestamp → date</span>
            <div className="flex gap-1">
              <TerminalButton variant={unit === "s" ? "primary" : "ghost"} onClick={() => setUnit("s")}>s</TerminalButton>
              <TerminalButton variant={unit === "ms" ? "primary" : "ghost"} onClick={() => setUnit("ms")}>ms</TerminalButton>
            </div>
          </div>
          <input
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            spellCheck={false}
            className="w-full bg-input/30 border border-border p-2 text-sm font-mono focus:outline-none focus:border-primary"
            placeholder="1700000000"
          />
          {fromTs ? (
            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-muted-foreground">iso</div>
              <code className="text-sm break-all">{fromTs.toISOString()}</code>
              <div className="text-xs text-muted-foreground mt-1">local</div>
              <code className="text-sm break-all">{fromTs.toString()}</code>
            </div>
          ) : tsInput.trim() ? (
            <div className="text-xs text-destructive">invalid number</div>
          ) : null}
        </div>

        {/* Date -> ts */}
        <div className="border border-border p-4 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">date → timestamp</span>
          <input
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            spellCheck={false}
            className="w-full bg-input/30 border border-border p-2 text-sm font-mono focus:outline-none focus:border-primary"
            placeholder="2024-01-01T00:00:00Z"
          />
          {fromDate ? (
            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-muted-foreground">unix (s)</div>
              <code className="text-sm">{Math.floor(fromDate.getTime() / 1000)}</code>
              <div className="text-xs text-muted-foreground mt-1">unix (ms)</div>
              <code className="text-sm">{fromDate.getTime()}</code>
            </div>
          ) : dateInput.trim() ? (
            <div className="text-xs text-destructive">invalid date string</div>
          ) : null}
        </div>
      </div>
    </ToolShell>
  );
};

export default TimestampTool;
