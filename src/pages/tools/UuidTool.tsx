import { useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const genUuid = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const UuidTool = () => {
  const tool = getTool("uuid")!;
  const [count, setCount] = useState(10);
  const [upper, setUpper] = useState(false);
  const [output, setOutput] = useState<string>(() =>
    Array.from({ length: 10 }, () => genUuid()).join("\n"),
  );

  const generate = () => {
    const n = Math.max(1, Math.min(1000, Number(count) || 1));
    const ids = Array.from({ length: n }, () => genUuid());
    setOutput((upper ? ids.map((s) => s.toUpperCase()) : ids).join("\n"));
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="text-[11px] uppercase tracking-widest text-muted-foreground">count:</label>
        <input
          type="number"
          min={1}
          max={1000}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 bg-input/30 border border-border px-2 py-1 text-sm font-mono focus:outline-none focus:border-primary"
        />
        <TerminalButton variant={upper ? "primary" : "ghost"} onClick={() => setUpper((v) => !v)}>
          uppercase
        </TerminalButton>
        <div className="flex-1" />
        <TerminalButton onClick={generate}>generate</TerminalButton>
        <TerminalButton variant="ghost" onClick={copy} disabled={!output}>copy</TerminalButton>
      </div>

      <div className="h-[calc(100vh-22rem)] min-h-[420px]">
        <OutputPane ok>{output}</OutputPane>
      </div>
    </ToolShell>
  );
};

export default UuidTool;
