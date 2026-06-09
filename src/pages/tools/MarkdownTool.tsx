import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Code, Quote, Minus, CheckSquare,
  Download, Copy, FileCode, Eye, Columns,
} from "lucide-react";

const SAMPLE = `# Markdown Playground

Edit on the **left**, preview on the **right**. Supports GFM tables, task lists and code.

## Features

- [x] Live preview
- [x] Toolbar shortcuts
- [ ] Export to HTML

> Tip: select text then press a toolbar button to wrap it.

\`\`\`ts
const greet = (name: string) => \`hello \${name}\`;
\`\`\`

| Tool | Status |
|------|--------|
| Markdown | ready |
| Color | ready |

[Open Lovable](https://lovable.dev)
`;

marked.setOptions({ gfm: true, breaks: true });

const STORAGE_KEY = "md-tool-content";

type View = "split" | "preview" | "html";

const MarkdownTool = () => {
  const tool = getTool("markdown")!;
  const [md, setMd] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || SAMPLE);
  const [view, setView] = useState<View>("split");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(STORAGE_KEY, md), 300);
    return () => clearTimeout(id);
  }, [md]);

  const html = useMemo(() => {
    const raw = marked.parse(md, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [md]);

  const stats = useMemo(() => {
    const words = md.trim() ? md.trim().split(/\s+/).length : 0;
    const chars = md.length;
    const lines = md.split("\n").length;
    const reading = Math.max(1, Math.ceil(words / 200));
    return { words, chars, lines, reading };
  }, [md]);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const sel = md.slice(start, end) || placeholder;
    const next = md.slice(0, start) + before + sel + after + md.slice(end);
    setMd(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + sel.length);
    });
  };

  const prefixLine = (prefix: string) => {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const before = md.slice(0, start);
    const lineStart = before.lastIndexOf("\n") + 1;
    const next = md.slice(0, lineStart) + prefix + md.slice(lineStart);
    setMd(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fullHtml = useMemo(
    () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Document</title>
  <style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#111}pre{background:#f4f4f5;padding:1rem;border-radius:6px;overflow:auto}code{font-family:ui-monospace,monospace}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:.4rem .6rem}</style>
</head>
<body>
${html}
</body>
</html>`,
    [html],
  );

  const tools: { icon: typeof Bold; title: string; fn: () => void }[] = [
    { icon: Bold, title: "Bold (Ctrl+B)", fn: () => wrap("**") },
    { icon: Italic, title: "Italic (Ctrl+I)", fn: () => wrap("*") },
    { icon: Strikethrough, title: "Strikethrough", fn: () => wrap("~~") },
    { icon: Code, title: "Inline code", fn: () => wrap("`") },
    { icon: Heading1, title: "H1", fn: () => prefixLine("# ") },
    { icon: Heading2, title: "H2", fn: () => prefixLine("## ") },
    { icon: List, title: "Bullet list", fn: () => prefixLine("- ") },
    { icon: ListOrdered, title: "Numbered list", fn: () => prefixLine("1. ") },
    { icon: CheckSquare, title: "Task", fn: () => prefixLine("- [ ] ") },
    { icon: Quote, title: "Quote", fn: () => prefixLine("> ") },
    { icon: Minus, title: "Divider", fn: () => prefixLine("\n---\n") },
    { icon: LinkIcon, title: "Link", fn: () => wrap("[", "](https://)", "link") },
    { icon: ImageIcon, title: "Image", fn: () => wrap("![", "](https://)", "alt") },
  ];

  // keyboard shortcuts
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === "b") { e.preventDefault(); wrap("**"); }
    else if (k === "i") { e.preventDefault(); wrap("*"); }
    else if (k === "k") { e.preventDefault(); wrap("[", "](https://)", "link"); }
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-1.5 mb-2 border border-border bg-input/20 p-1.5">
        {tools.map((t) => (
          <button
            key={t.title}
            title={t.title}
            onClick={t.fn}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-input/60 transition-colors"
          >
            <t.icon className="h-4 w-4" />
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
          <button
            title="Split view"
            onClick={() => setView("split")}
            className={`p-1.5 transition-colors ${view === "split" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <Columns className="h-4 w-4" />
          </button>
          <button
            title="Preview only"
            onClick={() => setView("preview")}
            className={`p-1.5 transition-colors ${view === "preview" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            title="HTML source"
            onClick={() => setView("html")}
            className={`p-1.5 transition-colors ${view === "html" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <FileCode className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setMd(SAMPLE)}>sample</TerminalButton>
        <TerminalButton variant="ghost" onClick={() => setMd("")}>clear</TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => copy(md, "Markdown copied")}>
          <Copy className="h-3 w-3" /> .md
        </TerminalButton>
        <TerminalButton variant="ghost" onClick={() => copy(html, "HTML copied")}>
          <Copy className="h-3 w-3" /> .html
        </TerminalButton>
        <TerminalButton variant="ghost" onClick={() => download(md, "document.md", "text/markdown")}>
          <Download className="h-3 w-3" /> .md
        </TerminalButton>
        <TerminalButton onClick={() => download(fullHtml, "document.html", "text/html")}>
          <Download className="h-3 w-3" /> .html
        </TerminalButton>
      </div>

      <div
        className={`grid gap-4 h-[calc(100vh-26rem)] min-h-[460px] ${
          view === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {(view === "split") && (
          <TerminalTextarea
            ref={taRef}
            label="markdown"
            value={md}
            onChange={(e) => setMd(e.target.value)}
            onKeyDown={onKeyDown}
          />
        )}
        {view !== "html" ? (
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">preview</span>
            <div
              className="w-full flex-1 min-h-0 bg-input/30 border border-border p-5 overflow-auto scrollbar-terminal prose prose-invert prose-sm max-w-none
                prose-headings:font-bold prose-a:text-primary prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-background prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 min-h-0">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">html source</span>
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-xs font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap break-all">
              {html}
            </pre>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-mono text-muted-foreground">
        <span>{stats.words} words</span>
        <span>{stats.chars} chars</span>
        <span>{stats.lines} lines</span>
        <span>~{stats.reading} min read</span>
        <span className="ml-auto text-primary/70">autosaved</span>
      </div>
    </ToolShell>
  );
};

export default MarkdownTool;
