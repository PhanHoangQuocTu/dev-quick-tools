import { useMemo, useState, useCallback } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Shuffle, Download } from "lucide-react";

/* ---------- color math ---------- */

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const m = hex
    .trim()
    .replace("#", "")
    .match(/^(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})|([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F]))$/);
  if (!m) return null;
  const r = parseInt(m[1] || m[4] + m[4], 16);
  const g = parseInt(m[2] || m[5] + m[5], 16);
  const b = parseInt(m[3] || m[6] + m[6], 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
};

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrastColor = (r: number, g: number, b: number) =>
  luminance(r, g, b) > 0.179 ? "#000000" : "#FFFFFF";

const contrastRatio = (a: string, b: string) => {
  const ra = hexToRgb(a)!, rb = hexToRgb(b)!;
  const la = luminance(ra.r, ra.g, ra.b), lb = luminance(rb.r, rb.g, rb.b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

const randomHex = () =>
  "#" + Array.from({ length: 6 }, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join("");

/* ---------- copy / download helpers ---------- */

const useCopy = () =>
  useCallback(async (text: string, label = "copied") => {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  }, []);

const downloadText = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------- Converter tab ---------- */

type Mode = "hex" | "rgb" | "hsl";

const Converter = () => {
  const [mode, setMode] = useState<Mode>("hex");
  const [input, setInput] = useState("#3B82F6");
  const copy = useCopy();

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    let rgb: { r: number; g: number; b: number } | null = null;
    if (mode === "hex") rgb = hexToRgb(trimmed);
    else if (mode === "rgb") {
      const m = trimmed.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
      if (m) {
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        if (r <= 255 && g <= 255 && b <= 255) rgb = { r, g, b };
      }
    } else {
      const m = trimmed.match(/(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
      if (m) {
        const [h, s, l] = [+m[1], +m[2], +m[3]];
        if (h <= 360 && s <= 100 && l <= 100) rgb = hslToRgb(h, s, l);
      }
    }
    if (!rgb) return null;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      ...rgb,
      hex,
      hsl,
      css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hslCss: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      tailwind: `bg-[${hex.toLowerCase()}]`,
      cssVar: `--color: ${hex};`,
      text: contrastColor(rgb.r, rgb.g, rgb.b),
    };
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">mode:</span>
        {(["hex", "rgb", "hsl"] as Mode[]).map((m) => (
          <TerminalButton
            key={m}
            variant={mode === m ? "primary" : "ghost"}
            onClick={() => {
              setMode(m);
              if (parsed) {
                if (m === "hex") setInput(parsed.hex);
                else if (m === "rgb") setInput(`${parsed.r}, ${parsed.g}, ${parsed.b}`);
                else setInput(`${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%`);
              }
            }}
          >
            {m}
          </TerminalButton>
        ))}
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput(randomHex())}>
          <Shuffle className="h-3 w-3" /> random
        </TerminalButton>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">input ({mode})</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-input/30 border border-border text-foreground p-3 text-sm font-mono focus:outline-none focus:border-primary focus:bg-input/50"
            placeholder={mode === "hex" ? "#3B82F6" : mode === "rgb" ? "59, 130, 246" : "217, 91%, 60%"}
          />
          {mode === "hex" && (
            <input
              type="color"
              value={parsed?.hex || "#000000"}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="h-11 w-14 bg-input/30 border border-border cursor-pointer p-1"
            />
          )}
        </div>
      </div>

      {parsed ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div
              className="h-44 w-full border border-border flex items-center justify-center text-base font-bold font-mono tracking-widest"
              style={{ backgroundColor: parsed.hex, color: parsed.text }}
            >
              {parsed.hex}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="border border-border p-2">
                <div className="text-muted-foreground text-[10px] uppercase">on white</div>
                <div className="mt-1">{contrastRatio(parsed.hex, "#FFFFFF").toFixed(2)} : 1</div>
              </div>
              <div className="border border-border p-2">
                <div className="text-muted-foreground text-[10px] uppercase">on black</div>
                <div className="mt-1">{contrastRatio(parsed.hex, "#000000").toFixed(2)} : 1</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { label: "HEX", value: parsed.hex },
              { label: "RGB", value: parsed.css },
              { label: "HSL", value: parsed.hslCss },
              { label: "Tailwind", value: parsed.tailwind },
              { label: "CSS var", value: parsed.cssVar },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-input/30 border border-border p-2 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                    {value}
                  </code>
                  <TerminalButton onClick={() => copy(value, `${label} copied`)}>
                    <Copy className="h-3 w-3" />
                  </TerminalButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-destructive/60 text-destructive p-3 text-sm font-mono">
          [err] invalid {mode} format
        </div>
      )}
    </div>
  );
};

/* ---------- Gradient builder ---------- */

interface Stop { color: string; pos: number }
type GType = "linear" | "radial" | "conic";

const PRESETS: { name: string; type: GType; angle: number; stops: Stop[] }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#FF6B6B", pos: 0 }, { color: "#FFD93D", pos: 100 }] },
  { name: "Ocean", type: "linear", angle: 180, stops: [{ color: "#2E3192", pos: 0 }, { color: "#1BFFFF", pos: 100 }] },
  { name: "Aurora", type: "linear", angle: 90, stops: [{ color: "#A8E6CF", pos: 0 }, { color: "#DCEDC1", pos: 50 }, { color: "#FFD3B6", pos: 100 }] },
  { name: "Cosmic", type: "linear", angle: 45, stops: [{ color: "#7F00FF", pos: 0 }, { color: "#E100FF", pos: 100 }] },
  { name: "Phosphor", type: "linear", angle: 135, stops: [{ color: "#0F2027", pos: 0 }, { color: "#203A43", pos: 50 }, { color: "#2C5364", pos: 100 }] },
  { name: "Peachy", type: "radial", angle: 0, stops: [{ color: "#FFB199", pos: 0 }, { color: "#FF0844", pos: 100 }] },
  { name: "Conic Wheel", type: "conic", angle: 0, stops: [{ color: "#FF0000", pos: 0 }, { color: "#FFFF00", pos: 25 }, { color: "#00FF00", pos: 50 }, { color: "#00FFFF", pos: 75 }, { color: "#FF00FF", pos: 100 }] },
];

const GradientBuilder = () => {
  const [type, setType] = useState<GType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#3B82F6", pos: 0 },
    { color: "#A855F7", pos: 100 },
  ]);
  const copy = useCopy();

  const sorted = useMemo(() => [...stops].sort((a, b) => a.pos - b.pos), [stops]);

  const gradient = useMemo(() => {
    const parts = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${parts})`;
    if (type === "radial") return `radial-gradient(circle, ${parts})`;
    return `conic-gradient(from ${angle}deg, ${parts})`;
  }, [type, angle, sorted]);

  const tailwindArbitrary = `bg-[${gradient.replace(/\s+/g, "_")}]`;

  const tailwindDirective =
    type === "linear" && sorted.length === 2
      ? `bg-gradient-to-${angleToDir(angle)} from-[${sorted[0].color.toLowerCase()}] to-[${sorted[1].color.toLowerCase()}]`
      : null;

  const cssBlock = `background: ${gradient};`;

  const update = (i: number, patch: Partial<Stop>) =>
    setStops((s) => s.map((st, idx) => (idx === i ? { ...st, ...patch } : st)));

  const addStop = () => {
    const last = sorted[sorted.length - 1];
    setStops([...stops, { color: randomHex(), pos: Math.min(100, last.pos + 10) }]);
  };

  const removeStop = (i: number) => stops.length > 2 && setStops(stops.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      <div
        className="h-56 w-full border border-border rounded-sm"
        style={{ background: gradient }}
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground self-center mr-1">presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setType(p.type); setAngle(p.angle); setStops(p.stops); }}
            className="group flex items-center gap-2 border border-border hover:border-primary px-2 py-1 text-xs font-mono transition-colors"
          >
            <span
              className="h-3 w-6 rounded-sm"
              style={{
                background:
                  p.type === "linear"
                    ? `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`
                    : p.type === "radial"
                      ? `radial-gradient(circle, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`
                      : `conic-gradient(from ${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(", ")})`,
              }}
            />
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">type:</span>
            {(["linear", "radial", "conic"] as GType[]).map((t) => (
              <TerminalButton key={t} variant={type === t ? "primary" : "ghost"} onClick={() => setType(t)}>
                {t}
              </TerminalButton>
            ))}
          </div>

          {type !== "radial" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">angle</span>
                <span className="text-xs font-mono text-primary">{angle}°</span>
              </div>
              <input
                type="range" min={0} max={360} value={angle}
                onChange={(e) => setAngle(+e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">stops</span>
              <TerminalButton variant="ghost" onClick={addStop}>
                <Plus className="h-3 w-3" /> add
              </TerminalButton>
            </div>
            {stops.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.color}
                  onChange={(e) => update(i, { color: e.target.value.toUpperCase() })}
                  className="h-9 w-12 bg-input/30 border border-border cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={s.color}
                  onChange={(e) => update(i, { color: e.target.value })}
                  className="w-24 bg-input/30 border border-border p-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <input
                  type="range" min={0} max={100} value={s.pos}
                  onChange={(e) => update(i, { pos: +e.target.value })}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs font-mono w-10 text-right">{s.pos}%</span>
                <button
                  onClick={() => removeStop(i)}
                  disabled={stops.length <= 2}
                  className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          {[
            { label: "CSS", value: cssBlock },
            { label: "Tailwind (arbitrary)", value: tailwindArbitrary },
            ...(tailwindDirective ? [{ label: "Tailwind (directive)", value: tailwindDirective }] : []),
            { label: "Raw value", value: gradient },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
              <div className="flex items-start gap-2">
                <code className="flex-1 bg-input/30 border border-border p-2 text-xs font-mono break-all">
                  {value}
                </code>
                <TerminalButton onClick={() => copy(value, `${label} copied`)}>
                  <Copy className="h-3 w-3" />
                </TerminalButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function angleToDir(a: number): string {
  // map 0..360 to nearest tailwind direction
  const dirs: [number, string][] = [
    [0, "t"], [45, "tr"], [90, "r"], [135, "br"],
    [180, "b"], [225, "bl"], [270, "l"], [315, "tl"], [360, "t"],
  ];
  let best = dirs[0];
  for (const d of dirs) if (Math.abs(d[0] - a) < Math.abs(best[0] - a)) best = d;
  return best[1];
}

/* ---------- Palette generator ---------- */

const Palette = () => {
  const [base, setBase] = useState("#3B82F6");
  const copy = useCopy();
  const rgb = hexToRgb(base);

  if (!rgb) return <div className="text-destructive text-sm font-mono">invalid base color</div>;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const shades = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((l) => {
    const c = hslToRgb(hsl.h, hsl.s, l);
    return { l, hex: rgbToHex(c.r, c.g, c.b) };
  });
  const complement = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
  const triad = [120, 240].map((d) => {
    const c = hslToRgb((hsl.h + d) % 360, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });
  const analogous = [-30, 30].map((d) => {
    const c = hslToRgb((hsl.h + d + 360) % 360, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">base:</span>
        <input
          type="color" value={base}
          onChange={(e) => setBase(e.target.value.toUpperCase())}
          className="h-9 w-12 bg-input/30 border border-border cursor-pointer p-1"
        />
        <input
          type="text" value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-32 bg-input/30 border border-border p-2 text-sm font-mono focus:outline-none focus:border-primary"
        />
        <TerminalButton variant="ghost" onClick={() => setBase(randomHex())}>
          <Shuffle className="h-3 w-3" /> random
        </TerminalButton>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">shades (lightness 95% → 10%)</div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
          {shades.map((s) => (
            <button
              key={s.l}
              onClick={() => copy(s.hex, s.hex)}
              className="aspect-square border border-border flex items-end justify-center pb-1 text-[10px] font-mono hover:scale-105 transition-transform"
              style={{ background: s.hex, color: contrastColor(...(Object.values(hexToRgb(s.hex)!) as [number, number, number])) }}
              title={s.hex}
            >
              {s.hex.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PaletteBlock title="Complementary" colors={[base, rgbToHex(complement.r, complement.g, complement.b)]} onCopy={copy} />
        <PaletteBlock title="Triadic" colors={[base, ...triad]} onCopy={copy} />
        <PaletteBlock title="Analogous" colors={[analogous[0], base, analogous[1]]} onCopy={copy} />
      </div>
    </div>
  );
};

const PaletteBlock = ({ title, colors, onCopy }: { title: string; colors: string[]; onCopy: (t: string, l?: string) => void }) => (
  <div>
    <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
    <div className="flex">
      {colors.map((c, i) => (
        <button
          key={i}
          onClick={() => onCopy(c, c)}
          className="flex-1 h-16 border border-border first:rounded-l-sm last:rounded-r-sm text-[10px] font-mono"
          style={{ background: c, color: contrastColor(...(Object.values(hexToRgb(c)!) as [number, number, number])) }}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);

/* ---------- main ---------- */

type Tab = "convert" | "gradient" | "palette";

const ColorTool = () => {
  const tool = getTool("color")!;
  const [tab, setTab] = useState<Tab>("convert");

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-5 border-b border-border pb-3">
        {([
          ["convert", "Converter"],
          ["gradient", "Gradient Builder"],
          ["palette", "Palette"],
        ] as [Tab, string][]).map(([k, label]) => (
          <TerminalButton key={k} variant={tab === k ? "primary" : "ghost"} onClick={() => setTab(k)}>
            {label}
          </TerminalButton>
        ))}
      </div>

      {tab === "convert" && <Converter />}
      {tab === "gradient" && <GradientBuilder />}
      {tab === "palette" && <Palette />}
    </ToolShell>
  );
};

export default ColorTool;
