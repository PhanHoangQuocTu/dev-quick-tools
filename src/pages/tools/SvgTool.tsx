import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <!-- a circle -->\n  <circle cx="50" cy="50" r="40" fill="hsl(160, 60%, 50%)" />\n</svg>`;

const minify = (svg: string) =>
  svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/>/g, "/>")
    .replace(/\n/g, "")
    .trim();

const SvgTool = () => {
  const tool = getTool("svgo")!;
  const [input, setInput] = useState(SAMPLE);

  const output = useMemo(() => minify(input), [input]);
  const ratio = input.length === 0 ? 0 : ((1 - output.length / input.length) * 100);

  const copy = async () => { await navigator.clipboard.writeText(output); toast.success("copied"); };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TerminalButton variant="ghost" onClick={() => setInput(SAMPLE)}>sample</TerminalButton>
        <div className="flex-1" />
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {input.length} → {output.length} bytes · <span className="text-primary">-{ratio.toFixed(1)}%</span>
        </span>
        <TerminalButton onClick={copy}>copy</TerminalButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px] mb-4">
        <TerminalTextarea label="input svg" value={input} onChange={(e) => setInput(e.target.value)} />
        <TerminalTextarea label="minified" value={output} readOnly />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border bg-input/30 p-4 flex items-center justify-center min-h-[200px]" dangerouslySetInnerHTML={{ __html: input }} />
        <div className="border border-border bg-input/30 p-4 flex items-center justify-center min-h-[200px]" dangerouslySetInnerHTML={{ __html: output }} />
      </div>
    </ToolShell>
  );
};

export default SvgTool;
