import { useMemo, useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { TerminalButton } from "@/components/hub/TerminalButton";
import { OutputPane } from "@/components/hub/OutputPane";
import { getTool } from "@/lib/tools";
import { toast } from "sonner";

const TEMPLATES: Record<string, string> = {
  Node: `node_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n.pnpm-debug.log*\n.env\n.env.local\ndist/\nbuild/\ncoverage/\n.next/\n.nuxt/\n.cache/\n`,
  Python: `__pycache__/\n*.py[cod]\n*$py.class\n*.so\n.Python\nbuild/\ndevelop-eggs/\ndist/\neggs/\n.eggs/\nlib/\nlib64/\nparts/\nsdist/\nvar/\nwheels/\n*.egg-info/\n.installed.cfg\n*.egg\n.env\n.venv\nvenv/\nENV/\n.pytest_cache/\n.mypy_cache/\n.ruff_cache/\n`,
  Java: `*.class\n*.log\n*.ctxt\n.mtj.tmp/\n*.jar\n*.war\n*.nar\n*.ear\n*.zip\n*.tar.gz\n*.rar\nhs_err_pid*\ntarget/\n.idea/\n*.iml\n.gradle/\nbuild/\n`,
  Go: `*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\n*.prof\n`,
  Rust: `target/\nCargo.lock\n**/*.rs.bk\n`,
  Ruby: `*.gem\n*.rbc\n/.config\n/coverage/\n/InstalledFiles\n/pkg/\n/spec/reports/\n/tmp/\n.bundle/\nvendor/bundle\nlog/\n`,
  ".NET": `bin/\nobj/\n*.user\n*.suo\n*.cache\n*.swp\n[Tt]emp/\n[Ll]og/\n[Dd]ebug/\n[Rr]elease/\n.vs/\n`,
  Android: `*.iml\n.gradle/\n/local.properties\n/.idea\n.DS_Store\n/build\n/captures\n.externalNativeBuild\n.cxx\n*.apk\n*.aab\n`,
  Xcode: `build/\n*.pbxuser\n!default.pbxuser\nxcuserdata/\n*.xcuserstate\nDerivedData/\nPods/\n`,
  macOS: `.DS_Store\n.AppleDouble\n.LSOverride\nIcon\n._*\n.Spotlight-V100\n.Trashes\n`,
  Windows: `Thumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk\n`,
  Linux: `*~\n.fuse_hidden*\n.directory\n.Trash-*\n.nfs*\n`,
  VSCode: `.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n`,
  JetBrains: `.idea/\n*.iml\n*.iws\nout/\n`,
  Docker: `*.pid\ndocker-compose.override.yml\n`,
  Terraform: `*.tfstate\n*.tfstate.*\n.terraform/\ncrash.log\n*.tfvars\n`,
};

const GitignoreTool = () => {
  const tool = getTool("gitignore")!;
  const [selected, setSelected] = useState<Set<string>>(new Set(["Node", "macOS", "VSCode"]));

  const toggle = (k: string) => setSelected((s) => {
    const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n;
  });

  const output = useMemo(
    () => [...selected].map((k) => `# === ${k} ===\n${TEMPLATES[k]}`).join("\n"),
    [selected],
  );

  const copy = async () => { await navigator.clipboard.writeText(output); toast.success("copied"); };
  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = ".gitignore"; a.click();
  };

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="border border-border bg-input/30 p-3 max-h-[560px] overflow-auto scrollbar-terminal">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">stacks</div>
          <div className="flex flex-col gap-1">
            {Object.keys(TEMPLATES).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                <input type="checkbox" checked={selected.has(k)} onChange={() => toggle(k)} className="accent-primary" />
                <span className="font-mono">{k}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 min-h-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">.gitignore · {selected.size} stack{selected.size === 1 ? "" : "s"}</span>
            <div className="flex-1" />
            <TerminalButton onClick={copy}>copy</TerminalButton>
            <TerminalButton variant="ghost" onClick={download}>download</TerminalButton>
          </div>
          <OutputPane label="" preClassName="min-h-[480px]">{output}</OutputPane>
        </div>
      </div>
    </ToolShell>
  );
};

export default GitignoreTool;
