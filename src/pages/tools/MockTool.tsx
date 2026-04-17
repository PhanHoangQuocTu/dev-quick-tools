import { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Field =
  | "id"
  | "uuid"
  | "name"
  | "email"
  | "phone"
  | "address"
  | "company"
  | "ip"
  | "url"
  | "date"
  | "boolean"
  | "number";

const ALL_FIELDS: Field[] = [
  "id",
  "uuid",
  "name",
  "email",
  "phone",
  "address",
  "company",
  "ip",
  "url",
  "date",
  "boolean",
  "number",
];

const generate = (field: Field, i: number): unknown => {
  switch (field) {
    case "id": return i + 1;
    case "uuid": return faker.string.uuid();
    case "name": return faker.person.fullName();
    case "email": return faker.internet.email();
    case "phone": return faker.phone.number();
    case "address": return faker.location.streetAddress({ useFullAddress: true });
    case "company": return faker.company.name();
    case "ip": return faker.internet.ipv4();
    case "url": return faker.internet.url();
    case "date": return faker.date.recent().toISOString();
    case "boolean": return faker.datatype.boolean();
    case "number": return faker.number.int({ min: 0, max: 9999 });
  }
};

const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
};

const MockTool = () => {
  const tool = getTool("mock")!;
  const [count, setCount] = useState(10);
  const [fields, setFields] = useState<Set<Field>>(new Set(["id", "name", "email", "company"]));
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [seed, setSeed] = useState(0); // bump to regenerate

  const data = useMemo(() => {
    void seed;
    const n = Math.max(1, Math.min(500, Number(count) || 0));
    const arr: Record<string, unknown>[] = [];
    for (let i = 0; i < n; i++) {
      const row: Record<string, unknown> = {};
      [...fields].forEach((f) => (row[f] = generate(f, i)));
      arr.push(row);
    }
    return arr;
  }, [count, fields, seed]);

  const output = useMemo(
    () => (format === "json" ? JSON.stringify(data, null, 2) : toCsv(data)),
    [data, format],
  );

  const toggleField = (f: Field) =>
    setFields((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      if (next.size === 0) next.add(f); // keep at least one
      return next;
    });

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("copied");
  };

  const download = () => {
    const blob = new Blob([output], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">count:</label>
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 bg-input/30 border border-border px-2 py-1 text-sm font-mono focus:outline-none focus:border-primary"
          />
          <span className="text-muted-foreground text-xs">// max 500</span>
          <div className="flex-1" />
          <TerminalButton variant={format === "json" ? "primary" : "ghost"} onClick={() => setFormat("json")}>json</TerminalButton>
          <TerminalButton variant={format === "csv" ? "primary" : "ghost"} onClick={() => setFormat("csv")}>csv</TerminalButton>
          <TerminalButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>regen</TerminalButton>
          <TerminalButton onClick={copy}>copy</TerminalButton>
          <TerminalButton variant="ghost" onClick={download}>download</TerminalButton>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">fields</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {ALL_FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => toggleField(f)}
                className={`px-2 py-1 text-[11px] uppercase tracking-widest border transition-colors ${
                  fields.has(f)
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <pre className="w-full bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal min-h-[360px] max-h-[520px] whitespace-pre">
          {output}
        </pre>
      </div>
    </ToolShell>
  );
};

export default MockTool;
