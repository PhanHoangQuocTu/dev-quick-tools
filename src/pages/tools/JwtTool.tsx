import { useEffect, useMemo, useState } from "react";
import { jwtVerify } from "jose";
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
    return decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  } catch { return ""; }
};

const JwtTool = () => {
  const tool = getTool("jwt")!;
  const [input, setInput] = useState<string>(SAMPLE);
  const [secret, setSecret] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "ok" | "fail">("idle");
  const [verifyMsg, setVerifyMsg] = useState("");

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true, header: null as object | null, payload: null as object | null, error: null as string | null };
    const parts = trimmed.split(".");
    if (parts.length !== 3) return { ok: false, header: null, payload: null, error: "JWT must have 3 parts" };
    try {
      return { ok: true, header: JSON.parse(decodeBase64(parts[0])), payload: JSON.parse(decodeBase64(parts[1])), error: null };
    } catch (e) { return { ok: false, header: null, payload: null, error: (e as Error).message }; }
  }, [input]);

  useEffect(() => { setVerifyStatus("idle"); setVerifyMsg(""); }, [input, secret]);

  const verify = async () => {
    try {
      const key = new TextEncoder().encode(secret);
      await jwtVerify(input.trim(), key);
      setVerifyStatus("ok"); setVerifyMsg("Signature valid · claims OK");
    } catch (e) {
      setVerifyStatus("fail"); setVerifyMsg((e as Error).message);
    }
  };

  const copy = async (obj: object | null) => {
    if (!obj) return;
    await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    toast.success("copied");
  };

  const exp = (result.payload as { exp?: number } | null)?.exp;
  const expired = exp && exp * 1000 < Date.now();

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <div className="flex-1" />
        <TerminalButton onClick={() => copy(result.header)} disabled={!result.header}>copy header</TerminalButton>
        <TerminalButton onClick={() => copy(result.payload)} disabled={!result.payload}>copy payload</TerminalButton>
      </div>

      <TerminalTextarea label="token" value={input} onChange={(e) => setInput(e.target.value)} rows={4}
        placeholder="eyJhbGciOi..." wrapperClassName="mb-4" />

      <div className="border border-border bg-input/30 p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">verify (HMAC)</span>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="shared secret..."
            className="flex-1 min-w-[200px] bg-input/30 border border-border px-2 py-1 text-sm font-mono focus:outline-none focus:border-primary"
          />
          <TerminalButton onClick={verify} disabled={!secret || !input}>verify</TerminalButton>
          {verifyStatus === "ok" && <span className="text-xs text-primary">✓ {verifyMsg}</span>}
          {verifyStatus === "fail" && <span className="text-xs text-destructive">✗ {verifyMsg}</span>}
        </div>
        {exp && (
          <div className="text-xs mt-2 font-mono">
            exp: {new Date(exp * 1000).toLocaleString()}{" "}
            <span className={expired ? "text-destructive" : "text-primary"}>[{expired ? "expired" : "valid"}]</span>
          </div>
        )}
      </div>

      {result.ok && result.header && result.payload ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[360px]">
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">header</span>
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">payload</span>
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <pre className="w-full bg-input/30 border border-destructive/60 text-destructive p-3 text-sm font-mono min-h-[100px]">{result.error}</pre>
      )}
    </ToolShell>
  );
};

export default JwtTool;
