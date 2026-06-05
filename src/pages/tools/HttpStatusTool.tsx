import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { getTool } from "@/lib/tools";

interface Status { code: number; name: string; desc: string; rfc: string; }

const STATUSES: Status[] = [
  { code: 100, name: "Continue", desc: "Server received headers; client should send body.", rfc: "RFC9110#15.2.1" },
  { code: 101, name: "Switching Protocols", desc: "Server agrees to switch protocols (e.g. WebSocket).", rfc: "RFC9110#15.2.2" },
  { code: 200, name: "OK", desc: "Request succeeded.", rfc: "RFC9110#15.3.1" },
  { code: 201, name: "Created", desc: "New resource created.", rfc: "RFC9110#15.3.2" },
  { code: 202, name: "Accepted", desc: "Accepted for processing, not yet complete.", rfc: "RFC9110#15.3.3" },
  { code: 204, name: "No Content", desc: "Success with no response body.", rfc: "RFC9110#15.3.5" },
  { code: 206, name: "Partial Content", desc: "Range request fulfilled.", rfc: "RFC9110#15.3.7" },
  { code: 301, name: "Moved Permanently", desc: "Resource moved; update links.", rfc: "RFC9110#15.4.2" },
  { code: 302, name: "Found", desc: "Temporary redirect.", rfc: "RFC9110#15.4.3" },
  { code: 304, name: "Not Modified", desc: "Cached version is still fresh.", rfc: "RFC9110#15.4.5" },
  { code: 307, name: "Temporary Redirect", desc: "Like 302 but method preserved.", rfc: "RFC9110#15.4.8" },
  { code: 308, name: "Permanent Redirect", desc: "Like 301 but method preserved.", rfc: "RFC9110#15.4.9" },
  { code: 400, name: "Bad Request", desc: "Malformed syntax or invalid params.", rfc: "RFC9110#15.5.1" },
  { code: 401, name: "Unauthorized", desc: "Authentication required.", rfc: "RFC9110#15.5.2" },
  { code: 403, name: "Forbidden", desc: "Authenticated but not allowed.", rfc: "RFC9110#15.5.4" },
  { code: 404, name: "Not Found", desc: "Resource does not exist.", rfc: "RFC9110#15.5.5" },
  { code: 405, name: "Method Not Allowed", desc: "HTTP method not supported.", rfc: "RFC9110#15.5.6" },
  { code: 408, name: "Request Timeout", desc: "Client took too long.", rfc: "RFC9110#15.5.9" },
  { code: 409, name: "Conflict", desc: "State conflict (e.g. duplicate).", rfc: "RFC9110#15.5.10" },
  { code: 410, name: "Gone", desc: "Resource permanently removed.", rfc: "RFC9110#15.5.11" },
  { code: 418, name: "I'm a teapot", desc: "April Fools joke. Cannot brew coffee.", rfc: "RFC2324" },
  { code: 422, name: "Unprocessable Entity", desc: "Semantic errors in payload.", rfc: "RFC9110#15.5.21" },
  { code: 429, name: "Too Many Requests", desc: "Rate limit exceeded.", rfc: "RFC6585#4" },
  { code: 500, name: "Internal Server Error", desc: "Unexpected server condition.", rfc: "RFC9110#15.6.1" },
  { code: 501, name: "Not Implemented", desc: "Server doesn't support method.", rfc: "RFC9110#15.6.2" },
  { code: 502, name: "Bad Gateway", desc: "Invalid response from upstream.", rfc: "RFC9110#15.6.3" },
  { code: 503, name: "Service Unavailable", desc: "Server overloaded or down.", rfc: "RFC9110#15.6.4" },
  { code: 504, name: "Gateway Timeout", desc: "Upstream timeout.", rfc: "RFC9110#15.6.5" },
];

const colorOf = (c: number) =>
  c < 200 ? "text-muted-foreground" :
  c < 300 ? "text-primary" :
  c < 400 ? "text-blue-400" :
  c < 500 ? "text-yellow-400" : "text-destructive";

const HttpStatusTool = () => {
  const tool = getTool("http-status")!;
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STATUSES;
    return STATUSES.filter((x) =>
      String(x.code).includes(s) || x.name.toLowerCase().includes(s) || x.desc.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ToolShell tool={tool}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search code or name (e.g. 404, redirect, rate limit)..."
        className="w-full bg-input/30 border border-border px-3 py-2 text-sm font-mono mb-4 focus:outline-none focus:border-primary"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map((s) => (
          <a
            key={s.code}
            href={`https://datatracker.ietf.org/doc/html/rfc9110`}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-input/30 p-3 hover:border-primary transition-colors"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-2xl font-bold font-mono ${colorOf(s.code)}`}>{s.code}</span>
              <span className="text-sm font-mono">{s.name}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
            <div className="text-[10px] text-muted-foreground/70 mt-1 font-mono">{s.rfc}</div>
          </a>
        ))}
      </div>
    </ToolShell>
  );
};

export default HttpStatusTool;
