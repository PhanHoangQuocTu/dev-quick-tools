import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TerminalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TerminalTextarea = forwardRef<HTMLTextAreaElement, TerminalTextareaProps>(
  ({ className, label, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        spellCheck={false}
        className={cn(
          "w-full bg-input/30 border border-border text-foreground p-3 text-sm font-mono resize-y",
          "focus:outline-none focus:border-primary focus:bg-input/50",
          "placeholder:text-muted-foreground/60 scrollbar-terminal",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
TerminalTextarea.displayName = "TerminalTextarea";
