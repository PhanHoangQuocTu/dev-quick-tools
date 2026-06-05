import { useState } from "react";
import { ToolShell } from "@/components/hub/ToolShell";
import { getTool } from "@/lib/tools";

type Topic = "git" | "docker" | "vim" | "regex" | "bash" | "tmux";

const SHEETS: Record<Topic, { cmd: string; desc: string }[]> = {
  git: [
    { cmd: "git status", desc: "Show working tree status" },
    { cmd: "git log --oneline --graph --all", desc: "Compact branch graph" },
    { cmd: "git switch -c feat/x", desc: "Create and switch to new branch" },
    { cmd: "git restore --staged <file>", desc: "Unstage file" },
    { cmd: "git reset --hard HEAD~1", desc: "Discard last commit (destructive)" },
    { cmd: "git rebase -i HEAD~3", desc: "Interactive rebase last 3 commits" },
    { cmd: "git stash push -m 'wip'", desc: "Stash with message" },
    { cmd: "git cherry-pick <sha>", desc: "Apply a commit by hash" },
    { cmd: "git push --force-with-lease", desc: "Safer force push" },
    { cmd: "git bisect start / good / bad", desc: "Binary search for a regression" },
  ],
  docker: [
    { cmd: "docker ps -a", desc: "List all containers" },
    { cmd: "docker images", desc: "List images" },
    { cmd: "docker run -it --rm -p 8080:80 nginx", desc: "Run nginx mapped to host:8080" },
    { cmd: "docker exec -it <id> sh", desc: "Open shell inside container" },
    { cmd: "docker logs -f <id>", desc: "Follow container logs" },
    { cmd: "docker compose up -d", desc: "Start services in background" },
    { cmd: "docker system prune -af", desc: "Remove unused data (destructive)" },
    { cmd: "docker build -t app:latest .", desc: "Build image from Dockerfile" },
  ],
  vim: [
    { cmd: "i / a / o", desc: "Insert before / after / new line below" },
    { cmd: "dd / yy / p", desc: "Delete / yank / paste line" },
    { cmd: ":w / :q / :wq / :q!", desc: "Write / quit / write+quit / force quit" },
    { cmd: "/pattern + n / N", desc: "Search forward, next, prev" },
    { cmd: ":%s/foo/bar/g", desc: "Replace all in file" },
    { cmd: "gg / G", desc: "Top / bottom of file" },
    { cmd: "ctrl-v", desc: "Visual block mode" },
    { cmd: ":e <file>", desc: "Open file" },
  ],
  regex: [
    { cmd: ".", desc: "Any single char (except newline)" },
    { cmd: "\\d \\w \\s", desc: "Digit / word char / whitespace" },
    { cmd: "^ $", desc: "Start / end of line" },
    { cmd: "* + ?", desc: "0+ / 1+ / 0 or 1" },
    { cmd: "{n,m}", desc: "Between n and m repetitions" },
    { cmd: "(abc)", desc: "Capture group" },
    { cmd: "(?:abc)", desc: "Non-capture group" },
    { cmd: "(?=x) (?!x)", desc: "Lookahead / negative lookahead" },
    { cmd: "[a-z]", desc: "Character class" },
  ],
  bash: [
    { cmd: "find . -name '*.ts'", desc: "Find files by name" },
    { cmd: "grep -rni 'foo' .", desc: "Recursive case-insensitive search" },
    { cmd: "xargs -I{} echo {}", desc: "Apply command per input" },
    { cmd: "ps aux | grep node", desc: "List node processes" },
    { cmd: "kill -9 <pid>", desc: "Force kill process" },
    { cmd: "tail -f file.log", desc: "Follow log file" },
    { cmd: "du -sh *", desc: "Size per top-level entry" },
    { cmd: "lsof -i :3000", desc: "What's using port 3000" },
  ],
  tmux: [
    { cmd: "tmux new -s name", desc: "New named session" },
    { cmd: "C-b d", desc: "Detach session" },
    { cmd: "tmux a -t name", desc: "Attach session" },
    { cmd: "C-b \"", desc: "Split horizontally" },
    { cmd: "C-b %", desc: "Split vertically" },
    { cmd: "C-b arrows", desc: "Navigate panes" },
    { cmd: "C-b c", desc: "New window" },
  ],
};

const CheatsheetTool = () => {
  const tool = getTool("cheatsheet")!;
  const [topic, setTopic] = useState<Topic>("git");
  const [q, setQ] = useState("");

  const items = SHEETS[topic].filter(
    (i) => !q || i.cmd.toLowerCase().includes(q.toLowerCase()) || i.desc.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(Object.keys(SHEETS) as Topic[]).map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${
              topic === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filter..."
          className="ml-auto bg-input/30 border border-border px-2 py-1 text-xs font-mono focus:outline-none focus:border-primary"
        />
      </div>
      <div className="border border-border bg-input/30 divide-y divide-border/60">
        {items.map((i, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 px-3 py-2 hover:bg-input/50">
            <code className="text-primary text-sm font-mono break-all">{i.cmd}</code>
            <span className="text-muted-foreground text-sm">{i.desc}</span>
          </div>
        ))}
      </div>
    </ToolShell>
  );
};

export default CheatsheetTool;
