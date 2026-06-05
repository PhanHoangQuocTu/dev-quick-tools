import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";

const EXPLAIN: Record<string, string> = {
  "content-type": "Media type of the resource (e.g. application/json).",
  "content-length": "Size of the body in bytes.",
  "content-encoding": "Compression applied (gzip, br, deflate).",
  "cache-control": "Caching directives for browsers and proxies.",
  "etag": "Identifier for a specific resource version (used for conditional requests).",
  "last-modified": "When the resource was last modified.",
  "expires": "When the cached response becomes stale (HTTP/1.0).",
  "authorization": "Credentials for authenticating with the server.",
  "cookie": "Cookies sent from client to server.",
  "set-cookie": "Cookies set by the server on the client.",
  "user-agent": "Identifies the client (browser, app).",
  "referer": "URL of the page that linked to this request.",
  "host": "Target host and port.",
  "accept": "Media types the client can handle.",
  "accept-encoding": "Encodings the client supports (e.g. gzip).",
  "accept-language": "Preferred languages.",
  "access-control-allow-origin": "CORS: which origins may read this response.",
  "access-control-allow-methods": "CORS: allowed HTTP methods.",
  "access-control-allow-headers": "CORS: which request headers are allowed.",
  "strict-transport-security": "Forces HTTPS for a duration (HSTS).",
  "x-frame-options": "Controls if page can be embedded in iframe (clickjacking).",
  "x-content-type-options": "nosniff prevents MIME-type sniffing.",
  "content-security-policy": "Policies controlling resource loading (XSS defense).",
  "x-xss-protection": "Legacy XSS protection toggle (mostly deprecated).",
  "referrer-policy": "How much referrer info to send.",
  "location": "Target URL for redirects.",
  "server": "Server software identifier.",
  "x-powered-by": "Framework/runtime that handled the request.",
  "x-request-id": "Unique request identifier (tracing).",
  "x-forwarded-for": "Original client IP behind a proxy.",
  "x-forwarded-proto": "Original protocol (http/https) behind a proxy.",
  "retry-after": "When client may retry (rate-limit / 503).",
  "www-authenticate": "Challenge for authentication scheme.",
  "vary": "Which request headers affect the cached response.",
};

const HeadersTool = () => {
  const tool = getTool("headers")!;
  const [input, setInput] = useState(`HTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nCache-Control: max-age=3600, public\nETag: "abc123"\nAccess-Control-Allow-Origin: *\nStrict-Transport-Security: max-age=31536000`);

  const rows = useMemo(() => {
    return input
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l.includes(":"))
      .map((l) => {
        const i = l.indexOf(":");
        const name = l.slice(0, i).trim();
        const value = l.slice(i + 1).trim();
        return { name, value, explain: EXPLAIN[name.toLowerCase()] ?? "—" };
      });
  }, [input]);

  return (
    <ToolShell tool={tool}>
      <TerminalTextarea
        label="paste raw headers"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        wrapperClassName="mb-4"
      />
      <div className="border border-border bg-input/30">
        <table className="w-full text-sm font-mono">
          <thead className="bg-muted/40 text-muted-foreground text-[11px] uppercase">
            <tr><th className="text-left px-3 py-2">header</th><th className="text-left px-3 py-2">value</th><th className="text-left px-3 py-2">explanation</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                <td className="px-3 py-2 text-primary">{r.name}</td>
                <td className="px-3 py-2 break-all">{r.value}</td>
                <td className="px-3 py-2 text-muted-foreground text-xs">{r.explain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
};

export default HeadersTool;
