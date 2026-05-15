import { Braces, Binary, Clock, Regex, GitCompare, Database, Code2, Palette, Fingerprint, Table, type LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  code: string;          // mod code label, e.g. MOD_01
  symbol: string;        // small glyph label
  short: string;         // one-line summary
  description: string;   // longer description
  icon: LucideIcon;
  meta: string;          // bottom-row metadata
}

export const tools: Tool[] = [
  {
    slug: "json",
    name: "JSON Formatter",
    code: "01",
    symbol: "{}",
    short: "Format & validate JSON.",
    description: "Paste JSON to format, validate or minify it. Errors show line and column.",
    icon: Braces,
    meta: "json",
  },
  {
    slug: "encode",
    name: "Base64 & URL",
    code: "02",
    symbol: "Aa",
    short: "Encode or decode text.",
    description: "Encode and decode Base64 or URL-encoded strings. UTF-8 safe.",
    icon: Binary,
    meta: "encode",
  },
  {
    slug: "timestamp",
    name: "Timestamp",
    code: "03",
    symbol: "010",
    short: "Unix epoch ↔ date.",
    description: "Convert between Unix timestamps (s/ms) and ISO / local date.",
    icon: Clock,
    meta: "time",
  },
  {
    slug: "regex",
    name: "Regex Tester",
    code: "04",
    symbol: "/.*/",
    short: "Test regex live.",
    description: "Try regular expressions against text. Highlights matches and capture groups.",
    icon: Regex,
    meta: "regex",
  },
  {
    slug: "diff",
    name: "Text Diff",
    code: "05",
    symbol: "<>",
    short: "Compare two texts.",
    description: "Compare two pieces of text and see what changed line by line.",
    icon: GitCompare,
    meta: "diff",
  },
  {
    slug: "mock",
    name: "Mock Data",
    code: "06",
    symbol: "%",
    short: "Generate fake data.",
    description: "Generate fake users, addresses, UUIDs and export as JSON or CSV.",
    icon: Database,
    meta: "mock",
  },
  {
    slug: "sql",
    name: "SQL Formatter",
    code: "07",
    symbol: "SQL",
    short: "Pretty-print SQL.",
    description: "Format SQL queries with configurable dialect and keyword casing.",
    icon: Code2,
    meta: "sql",
  },
  {
    slug: "color",
    name: "Color Converter",
    code: "08",
    symbol: "#",
    short: "Hex ↔ RGB ↔ HSL.",
    description: "Convert between HEX, RGB and HSL with a live color preview.",
    icon: Palette,
    meta: "color",
  },
  {
    slug: "jwt",
    name: "JWT Decoder",
    code: "09",
    symbol: "JWT",
    short: "Inspect JWT tokens.",
    description: "Decode JWT header and payload to inspect claims and expiry.",
    icon: Fingerprint,
    meta: "jwt",
  },
  {
    slug: "csv",
    name: "CSV ↔ JSON",
    code: "10",
    symbol: ";",
    short: "Convert CSV and JSON.",
    description: "Convert between CSV and JSON with header detection.",
    icon: Table,
    meta: "csv",
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
