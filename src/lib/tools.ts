import { Braces, Binary, Clock, Regex, GitCompare, Database, type LucideIcon } from "lucide-react";

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
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
