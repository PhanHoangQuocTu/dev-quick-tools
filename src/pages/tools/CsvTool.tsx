import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

type Direction = "csv2json" | "json2csv";

const SAMPLE_CSV = `name,email,role,active
Alice Nguyen,alice@dev.io,admin,true
Bob Tran,bob@dev.io,editor,false
Carol Pham,carol@dev.io,viewer,true`;

const SAMPLE_JSON = `[
  { "name": "Alice Nguyen", "email": "alice@dev.io", "role": "admin", "active": true },
  { "name": "Bob Tran", "email": "bob@dev.io", "role": "editor", "active": false },
  { "name": "Carol Pham", "email": "carol@dev.io", "role": "viewer", "active": true }
]`;

/* Simple RFC 4180-ish parser */
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const chars = text.split("");

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  row.push(field);
  if (row.length > 1 || row[0] !== "") rows.push(row);
  return rows;
};

const rowsToObjects = (rows: string[][]): Record<string, string>[] => {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))
  );
};

const objectsToCsv = (arr: Record<string, string>[]): string => {
  if (!arr.length) return "";
  const keys = Object.keys(arr[0]);
  const escape = (s: string) => {
    const str = String(s ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const lines = [
    keys.join(","),
    ...arr.map((obj) => keys.map((k) => escape(obj[k] ?? "")).join(",")),
  ];
  return lines.join("\n");
};

const CsvTool = () => {
  const tool = getTool("csv")!;
  const [direction, setDirection] = useState<Direction>("csv2json");
  const [input, setInput] = useState<string>(SAMPLE_CSV);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, output: "", error: null as string | null };
    try {
      if (direction === "csv2json") {
        const rows = parseCsv(input);
        const objs = rowsToObjects(rows);
        return { ok: true, output: JSON.stringify(objs, null, 2), error: null };
      } else {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects");
        return { ok: true, output: objectsToCsv(parsed as Record<string, string>[]), error: null };
      }
    } catch (e) {
      return { ok: false, output: "", error: (e as Error).message };
    }
  }, [input, direction]);

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">direction:</span>
        <TerminalButton
          variant={direction === "csv2json" ? "primary" : "ghost"}
          onClick={() => {
            setDirection("csv2json");
            setInput(SAMPLE_CSV);
          }}
        >
          csv → json
        </TerminalButton>
        <TerminalButton
          variant={direction === "json2csv" ? "primary" : "ghost"}
          onClick={() => {
            setDirection("json2csv");
            setInput(SAMPLE_JSON);
          }}
        >
          json → csv
        </TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(direction === "csv2json" ? SAMPLE_CSV : SAMPLE_JSON)}>
          sample
        </TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!result.ok || !result.output}>copy</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea
          label={direction === "csv2json" ? "csv input" : "json input"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={direction === "csv2json" ? "name,email\nAlice,alice@dev.io" : '[{"name":"Alice"}]'}
        />
        <OutputPane ok={result.ok} error={result.error}>
          {result.output}
        </OutputPane>
      </div>
    </ToolShell>
  );
};

export default CsvTool;
