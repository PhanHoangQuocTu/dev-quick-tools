import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldiBVc2VyIiwiYWRtaW4iOnRydWUsImlhdCI6MTY5NzQ0MDAwMCwiZXhwIjoxOTc0MDAwMDAwfQ.signature";

const decodeBase64 = (str: string): string => {
  try {
    const padding = "=".repeat((4 - (str.length % 4)) % 4);
    const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    try {
      const padding = "=".repeat((4 - (str.length % 4)) % 4);
      const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");
      return atob(base64);
    } catch {
      return "";
    }
  }
};

const JwtTool = () => {
  const tool = getTool("jwt")!;
  const [input, setInput] = useState<string>(SAMPLE);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, header: null as object | null, payload: null as object | null, error: null as string | null };

    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      return { ok: false, header: null, payload: null, error: "JWT must have 3 dot-separated parts (header.payload.signature)" };
    }

    try {
      const headerRaw = decodeBase64(parts[0]);
      const payloadRaw = decodeBase64(parts[1]);
      const header = JSON.parse(headerRaw);
      const payload = JSON.parse(payloadRaw);
      return { ok: true, header, payload, error: null };
    } catch (e) {
      return { ok: false, header: null, payload: null, error: (e as Error).message };
    }
  }, [input]);

  const copy = async (obj: object | null) => {
    if (!obj) return;
    await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <div className="flex-1" />
        <TerminalButton onClick={() => copy(result.header)} disabled={!result.header}>copy header</TerminalButton>
        <TerminalButton onClick={() => copy(result.payload)} disabled={!result.payload}>copy payload</TerminalButton>
      </div>

      <TerminalTextarea
        label="token"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        className="mb-4"
      />

      {result.ok && result.header && result.payload ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[360px]">
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">header</span>
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">payload</span>
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <pre className="w-full bg-input/30 border border-destructive/60 text-destructive p-3 text-sm font-mono overflow-auto scrollbar-terminal min-h-[100px] whitespace-pre-wrap">
          {result.error}
        </pre>
      )}
    </ToolShell>
  );
};

export default JwtTool;
