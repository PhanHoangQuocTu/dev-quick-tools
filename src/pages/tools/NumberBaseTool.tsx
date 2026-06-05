import { useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const BASES = [
  { label: "Binary", base: 2, prefix: "0b" },
  { label: "Octal", base: 8, prefix: "0o" },
  { label: "Decimal", base: 10, prefix: "" },
  { label: "Hex", base: 16, prefix: "0x" },
];

const NumberBaseTool = () => {
  const tool = getTool("numberbase")!;
  const [value, setValue] = useState<bigint | null>(255n);

  const update = (raw: string, base: number) => {
    const clean = raw.replace(/^0[bxo]/i, "").trim();
    if (!clean) { setValue(null); return; }
    try {
      setValue(BigInt(parseInt(clean, base)));
    } catch { /* ignore */ }
  };

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("copied"); };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-3 max-w-2xl">
        {BASES.map((b) => {
          const str = value === null ? "" : value.toString(b.base);
          return (
            <div key={b.base}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{b.label} (base {b.base})</span>
                <button onClick={() => copy(str)} className="text-[11px] text-muted-foreground hover:text-primary">copy</button>
              </div>
              <div className="flex">
                <span className="bg-input/30 border border-border border-r-0 px-2 py-2 text-muted-foreground font-mono text-sm w-12 text-center">{b.prefix || "—"}</span>
                <input
                  value={str}
                  onChange={(e) => update(e.target.value, b.base)}
                  spellCheck={false}
                  className="flex-1 bg-input/30 border border-border px-3 py-2 text-base font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
};

export default NumberBaseTool;
