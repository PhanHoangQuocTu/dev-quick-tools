import { useState } from "react";
import imageCompression from "browser-image-compression";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

interface Result { original: File; compressed: Blob; url: string; origUrl: string; }

const ImageCompressTool = () => {
  const tool = getTool("imgcompress")!;
  const [maxSizeMB, setMaxSizeMB] = useState(0.5);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [busy, setBusy] = useState(false);
  const [r, setR] = useState<Result | null>(null);

  const handle = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    try {
      const compressed = await imageCompression(f, { maxSizeMB, maxWidthOrHeight: maxWidth, useWebWorker: true });
      setR({
        original: f,
        compressed,
        url: URL.createObjectURL(compressed),
        origUrl: URL.createObjectURL(f),
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setBusy(false); }
  };

  const download = () => {
    if (!r) return;
    const a = document.createElement("a");
    a.href = r.url; a.download = `compressed-${r.original.name}`; a.click();
  };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 text-xs">
          max size MB
          <input type="number" step="0.1" min="0.05" value={maxSizeMB} onChange={(e) => setMaxSizeMB(+e.target.value)} className="w-20 bg-input/30 border border-border px-2 py-1 font-mono" />
        </label>
        <label className="flex items-center gap-2 text-xs">
          max width
          <input type="number" min="100" value={maxWidth} onChange={(e) => setMaxWidth(+e.target.value)} className="w-24 bg-input/30 border border-border px-2 py-1 font-mono" />
        </label>
      </div>

      <label className="block border border-dashed border-border bg-input/30 p-8 text-center cursor-pointer hover:border-primary transition-colors mb-4">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0] ?? null)} />
        <div className="text-sm text-muted-foreground">{busy ? "Compressing..." : "Click or drop image"}</div>
      </label>

      {r && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border bg-input/30 p-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">original · {(r.original.size / 1024).toFixed(1)} KB</div>
            <img src={r.origUrl} alt="original" className="max-w-full max-h-[320px] mx-auto" />
          </div>
          <div className="border border-border bg-input/30 p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-[11px] uppercase tracking-widest text-primary">compressed · {(r.compressed.size / 1024).toFixed(1)} KB ({((1 - r.compressed.size / r.original.size) * 100).toFixed(0)}% smaller)</div>
              <TerminalButton onClick={download}>download</TerminalButton>
            </div>
            <img src={r.url} alt="compressed" className="max-w-full max-h-[320px] mx-auto" />
          </div>
        </div>
      )}
    </ToolShell>
  );
};

export default ImageCompressTool;
