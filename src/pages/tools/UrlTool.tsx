import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = "https://user:pass@api.example.com:8443/v1/users?role=admin&active=true&tags=a&tags=b#section";

const UrlTool = () => {
  const tool = getTool("url")!;
  const [input, setInput] = useState(SAMPLE);

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: true as const, url: null };
    try {
      const u = new URL(trimmed);
      const params: { key: string; value: string }[] = [];
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }));
      return {
        ok: true as const,
        url: {
          href: u.href,
          protocol: u.protocol,
          username: u.username,
          password: u.password,
          host: u.host,
          hostname: u.hostname,
          port: u.port,
          pathname: u.pathname,
          search: u.search,
          hash: u.hash,
          origin: u.origin,
          params,
        },
      };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [input]);

  const copy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("copied");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
      </div>

      <TerminalTextarea
        label="url"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        placeholder="https://example.com/path?query=1"
        className="mb-4"
      />

      {!parsed.ok ? (
        <pre className="w-full bg-input/30 border border-destructive/60 text-destructive p-3 text-sm font-mono whitespace-pre-wrap">
          {parsed.error}
        </pre>
      ) : parsed.url ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              ["protocol", parsed.url.protocol],
              ["hostname", parsed.url.hostname],
              ["port", parsed.url.port || "—"],
              ["pathname", parsed.url.pathname],
              ["origin", parsed.url.origin],
              ["hash", parsed.url.hash || "—"],
              ["username", parsed.url.username || "—"],
              ["password", parsed.url.password ? "•••" : "—"],
            ].map(([k, v]) => (
              <button
                key={k}
                onClick={() => copy(String(v))}
                className="flex flex-col items-start gap-1 border border-border bg-input/20 hover:border-primary p-3 text-left transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</span>
                <span className="text-sm font-mono break-all">{v}</span>
              </button>
            ))}
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              query params ({parsed.url.params.length})
            </span>
            <div className="mt-1.5 border border-border bg-input/20 divide-y divide-border">
              {parsed.url.params.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">no params</div>
              ) : (
                parsed.url.params.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr] gap-2 p-2 text-sm font-mono">
                    <span className="text-primary truncate">{p.key}</span>
                    <span className="break-all">{p.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
};

export default UrlTool;
