import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `{"name":"dev-utility-hub","version":1,"tools":["json","regex","base64"],"meta":{"fast":true}}`;

const JsonTool = () => {
  const tool = getTool("json")!;
  const [input, setInput] = useState<string>(SAMPLE);
  const [indent, setIndent] = useState<number>(2);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return {
        ok: true,
        output: indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent),
        error: null,
      };
    } catch (e) {
      return { ok: false, output: "", error: (e as Error).message };
    }
  }, [input, indent]);

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">indent:</span>
        {[0, 2, 4].map((n) => (
          <TerminalButton
            key={n}
            variant={indent === n ? "primary" : "ghost"}
            onClick={() => setIndent(n)}
          >
            {n === 0 ? "min" : `${n}sp`}
          </TerminalButton>
        ))}
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!result.ok || !result.output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea
          label="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"hello": "world"}'
        />
        <OutputPane ok={result.ok} error={result.error}>
          {result.output}
        </OutputPane>
      </div>
    </ToolShell>
  );
};

export default JsonTool;
