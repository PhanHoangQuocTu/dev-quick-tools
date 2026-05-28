import { useEffect, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Algo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const ALGOS: Algo[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const HashTool = () => {
  const tool = getTool("hash")!;
  const [input, setInput] = useState("hello world");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [output, setOutput] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = new TextEncoder().encode(input);
        const buf = await crypto.subtle.digest(algo, data);
        if (!cancelled) setOutput(toHex(buf));
      } catch (e) {
        if (!cancelled) setOutput((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input, algo]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">algorithm:</span>
        {ALGOS.map((a) => (
          <TerminalButton key={a} variant={algo === a ? "primary" : "ghost"} onClick={() => setAlgo(a)}>
            {a.toLowerCase()}
          </TerminalButton>
        ))}
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[380px]">
        <TerminalTextarea
          label="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="text to hash..."
        />
        <OutputPane ok>{output}</OutputPane>
      </div>
    </ToolShell>
  );
};

export default HashTool;
