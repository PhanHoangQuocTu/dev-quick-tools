import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Mode = "base64" | "url";
type Direction = "encode" | "decode";

const utf8ToBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};

const base64ToUtf8 = (str: string) => {
  const bin = atob(str.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const EncodeTool = () => {
  const tool = getTool("encode")!;
  const [input, setInput] = useState("hello world");
  const [mode, setMode] = useState<Mode>("base64");
  const [direction, setDirection] = useState<Direction>("encode");

  const result = useMemo(() => {
    if (!input) return { ok: true, output: "", error: null as string | null };
    try {
      let output = "";
      if (mode === "base64") {
        output = direction === "encode" ? utf8ToBase64(input) : base64ToUtf8(input);
      } else {
        output = direction === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      }
      return { ok: true, output, error: null };
    } catch (e) {
      return { ok: false, output: "", error: (e as Error).message };
    }
  }, [input, mode, direction]);

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant={mode === "base64" ? "primary" : "ghost"} onClick={() => setMode("base64")}>base64</TerminalButton>
        <TerminalButton variant={mode === "url" ? "primary" : "ghost"} onClick={() => setMode("url")}>url</TerminalButton>
        <span className="mx-2 text-muted-foreground text-xs">//</span>
        <TerminalButton variant={direction === "encode" ? "primary" : "ghost"} onClick={() => setDirection("encode")}>encode</TerminalButton>
        <TerminalButton variant={direction === "decode" ? "primary" : "ghost"} onClick={() => setDirection("decode")}>decode</TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!result.ok || !result.output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[380px]">
        <TerminalTextarea
          label="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <OutputPane ok={result.ok} error={result.error}>
          {result.output}
        </OutputPane>
      </div>
    </ToolShell>
  );
};

export default EncodeTool;
