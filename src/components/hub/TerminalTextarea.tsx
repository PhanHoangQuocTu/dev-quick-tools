import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TerminalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

export const TerminalTextarea = forwardRef<HTMLTextAreaElement, TerminalTextareaProps>(
  ({ className, label, wrapperClassName, ...props }, ref) => (
    <div className={cn("flex flex-col gap-1.5 min-h-0", wrapperClassName)}>
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        spellCheck={false}
        className={cn(
          "w-full flex-1 min-h-0 bg-input/30 border border-border text-foreground p-3 text-sm font-mono resize-none",
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
