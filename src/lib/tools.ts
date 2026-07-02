import {
  Braces, Binary, Clock, Regex, GitCompare, Database, Code2, Palette, Fingerprint,
  Table, Hash, KeyRound, Type, Link as LinkIcon, FileText, QrCode, CalendarClock,
  ShieldAlert, FileCode, FileJson, Image as ImageIcon, BookOpen, FileX, ListChecks,
  Calculator, Lock, Braces as BracesIcon, Scissors, ImageDown, Rocket,
  type LucideIcon,
} from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  symbol: string;
  category?: string;
}

export const tools: Tool[] = [
  // Data / Format
  { slug: "json", name: "JSON Toolkit", symbol: "{}", short: "Format · query · diff JSON.", description: "Format, validate, query with JSONPath, and diff two JSON documents.", icon: Braces, category: "Data" },
  { slug: "yaml", name: "YAML ↔ JSON ↔ TOML", symbol: "Y/J", short: "Convert config formats.", description: "Convert between YAML, JSON and TOML in any direction.", icon: FileJson, category: "Data" },
  { slug: "csv", name: "CSV ↔ JSON", symbol: ";", short: "Convert CSV and JSON.", description: "Convert between CSV and JSON with header detection.", icon: Table, category: "Data" },
  { slug: "jsonschema", name: "JSON Schema Gen", symbol: "{?}", short: "Infer schema from sample.", description: "Generate a draft-07 JSON Schema from a sample JSON document.", icon: BracesIcon, category: "Data" },
  { slug: "sql", name: "SQL Formatter", symbol: "SQL", short: "Pretty-print or minify SQL.", description: "Format SQL queries with configurable dialect, keyword casing and minify.", icon: Code2, category: "Data" },
  { slug: "mock", name: "Mock Data", symbol: "%", short: "Generate fake data.", description: "Generate fake users, addresses, UUIDs and export as JSON/CSV/SQL.", icon: Database, category: "Data" },

  // Text
  { slug: "markdown", name: "Markdown ↔ HTML", symbol: "MD", short: "Live preview both ways.", description: "Edit markdown with live HTML preview, sanitized output.", icon: FileText, category: "Text" },
  { slug: "regex", name: "Regex Tester", symbol: "/.*/", short: "Test regex with explain.", description: "Try regular expressions live, with a library of common patterns and explain.", icon: Regex, category: "Text" },
  { slug: "diff", name: "Text Diff", symbol: "<>", short: "Compare two texts.", description: "Word- and line-level diff with side-by-side view.", icon: GitCompare, category: "Text" },
  { slug: "case", name: "Case Converter", symbol: "Aa", short: "camel, snake, kebab…", description: "Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE and more.", icon: Type, category: "Text" },
  { slug: "lorem", name: "Lorem Ipsum", symbol: "¶", short: "Placeholder text.", description: "Generate Lorem Ipsum words, sentences or paragraphs for mockups.", icon: FileText, category: "Text" },

  // Encoding / Crypto
  { slug: "encode", name: "Base64 & URL", symbol: "Aa", short: "Encode or decode text.", description: "Encode and decode Base64 or URL-encoded strings. UTF-8 safe.", icon: Binary, category: "Encoding" },
  { slug: "hash", name: "Hash Generator", symbol: "#H", short: "SHA-1 / 256 / 384 / 512.", description: "Hash any text with SHA-1, SHA-256, SHA-384 or SHA-512.", icon: Hash, category: "Encoding" },
  { slug: "jwt", name: "JWT Decoder + Verify", symbol: "JWT", short: "Decode & verify JWTs.", description: "Decode JWT header and payload and verify HMAC signatures with a secret.", icon: Fingerprint, category: "Encoding" },
  { slug: "password", name: "Password Generator", symbol: "•••", short: "Strong passwords & API keys.", description: "Generate random passwords or API keys with an entropy meter.", icon: Lock, category: "Encoding" },
  { slug: "uuid", name: "UUID Generator", symbol: "ID", short: "Generate UUID v4 in bulk.", description: "Generate one or many UUID v4 values. Copy or download instantly.", icon: KeyRound, category: "Encoding" },

  // Web / Network
  { slug: "url", name: "URL Parser", symbol: "://", short: "Inspect URL parts.", description: "Break a URL into protocol, host, path, query params and hash. Edit params live.", icon: LinkIcon, category: "Web" },
  { slug: "headers", name: "HTTP Headers", symbol: "Hd", short: "Inspect & explain headers.", description: "Paste raw response or request headers and see what each one means.", icon: ListChecks, category: "Web" },
  { slug: "http-status", name: "HTTP Status Codes", symbol: "200", short: "Lookup status codes.", description: "Browse and search HTTP status codes with descriptions and RFC links.", icon: ShieldAlert, category: "Web" },
  { slug: "cron", name: "Cron Parser", symbol: "* *", short: "Explain cron + next runs.", description: "Convert cron expressions to human-readable text and show the next runs.", icon: CalendarClock, category: "Web" },
  { slug: "timestamp", name: "Timestamp", symbol: "010", short: "Unix epoch ↔ date.", description: "Convert between Unix timestamps (s/ms) and ISO / local date.", icon: Clock, category: "Web" },

  // Number / Misc
  { slug: "numberbase", name: "Number Base", symbol: "10₁₆", short: "bin / oct / dec / hex.", description: "Convert numbers between binary, octal, decimal and hexadecimal.", icon: Calculator, category: "Misc" },
  { slug: "color", name: "Color Converter", symbol: "#", short: "Hex ↔ RGB ↔ HSL.", description: "Convert between HEX, RGB and HSL with a live color preview.", icon: Palette, category: "Misc" },
  { slug: "qr", name: "QR Generator", symbol: "QR", short: "Create QR codes.", description: "Generate QR codes from any URL or text. Adjust size and copy or download.", icon: QrCode, category: "Misc" },

  // Images / Files
  { slug: "img2base64", name: "Image → Base64", symbol: "IMG", short: "Encode image to data URL.", description: "Upload an image and copy it as a Base64 data URL.", icon: ImageIcon, category: "Image" },
  { slug: "imgcompress", name: "Image Compressor", symbol: "↓", short: "Shrink images locally.", description: "Compress images entirely in the browser. No upload, no tracking.", icon: ImageDown, category: "Image" },
  { slug: "svgo", name: "SVG Minifier", symbol: "<S>", short: "Minify SVG markup.", description: "Strip comments, whitespace and metadata from SVG markup with live preview.", icon: Scissors, category: "Image" },

  // Reference
  { slug: "cheatsheet", name: "Cheat Sheets", symbol: "?", short: "git, docker, vim, regex…", description: "Quick command reference for git, docker, vim, regex, bash and tmux.", icon: BookOpen, category: "Reference" },
  { slug: "gitignore", name: ".gitignore Gen", symbol: ".gi", short: "Build a .gitignore file.", description: "Pick your stacks and generate a combined .gitignore file.", icon: FileX, category: "Reference" },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
