import { useMemo, useState } from "react";
import { JSONPath } from "jsonpath-plus";
import { diffLines } from "diff";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `{"name":"dev-utility-hub","version":1,"tools":["json","regex","base64"],"meta":{"fast":true}}`;
const SAMPLE_B = `{"name":"dev-utility-hub","version":2,"tools":["json","regex","yaml"],"meta":{"fast":true,"new":true}}`;

type Tab = "format" | "query" | "diff";

const JsonTool = () => {
  const tool = getTool("json")!;
  const [tab, setTab] = useState<Tab>("format");
  const [input, setInput] = useState<string>(SAMPLE);
  const [other, setOther] = useState<string>(SAMPLE_B);
  const [indent, setIndent] = useState<number>(2);
  const [path, setPath] = useState<string>("$.tools[*]");

  const formatResult = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { ok: true, output: indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent), error: null };
    } catch (e) { return { ok: false, output: "", error: (e as Error).message }; }
  }, [input, indent]);

  const queryResult = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      const matches = JSONPath({ path, json: parsed });
      return { ok: true, output: JSON.stringify(matches, null, 2), error: null };
    } catch (e) { return { ok: false, output: "", error: (e as Error).message }; }
  }, [input, path]);

  const diffParts = useMemo(() => {
    try {
      const a = JSON.stringify(JSON.parse(input), null, 2);
      const b = JSON.stringify(JSON.parse(other), null, 2);
      return diffLines(a, b);
    } catch { return null; }
  }, [input, other]);

  const copy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text); toast.success("copied");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant={tab === "format" ? "primary" : "ghost"} onClick={() => setTab("format")}>format</TerminalButton>
        <TerminalButton variant={tab === "query" ? "primary" : "ghost"} onClick={() => setTab("query")}>jsonpath</TerminalButton>
        <TerminalButton variant={tab === "diff" ? "primary" : "ghost"} onClick={() => setTab("diff")}>diff</TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
      </div>

      {tab === "format" && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">indent:</span>
            {[0, 2, 4].map((n) => (
              <TerminalButton key={n} variant={indent === n ? "primary" : "ghost"} onClick={() => setIndent(n)}>
                {n === 0 ? "min" : `${n}sp`}
              </TerminalButton>
            ))}
            <div className="flex-1" />
            <TerminalButton onClick={() => copy(formatResult.output)} disabled={!formatResult.ok || !formatResult.output}>copy</TerminalButton>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-24rem)] min-h-[420px]">
            <TerminalTextarea label="input" value={input} onChange={(e) => setInput(e.target.value)} />
            <OutputPane ok={formatResult.ok} error={formatResult.error}>{formatResult.output}</OutputPane>
          </div>
        </>
      )}

      {tab === "query" && (
        <>
          <div className="mb-3">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">jsonpath expression</span>
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              spellCheck={false}
              className="w-full bg-input/30 border border-border px-3 py-2 mt-1 text-sm font-mono focus:outline-none focus:border-primary"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {["$..*", "$.tools[*]", "$.meta", "$..tools[?(@=='json')]"].map((p) => (
                <TerminalButton key={p} variant="ghost" onClick={() => setPath(p)}>{p}</TerminalButton>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-28rem)] min-h-[380px]">
            <TerminalTextarea label="json" value={input} onChange={(e) => setInput(e.target.value)} />
            <OutputPane label="matches" ok={queryResult.ok} error={queryResult.error}>{queryResult.output}</OutputPane>
          </div>
        </>
      )}

      {tab === "diff" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px] mb-4">
            <TerminalTextarea label="json a" value={input} onChange={(e) => setInput(e.target.value)} />
            <TerminalTextarea label="json b" value={other} onChange={(e) => setOther(e.target.value)} />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">diff</span>
          <pre className="mt-1 border border-border bg-input/30 p-3 text-sm font-mono whitespace-pre-wrap break-words h-[300px] overflow-auto scrollbar-terminal">
            {diffParts ? diffParts.map((p, i) => (
              <span key={i} className={p.added ? "bg-primary/20 text-primary" : p.removed ? "bg-destructive/20 text-destructive line-through" : "text-muted-foreground"}>
                {p.value}
              </span>
            )) : <span className="text-destructive">invalid JSON</span>}
          </pre>
        </>
      )}
    </ToolShell>
  );
};

export default JsonTool;
