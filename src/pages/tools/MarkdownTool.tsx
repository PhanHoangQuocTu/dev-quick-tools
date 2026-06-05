import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `# Hello\n\nThis is **markdown**.\n\n- item 1\n- item 2\n\n\`\`\`js\nconst x = 1;\n\`\`\`\n\n[link](https://example.com)`;

const MarkdownTool = () => {
  const tool = getTool("markdown")!;
  const [md, setMd] = useState(SAMPLE);
  const [view, setView] = useState<"preview" | "html">("preview");

  const html = useMemo(() => {
    const raw = marked.parse(md, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [md]);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    toast.success("HTML copied");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant={view === "preview" ? "primary" : "ghost"} onClick={() => setView("preview")}>preview</TerminalButton>
        <TerminalButton variant={view === "html" ? "primary" : "ghost"} onClick={() => setView("html")}>html</TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setMd(SAMPLE)}>sample</TerminalButton>
        <TerminalButton onClick={copy}>copy html</TerminalButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea label="markdown" value={md} onChange={(e) => setMd(e.target.value)} />
        <div className="flex flex-col gap-1.5 min-h-0">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{view}</span>
          {view === "preview" ? (
            <div
              className="w-full flex-1 min-h-0 bg-input/30 border border-border p-4 overflow-auto scrollbar-terminal prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-xs font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">{html}</pre>
          )}
        </div>
      </div>
    </ToolShell>
  );
};

export default MarkdownTool;
