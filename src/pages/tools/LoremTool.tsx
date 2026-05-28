import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa officia deserunt mollit anim id est laborum".split(" ");

type Unit = "words" | "sentences" | "paragraphs";

const rand = (n: number) => Math.floor(Math.random() * n);
const pickWords = (n: number) => Array.from({ length: n }, () => WORDS[rand(WORDS.length)]);
const sentence = () => {
  const len = 6 + rand(12);
  const w = pickWords(len);
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
};
const paragraph = () => Array.from({ length: 3 + rand(5) }, sentence).join(" ");

const LoremTool = () => {
  const tool = getTool("lorem")!;
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const output = useMemo(() => {
    void seed;
    const n = Math.max(1, Math.min(200, Number(count) || 1));
    let text = "";
    if (unit === "words") text = pickWords(n).join(" ");
    else if (unit === "sentences") text = Array.from({ length: n }, sentence).join(" ");
    else text = Array.from({ length: n }, paragraph).join("\n\n");
    if (startWithLorem) {
      text = "Lorem ipsum dolor sit amet, " + text.replace(/^./, (c) => c.toLowerCase());
    }
    return text;
  }, [unit, count, seed, startWithLorem]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("copied to clipboard");
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">unit:</span>
        {(["words", "sentences", "paragraphs"] as Unit[]).map((u) => (
          <TerminalButton key={u} variant={unit === u ? "primary" : "ghost"} onClick={() => setUnit(u)}>
            {u}
          </TerminalButton>
        ))}
        <label className="text-[11px] uppercase tracking-widest text-muted-foreground ml-2">count:</label>
        <input
          type="number"
          min={1}
          max={200}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 bg-input/30 border border-border px-2 py-1 text-sm font-mono focus:outline-none focus:border-primary"
        />
        <TerminalButton variant={startWithLorem ? "primary" : "ghost"} onClick={() => setStartWithLorem((v) => !v)}>
          start with “lorem ipsum”
        </TerminalButton>
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setSeed((s) => s + 1)}>regen</TerminalButton>
        <TerminalButton onClick={copy}>copy</TerminalButton>
      </div>

      <div className="h-[calc(100vh-22rem)] min-h-[380px]">
        <OutputPane ok>{output}</OutputPane>
      </div>
    </ToolShell>
  );
};

export default LoremTool;
