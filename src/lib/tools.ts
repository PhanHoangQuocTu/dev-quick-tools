import {
  Braces,
  Binary,
  Clock,
  Regex,
  GitCompare,
  Database,
  Code2,
  Palette,
  Fingerprint,
  Table,
  Hash,
  KeyRound,
  Type,
  Link as LinkIcon,
  FileText,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  symbol: string;
}

export const tools: Tool[] = [
  { slug: "json", name: "JSON Formatter", symbol: "{}", short: "Format & validate JSON.", description: "Paste JSON to format, validate or minify it. Errors show line and column.", icon: Braces },
  { slug: "encode", name: "Base64 & URL", symbol: "Aa", short: "Encode or decode text.", description: "Encode and decode Base64 or URL-encoded strings. UTF-8 safe.", icon: Binary },
  { slug: "timestamp", name: "Timestamp", symbol: "010", short: "Unix epoch ↔ date.", description: "Convert between Unix timestamps (s/ms) and ISO / local date.", icon: Clock },
  { slug: "regex", name: "Regex Tester", symbol: "/.*/", short: "Test regex live.", description: "Try regular expressions against text. Highlights matches and capture groups.", icon: Regex },
  { slug: "diff", name: "Text Diff", symbol: "<>", short: "Compare two texts.", description: "Compare two pieces of text and see what changed line by line.", icon: GitCompare },
  { slug: "mock", name: "Mock Data", symbol: "%", short: "Generate fake data.", description: "Generate fake users, addresses, UUIDs and export as JSON or CSV.", icon: Database },
  { slug: "sql", name: "SQL Formatter", symbol: "SQL", short: "Pretty-print SQL.", description: "Format SQL queries with configurable dialect and keyword casing.", icon: Code2 },
  { slug: "color", name: "Color Converter", symbol: "#", short: "Hex ↔ RGB ↔ HSL.", description: "Convert between HEX, RGB and HSL with a live color preview.", icon: Palette },
  { slug: "jwt", name: "JWT Decoder", symbol: "JWT", short: "Inspect JWT tokens.", description: "Decode JWT header and payload to inspect claims and expiry.", icon: Fingerprint },
  { slug: "csv", name: "CSV ↔ JSON", symbol: ";", short: "Convert CSV and JSON.", description: "Convert between CSV and JSON with header detection.", icon: Table },
  { slug: "uuid", name: "UUID Generator", symbol: "ID", short: "Generate UUID v4 in bulk.", description: "Generate one or many UUID v4 values. Copy or download instantly.", icon: KeyRound },
  { slug: "hash", name: "Hash Generator", symbol: "#H", short: "SHA-1 / 256 / 384 / 512.", description: "Hash any text with SHA-1, SHA-256, SHA-384 or SHA-512 — runs in your browser.", icon: Hash },
  { slug: "case", name: "Case Converter", symbol: "Aa", short: "camel, snake, kebab…", description: "Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE and more.", icon: Type },
  { slug: "url", name: "URL Parser", symbol: "://", short: "Inspect URL parts.", description: "Break a URL into protocol, host, path, query params and hash. Edit params live.", icon: LinkIcon },
  { slug: "lorem", name: "Lorem Ipsum", symbol: "¶", short: "Placeholder text.", description: "Generate Lorem Ipsum words, sentences or paragraphs for mockups.", icon: FileText },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
