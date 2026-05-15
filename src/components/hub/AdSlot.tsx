interface AdSlotProps {
  slot?: string;
  variant?: "banner" | "inline" | "square";
  className?: string;
}

export const AdSlot = ({ slot = "default", variant = "inline", className = "" }: AdSlotProps) => {
  const sizes = {
    banner: "min-h-[90px]",
    inline: "min-h-[120px]",
    square: "min-h-[250px]",
  };

  return (
    <aside
      aria-label="Sponsored"
      data-ad-slot={slot}
      className={`border border-dashed border-border ${className}`}
    >
      <div
        className={`${sizes[variant]} flex items-center justify-center text-center px-4 py-4`}
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
          Advertisement
        </span>
      </div>
    </aside>
  );
};
