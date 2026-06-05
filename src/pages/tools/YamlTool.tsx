import { useEffect, useState } from "react";
import yaml from "js-yaml";
import * as toml from "smol-toml";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Fmt = "json" | "yaml" | "toml";

const SAMPLE: Record<Fmt, string> = {
  json: `{\n  "name": "demo",\n  "version": 1,\n  "tags": ["a", "b"]\n}`,
  yaml: `name: demo\nversion: 1\ntags:\n  - a\n  - b`,
  toml: `name = "demo"\nversion = 1\ntags = ["a", "b"]`,
};

const parse = (text: string, fmt: Fmt): unknown => {
  if (fmt === "json") return JSON.parse(text);
  if (fmt === "yaml") return yaml.load(text);
  return toml.parse(text);
};

const stringify = (data: unknown, fmt: Fmt): string => {
  if (fmt === "json") return JSON.stringify(data, null, 2);
  if (fmt === "yaml") return yaml.dump(data);
  return toml.stringify(data as Record<string, unknown>);
};

const YamlTool = () => {
  const tool = getTool("yaml")!;
  const [from, setFrom] = useState<Fmt>("yaml");
  const [to, setTo] = useState<Fmt>("json");
  const [input, setInput] = useState(SAMPLE.yaml);

  useEffect(() => { setInput(SAMPLE[from]); }, [from]);

  let output = "", err: string | null = null, ok = true;
  try {
    output = input.trim() ? stringify(parse(input, from), to) : "";
  } catch (e) { ok = false; err = (e as Error).message; }

  const copy = async () => { await navigator.clipboard.writeText(output); toast.success("copied"); };
  const swap = () => { setFrom(to); setTo(from); };

  const FmtBtn = ({ v, set, cur }: { v: Fmt; set: (f: Fmt) => void; cur: Fmt }) => (
    <TerminalButton variant={cur === v ? "primary" : "ghost"} onClick={() => set(v)}>{v}</TerminalButton>
  );

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">from:</span>
        <FmtBtn v="json" set={setFrom} cur={from} />
        <FmtBtn v="yaml" set={setFrom} cur={from} />
        <FmtBtn v="toml" set={setFrom} cur={from} />
        <TerminalButton variant="ghost" onClick={swap}>⇄</TerminalButton>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">to:</span>
        <FmtBtn v="json" set={setTo} cur={to} />
        <FmtBtn v="yaml" set={setTo} cur={to} />
        <FmtBtn v="toml" set={setTo} cur={to} />
        <div className="flex-1" />
        <TerminalButton onClick={copy} disabled={!ok || !output}>copy</TerminalButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea label={from} value={input} onChange={(e) => setInput(e.target.value)} />
        <OutputPane label={to} ok={ok} error={err}>{output}</OutputPane>
      </div>
    </ToolShell>
  );
};

export default YamlTool;
