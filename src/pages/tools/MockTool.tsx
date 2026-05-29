import { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type FieldType =
  | "id"
  | "uuid"
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "username"
  | "password"
  | "phone"
  | "address"
  | "city"
  | "country"
  | "zipcode"
  | "company"
  | "jobTitle"
  | "ip"
  | "ipv6"
  | "mac"
  | "url"
  | "domain"
  | "userAgent"
  | "dateRecent"
  | "datePast"
  | "dateFuture"
  | "dateBirth"
  | "boolean"
  | "intSmall"
  | "intLarge"
  | "float"
  | "price"
  | "color"
  | "avatar"
  | "image"
  | "productName"
  | "lorem"
  | "paragraph"
  | "creditCard"
  | "iban"
  | "currency"
  | "fileName"
  | "mimeType"
  | "custom";

interface Column {
  id: string;
  name: string;
  type: FieldType;
  customValues?: string; // comma separated for custom enum
}

const TYPE_GROUPS: { label: string; options: { value: FieldType; label: string }[] }[] = [
  {
    label: "Basic",
    options: [
      { value: "id", label: "ID (auto-increment)" },
      { value: "uuid", label: "UUID" },
      { value: "boolean", label: "Boolean" },
      { value: "custom", label: "Custom (enum)" },
    ],
  },
  {
    label: "Person",
    options: [
      { value: "fullName", label: "Full name" },
      { value: "firstName", label: "First name" },
      { value: "lastName", label: "Last name" },
      { value: "email", label: "Email" },
      { value: "username", label: "Username" },
      { value: "password", label: "Password" },
      { value: "phone", label: "Phone" },
      { value: "dateBirth", label: "Date of birth" },
      { value: "avatar", label: "Avatar URL" },
    ],
  },
  {
    label: "Location",
    options: [
      { value: "address", label: "Street address" },
      { value: "city", label: "City" },
      { value: "country", label: "Country" },
      { value: "zipcode", label: "Zip code" },
    ],
  },
  {
    label: "Business",
    options: [
      { value: "company", label: "Company" },
      { value: "jobTitle", label: "Job title" },
      { value: "productName", label: "Product name" },
      { value: "price", label: "Price" },
      { value: "currency", label: "Currency code" },
      { value: "creditCard", label: "Credit card" },
      { value: "iban", label: "IBAN" },
    ],
  },
  {
    label: "Internet",
    options: [
      { value: "url", label: "URL" },
      { value: "domain", label: "Domain" },
      { value: "ip", label: "IPv4" },
      { value: "ipv6", label: "IPv6" },
      { value: "mac", label: "MAC address" },
      { value: "userAgent", label: "User agent" },
      { value: "image", label: "Image URL" },
    ],
  },
  {
    label: "Number",
    options: [
      { value: "intSmall", label: "Int (0–9999)" },
      { value: "intLarge", label: "Int (large)" },
      { value: "float", label: "Float" },
    ],
  },
  {
    label: "Date",
    options: [
      { value: "dateRecent", label: "Date (recent)" },
      { value: "datePast", label: "Date (past)" },
      { value: "dateFuture", label: "Date (future)" },
    ],
  },
  {
    label: "Misc",
    options: [
      { value: "color", label: "Color (hex)" },
      { value: "lorem", label: "Lorem (sentence)" },
      { value: "paragraph", label: "Lorem (paragraph)" },
      { value: "fileName", label: "File name" },
      { value: "mimeType", label: "MIME type" },
    ],
  },
];

const TYPE_LABEL: Record<FieldType, string> = Object.fromEntries(
  TYPE_GROUPS.flatMap((g) => g.options.map((o) => [o.value, o.label])),
) as Record<FieldType, string>;

const generate = (col: Column, i: number): unknown => {
  switch (col.type) {
    case "id": return i + 1;
    case "uuid": return faker.string.uuid();
    case "fullName": return faker.person.fullName();
    case "firstName": return faker.person.firstName();
    case "lastName": return faker.person.lastName();
    case "email": return faker.internet.email();
    case "username": return faker.internet.userName();
    case "password": return faker.internet.password();
    case "phone": return faker.phone.number();
    case "address": return faker.location.streetAddress({ useFullAddress: true });
    case "city": return faker.location.city();
    case "country": return faker.location.country();
    case "zipcode": return faker.location.zipCode();
    case "company": return faker.company.name();
    case "jobTitle": return faker.person.jobTitle();
    case "ip": return faker.internet.ipv4();
    case "ipv6": return faker.internet.ipv6();
    case "mac": return faker.internet.mac();
    case "url": return faker.internet.url();
    case "domain": return faker.internet.domainName();
    case "userAgent": return faker.internet.userAgent();
    case "dateRecent": return faker.date.recent().toISOString();
    case "datePast": return faker.date.past().toISOString();
    case "dateFuture": return faker.date.future().toISOString();
    case "dateBirth": return faker.date.birthdate().toISOString().slice(0, 10);
    case "boolean": return faker.datatype.boolean();
    case "intSmall": return faker.number.int({ min: 0, max: 9999 });
    case "intLarge": return faker.number.int({ min: 0, max: 1_000_000 });
    case "float": return Number(faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }));
    case "price": return Number(faker.commerce.price());
    case "color": return faker.color.rgb();
    case "avatar": return faker.image.avatar();
    case "image": return faker.image.url();
    case "productName": return faker.commerce.productName();
    case "lorem": return faker.lorem.sentence();
    case "paragraph": return faker.lorem.paragraph();
    case "creditCard": return faker.finance.creditCardNumber();
    case "iban": return faker.finance.iban();
    case "currency": return faker.finance.currencyCode();
    case "fileName": return faker.system.fileName();
    case "mimeType": return faker.system.mimeType();
    case "custom": {
      const list = (col.customValues ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return list.length ? list[Math.floor(Math.random() * list.length)] : null;
    }
  }
};

const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
};

const toSql = (rows: Record<string, unknown>[], table = "mock_data") => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const fmt = (v: unknown) => {
    if (v === null || v === undefined) return "NULL";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return `'${String(v).replace(/'/g, "''")}'`;
  };
  return rows
    .map((r) => `INSERT INTO ${table} (${headers.join(", ")}) VALUES (${headers.map((h) => fmt(r[h])).join(", ")});`)
    .join("\n");
};

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_COLUMNS: Column[] = [
  { id: uid(), name: "id", type: "id" },
  { id: uid(), name: "name", type: "fullName" },
  { id: uid(), name: "email", type: "email" },
  { id: uid(), name: "company", type: "company" },
];

const MockTool = () => {
  const tool = getTool("mock")!;
  const [count, setCount] = useState(10);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [format, setFormat] = useState<"json" | "csv" | "sql">("json");
  const [tableName, setTableName] = useState("mock_data");
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => {
    void seed;
    const n = Math.max(1, Math.min(1000, Number(count) || 0));
    const arr: Record<string, unknown>[] = [];
    for (let i = 0; i < n; i++) {
      const row: Record<string, unknown> = {};
      columns.forEach((c) => {
        const key = c.name.trim() || c.type;
        row[key] = generate(c, i);
      });
      arr.push(row);
    }
    return arr;
  }, [count, columns, seed]);

  const output = useMemo(() => {
    if (format === "json") return JSON.stringify(data, null, 2);
    if (format === "csv") return toCsv(data);
    return toSql(data, tableName || "mock_data");
  }, [data, format, tableName]);

  const addColumn = () =>
    setColumns((cs) => [...cs, { id: uid(), name: `field_${cs.length + 1}`, type: "fullName" }]);

  const removeColumn = (id: string) =>
    setColumns((cs) => (cs.length > 1 ? cs.filter((c) => c.id !== id) : cs));

  const updateColumn = (id: string, patch: Partial<Column>) =>
    setColumns((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const move = (id: string, dir: -1 | 1) =>
    setColumns((cs) => {
      const idx = cs.findIndex((c) => c.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= cs.length) return cs;
      const copy = [...cs];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const ext = format;
    const mime =
      format === "json" ? "application/json" : format === "csv" ? "text/csv" : "application/sql";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        {/* LEFT: Schema builder */}
        <div className="flex flex-col gap-3 rounded-md border border-border bg-card/40 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Schema</h2>
            <TerminalButton variant="ghost" onClick={addColumn}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add field
            </TerminalButton>
          </div>

          <div className="flex flex-col gap-2 max-h-[460px] overflow-auto scrollbar-terminal pr-1">
            {columns.map((col) => (
              <div
                key={col.id}
                className="flex flex-col gap-2 rounded-md border border-border bg-background/40 p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(col.id, -1)}
                      className="text-muted-foreground hover:text-primary leading-none"
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => move(col.id, 1)}
                      className="text-muted-foreground hover:text-primary leading-none"
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                  </div>
                  <Input
                    value={col.name}
                    onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                    placeholder="field name"
                    className="h-9 flex-1 font-mono text-sm"
                  />
                  <Select
                    value={col.type}
                    onValueChange={(v) => updateColumn(col.id, { type: v as FieldType })}
                  >
                    <SelectTrigger className="h-9 w-[180px] text-xs">
                      <SelectValue>{TYPE_LABEL[col.type]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[320px]">
                      {TYPE_GROUPS.map((group) => (
                        <div key={group.label}>
                          <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                            {group.label}
                          </div>
                          {group.options.map((o) => (
                            <SelectItem key={o.value} value={o.value} className="text-xs">
                              {o.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => removeColumn(col.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {col.type === "custom" && (
                  <Input
                    value={col.customValues ?? ""}
                    onChange={(e) => updateColumn(col.id, { customValues: e.target.value })}
                    placeholder="comma,separated,values"
                    className="h-8 text-xs font-mono"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <label className="text-xs text-muted-foreground">Rows</label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="h-9 w-24"
            />
            <span className="text-muted-foreground text-xs">max 1000</span>
            <div className="flex-1" />
            <TerminalButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>
              Regenerate
            </TerminalButton>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="flex flex-col gap-3 rounded-md border border-border bg-card/40 p-4 min-h-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold mr-2">Output</h2>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {(["json", "csv", "sql"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                    format === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {format === "sql" && (
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="table name"
                className="h-8 w-36 text-xs font-mono"
              />
            )}
            <div className="flex-1" />
            <TerminalButton onClick={copy}>Copy</TerminalButton>
            <TerminalButton variant="ghost" onClick={download}>
              Download
            </TerminalButton>
          </div>

          <pre className="flex-1 w-full bg-input/30 border border-border rounded-md p-3 text-xs font-mono overflow-auto scrollbar-terminal min-h-[420px] max-h-[600px] whitespace-pre">
            {output}
          </pre>
          <p className="text-[11px] text-muted-foreground">
            {data.length} rows · {columns.length} columns
          </p>
        </div>
      </div>
    </ToolShell>
  );
};

export default MockTool;
