import { useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const ImageBase64Tool = () => {
  const tool = getTool("img2base64")!;
  const [dataUrl, setDataUrl] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);

  const onFile = (f: File | null) => {
    if (!f) return;
    setName(f.name); setSize(f.size);
    const r = new FileReader();
    r.onload = () => setDataUrl(r.result as string);
    r.readAsDataURL(f);
  };

  const copy = async (text: string) => { await navigator.clipboard.writeText(text); toast.success("copied"); };

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-4">
        <label className="border border-dashed border-border bg-input/30 p-8 text-center cursor-pointer hover:border-primary transition-colors">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          <div className="text-sm text-muted-foreground">Click or drop image here</div>
          {name && <div className="mt-2 text-xs font-mono text-primary">{name} · {(size / 1024).toFixed(1)} KB</div>}
        </label>

        {dataUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border bg-input/30 p-4 flex items-center justify-center min-h-[240px]">
              <img src={dataUrl} alt="preview" className="max-w-full max-h-[280px]" />
            </div>
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">data url · {(dataUrl.length / 1024).toFixed(1)} KB</span>
                <div className="flex gap-2">
                  <TerminalButton onClick={() => copy(dataUrl)}>copy</TerminalButton>
                  <TerminalButton variant="ghost" onClick={() => copy(`<img src="${dataUrl}" />`)}>copy &lt;img&gt;</TerminalButton>
                  <TerminalButton variant="ghost" onClick={() => copy(`background-image: url("${dataUrl}");`)}>copy css</TerminalButton>
                </div>
              </div>
              <textarea
                readOnly
                value={dataUrl}
                className="w-full flex-1 min-h-[260px] bg-input/30 border border-border p-3 text-xs font-mono break-all scrollbar-terminal"
              />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
};

export default ImageBase64Tool;
