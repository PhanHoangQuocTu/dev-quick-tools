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
    name: "JSON_Parser",
    code: "MOD_01",
    symbol: "{}",
    short: "Format, validate, minify JSON.",
    description:
      "Validate, format, and minify JSON payloads. Strict syntax checking with line/column error reporting.",
    icon: Braces,
    meta: "engine: json.parse",
  },
  {
    slug: "encode",
    name: "Base64_Codec",
    code: "MOD_02",
    symbol: "A-Z",
    short: "Base64 + URL encode/decode.",
    description:
      "Bidirectional Base64 and URL component encoding/decoding. Handles UTF-8 safely.",
    icon: Binary,
    meta: "mode: utf-8",
  },
  {
    slug: "timestamp",
    name: "Epoch_Conv",
    code: "MOD_03",
    symbol: "010",
    short: "Unix epoch ↔ ISO date.",
    description:
      "Translate Unix timestamps to ISO 8601 / local time. Supports seconds and milliseconds.",
    icon: Clock,
    meta: "tz: local + utc",
  },
  {
    slug: "regex",
    name: "Regex_Eval",
    code: "MOD_04",
    symbol: "/.*/",
    short: "Live regex tester with captures.",
    description:
      "Evaluate regular expressions in real time. Highlights matches and lists capture groups.",
    icon: Regex,
    meta: "engine: ecma",
  },
  {
    slug: "diff",
    name: "Diff_Inspector",
    code: "MOD_05",
    symbol: "<>",
    short: "Compare two text blocks.",
    description:
      "Compute the delta between two strings. Outputs unified diff with insertions and deletions.",
    icon: GitCompare,
    meta: "alg: myers",
  },
  {
    slug: "mock",
    name: "Mock_Gen",
    code: "MOD_06",
    symbol: "%%",
    short: "Generate fake JSON records.",
    description:
      "Synthesize structured dummy data — users, addresses, UUIDs — and export as JSON or CSV.",
    icon: Database,
    meta: "seed: random",
  },
  {
    slug: "sql",
    name: "SQL_Fmt",
    code: "MOD_07",
    symbol: "SQL",
    short: "Format & pretty-print SQL.",
    description:
      "Auto-format SQL queries with configurable keyword casing and indentation. Supports PostgreSQL, MySQL, and standard SQL.",
    icon: Code2,
    meta: "dialect: auto",
  },
  {
    slug: "color",
    name: "Color_Conv",
    code: "MOD_08",
    symbol: "#",
    short: "Hex ↔ RGB ↔ HSL.",
    description:
      "Convert between HEX, RGB, and HSL color formats. Live preview swatch with copy-ready output.",
    icon: Palette,
    meta: "space: sRGB",
  },
  {
    slug: "jwt",
    name: "JWT_Decode",
    code: "MOD_09",
    symbol: "JWT",
    short: "Inspect JWT payload.",
    description:
      "Decode JWT headers and payloads without verification. Inspect claims, expiry, and metadata.",
    icon: Fingerprint,
    meta: "alg: auto",
  },
  {
    slug: "csv",
    name: "CSV_Conv",
    code: "MOD_10",
    symbol: ";",
    short: "CSV ↔ JSON converter.",
    description:
      "Convert between CSV and JSON formats with header detection. Supports quoted fields and array-of-objects output.",
    icon: Table,
    meta: "rfc: 4180",
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
