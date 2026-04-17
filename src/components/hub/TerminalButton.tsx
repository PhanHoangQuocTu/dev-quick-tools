import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger";

interface TerminalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  ghost:
    "bg-transparent border border-border text-muted-foreground hover:border-primary hover:text-primary",
  danger:
    "bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
};

export const TerminalButton = forwardRef<HTMLButtonElement, TerminalButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
TerminalButton.displayName = "TerminalButton";
