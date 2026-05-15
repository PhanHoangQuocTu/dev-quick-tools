import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AdSlot } from "./AdSlot";
import { type Tool } from "@/lib/tools";

interface ToolShellProps {
  tool: Tool;
  children: ReactNode;
}

export const ToolShell = ({ tool, children }: ToolShellProps) => {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-6 md:py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 w-fit text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          All tools
        </Link>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            {tool.name}
            <span className="w-2.5 h-5 bg-primary animate-blink inline-block" aria-hidden />
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">{tool.description}</p>
      </div>

      <div>{children}</div>

      <AdSlot slot={`tool-${tool.slug}-bottom`} variant="banner" className="mt-6" />
    </div>
  );
};
