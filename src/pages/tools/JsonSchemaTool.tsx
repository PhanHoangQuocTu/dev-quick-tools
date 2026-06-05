import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const infer = (v: unknown): Record<string, unknown> => {
  if (v === null) return { type: "null" };
  if (Array.isArray(v)) {
    return v.length === 0
      ? { type: "array", items: {} }
      : { type: "array", items: infer(v[0]) };
  }
  if (typeof v === "object") {
    const props: Record<string, unknown> = {};
    const required: string[] = [];
    for (const k of Object.keys(v as object)) {
      props[k] = infer((v as Record<string, unknown>)[k]);
      required.push(k);
    }
    return { type: "object", properties: props, required };
  }
  if (typeof v === "number") return { type: Number.isInteger(v) ? "integer" : "number" };
  if (typeof v === "boolean") return { type: "boolean" };
  return { type: "string" };
};

const SAMPLE = `{\n  "id": 1,\n  "name": "Dev",\n  "active": true,\n  "tags": ["admin", "owner"],\n  "profile": { "age": 30, "email": "a@b.com" }\n}`;

const JsonSchemaTool = () => {
  const tool = getTool("jsonschema")!;
  const [input, setInput] = useState(SAMPLE);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const schema = { $schema: "http://json-schema.org/draft-07/schema#", ...infer(parsed) };
      return { ok: true, output: JSON.stringify(schema, null, 2), err: null as string | null };
    } catch (e) {
      return { ok: false, output: "", err: (e as Error).message };
    }
  }, [input]);

  const copy = async () => { await navigator.clipboard.writeText(result.output); toast.success("copied"); };

  return (
    <ToolShell tool={tool}>
      <div className="flex items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <div className="flex-1" />
        <TerminalButton onClick={copy} disabled={!result.ok}>copy schema</TerminalButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea label="sample json" value={input} onChange={(e) => setInput(e.target.value)} />
        <OutputPane label="json schema" ok={result.ok} error={result.err}>{result.output}</OutputPane>
      </div>
    </ToolShell>
  );
};

export default JsonSchemaTool;
