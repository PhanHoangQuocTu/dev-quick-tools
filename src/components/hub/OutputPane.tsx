import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OutputPaneProps {
  label?: string;
  ok?: boolean;
  error?: string | null;
  children?: ReactNode;
  className?: string;
  preClassName?: string;
}

/**
 * Output panel that fills its parent's height to align with the input pane.
 * Wrap in a flex/grid container with a fixed height (e.g. h-[480px]).
 */
export const OutputPane = ({
  label = "output",
  ok = true,
  error,
  children,
  className,
  preClassName,
}: OutputPaneProps) => (
  <div className={cn("flex flex-col gap-1.5 min-h-0", className)}>
    {label && (
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}{" "}
        {ok ? (
          <span className="text-primary">[ ok ]</span>
        ) : (
          <span className="text-destructive">[ err ]</span>
        )}
      </span>
    )}
    {ok ? (
      <pre
        className={cn(
          "w-full flex-1 min-h-0 bg-input/30 border border-border p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap break-all",
          preClassName,
        )}
      >
        {children}
      </pre>
    ) : (
      <pre className="w-full flex-1 min-h-0 bg-input/30 border border-destructive/60 text-destructive p-3 text-sm font-mono overflow-auto scrollbar-terminal whitespace-pre-wrap">
        {error}
      </pre>
    )}
  </div>
);
