import { useMemo, useState, useCallback } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

/* ---------- color math ---------- */

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const m = hex.trim().replace("#", "").match(/^(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})|([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F]))$/);
  if (!m) return null;
  const r = parseInt(m[1] || m[4] + m[4], 16);
  const g = parseInt(m[2] || m[5] + m[5], 16);
  const b = parseInt(m[3] || m[6] + m[6], 16);
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
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

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
};

const rgbToCss = (r: number, g: number, b: number) => `rgb(${r}, ${g}, ${b})`;

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrastColor = (r: number, g: number, b: number) =>
  luminance(r, g, b) > 0.179 ? "#000000" : "#FFFFFF";

type Mode = "hex" | "rgb" | "hsl";

const ColorTool = () => {
  const tool = getTool("color")!;
  const [mode, setMode] = useState<Mode>("hex");
  const [input, setInput] = useState<string>("#3B82F6");

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    let rgb: { r: number; g: number; b: number } | null = null;

    if (mode === "hex") {
      rgb = hexToRgb(trimmed);
    } else if (mode === "rgb") {
      const m = trimmed.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
      if (m) {
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        if (r <= 255 && g <= 255 && b <= 255) rgb = { r, g, b };
      }
    } else if (mode === "hsl") {
      const m = trimmed.match(/(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
      if (m) {
        const [h, s, l] = [+m[1], +m[2], +m[3]];
        if (h <= 360 && s <= 100 && l <= 100) rgb = hslToRgb(h, s, l);
      }
    }

    if (!rgb) return null;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const css = rgbToCss(rgb.r, rgb.g, rgb.b);
    const text = contrastColor(rgb.r, rgb.g, rgb.b);
    return { ...rgb, hex, hsl, css, text };
  }, [input, mode]);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      toast.success("copied to clipboard");
    },
    []
  );

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
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
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            input ({mode})
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="w-full bg-input/30 border border-border text-foreground p-3 text-sm font-mono focus:outline-none focus:border-primary focus:bg-input/50 placeholder:text-muted-foreground/60"
            placeholder={mode === "hex" ? "#3B82F6" : mode === "rgb" ? "59, 130, 246" : "217, 91%, 60%"}
          />
        </div>

        {parsed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preview */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">preview</span>
              <div
                className="h-28 w-full border border-border flex items-center justify-center text-sm font-bold font-mono tracking-widest"
                style={{ backgroundColor: parsed.hex, color: parsed.text }}
              >
                {parsed.hex}
              </div>
            </div>

            {/* Outputs */}
            <div className="flex flex-col gap-3">
              {[
                { label: "HEX", value: parsed.hex },
                { label: "RGB", value: parsed.css },
                { label: "HSL", value: `hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-input/30 border border-border p-2 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                      {value}
                    </code>
                    <TerminalButton onClick={() => copy(value)}>copy</TerminalButton>
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
    </ToolShell>
  );
};

export default ColorTool;
