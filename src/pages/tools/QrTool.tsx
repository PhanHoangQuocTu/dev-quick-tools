import { useEffect, useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { TerminalTextarea } from "@/components/hub/TerminalTextarea";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";
import QRCode from "qrcode";

const SIZES = [
  { label: "S", value: 128 },
  { label: "M", value: 256 },
  { label: "L", value: 512 },
  { label: "XL", value: 768 },
];

const QrTool = () => {
  const tool = getTool("qr")!;
  const [input, setInput] = useState<string>("https://github.com");
  const [size, setSize] = useState<number>(256);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const text = input.trim();
      if (!text) {
        setDataUrl("");
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const url = await QRCode.toDataURL(text, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        if (!cancelled) setDataUrl(url);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [input, size]);

  const copy = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success("QR copied to clipboard");
    } catch {
      await navigator.clipboard.writeText(dataUrl);
      toast.success("Data URL copied to clipboard");
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${Date.now()}.png`;
    a.click();
    toast.success("QR downloaded");
  };

  const isEmpty = !input.trim();

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">size:</span>
        {SIZES.map((s) => (
          <TerminalButton
            key={s.value}
            variant={size === s.value ? "primary" : "ghost"}
            onClick={() => setSize(s.value)}
          >
            {s.label}
          </TerminalButton>
        ))}
        <div className="flex-1" />
        <TerminalButton variant="ghost" onClick={() => setInput("")}>clear</TerminalButton>
        <TerminalButton onClick={copy} disabled={!dataUrl || !!error}>copy</TerminalButton>
        <TerminalButton onClick={download} disabled={!dataUrl || !!error}>download</TerminalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-22rem)] min-h-[420px]">
        <TerminalTextarea
          label="text / url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com"
        />
        <div className="flex flex-col gap-1.5 min-h-0">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            qr code{" "}
            {error ? (
              <span className="text-destructive">[ err ]</span>
            ) : dataUrl ? (
              <span className="text-primary">[ ok ]</span>
            ) : (
              <span className="text-muted-foreground">[ ready ]</span>
            )}
          </span>
          <div className="w-full flex-1 min-h-0 bg-input/30 border border-border flex items-center justify-center overflow-auto p-4">
            {isEmpty ? (
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                enter text to generate
              </span>
            ) : error ? (
              <span className="text-xs text-destructive uppercase tracking-widest text-center">
                {error}
              </span>
            ) : loading ? (
              <span className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">
                generating...
              </span>
            ) : (
              <img
                src={dataUrl}
                alt="QR Code"
                className="max-w-full max-h-full object-contain border border-border bg-white"
              />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default QrTool;
