import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digit: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

type Mode = "password" | "apikey";

const rand = (pool: string, n: number) => {
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  let s = "";
  for (let i = 0; i < n; i++) s += pool[a[i] % pool.length];
  return s;
};

const PasswordTool = () => {
  const tool = getTool("password")!;
  const [mode, setMode] = useState<Mode>("password");
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digit: true, symbol: true });
  const [value, setValue] = useState("");

  const pool = useMemo(() => {
    if (mode === "apikey") return CHARS.lower + CHARS.upper + CHARS.digit;
    return (
      (opts.lower ? CHARS.lower : "") +
      (opts.upper ? CHARS.upper : "") +
      (opts.digit ? CHARS.digit : "") +
      (opts.symbol ? CHARS.symbol : "")
    );
  }, [opts, mode]);

  const generate = () => { if (pool) setValue(rand(pool, length)); };
  useEffect(() => { generate(); }, [pool, length, mode]); // eslint-disable-line

  const entropy = Math.log2(Math.max(pool.length, 1)) * length;
  const strength = entropy < 40 ? { label: "weak", color: "text-destructive" } :
                   entropy < 64 ? { label: "fair", color: "text-yellow-400" } :
                   entropy < 100 ? { label: "strong", color: "text-primary" } :
                                   { label: "very strong", color: "text-primary" };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <TerminalButton variant={mode === "password" ? "primary" : "ghost"} onClick={() => setMode("password")}>password</TerminalButton>
        <TerminalButton variant={mode === "apikey" ? "primary" : "ghost"} onClick={() => setMode("apikey")}>api key</TerminalButton>
      </div>

      <div className="flex items-stretch border border-border focus-within:border-primary mb-4">
        <input
          value={value}
          readOnly
          className="flex-1 bg-input/30 px-3 py-3 text-base font-mono focus:outline-none break-all"
        />
        <button onClick={generate} className="px-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest">regen</button>
        <button onClick={() => { navigator.clipboard.writeText(value); toast.success("copied"); }} className="px-4 bg-input/50 text-xs uppercase tracking-widest hover:bg-input/70">copy</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">length: {length}</label>
        <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(+e.target.value)} className="flex-1 accent-primary" />
      </div>

      {mode === "password" && (
        <div className="flex flex-wrap gap-3 mb-4">
          {(Object.keys(opts) as (keyof typeof opts)[]).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} className="accent-primary" />
              <span className="font-mono">{k}</span>
            </label>
          ))}
        </div>
      )}

      <div className="border border-border bg-input/30 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">entropy</span>
          <span className={`text-sm uppercase tracking-widest ${strength.color}`}>{strength.label} · {entropy.toFixed(1)} bits</span>
        </div>
        <div className="h-2 bg-input/50 overflow-hidden">
          <div className={`h-full transition-all ${strength.color.replace("text", "bg")}`} style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }} />
        </div>
      </div>
    </ToolShell>
  );
};

export default PasswordTool;
