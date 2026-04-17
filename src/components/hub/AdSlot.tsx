interface AdSlotProps {
  /** Unique slot id for AdSense data-ad-slot */
  slot?: string;
  /** Visual variant */
  variant?: "banner" | "inline" | "square";
  className?: string;
}

/**
 * Ad placeholder. Wraps the area where Google AdSense (or any ad network)
 * markup will live. To activate AdSense:
 *   1. Add your ca-pub script in index.html (commented placeholder is there)
 *   2. Replace the inner placeholder with the <ins class="adsbygoogle" .../> snippet
 *      and uncomment the <script>(adsbygoogle = window.adsbygoogle || []).push({})</script> below.
 */
export const AdSlot = ({ slot = "default", variant = "inline", className = "" }: AdSlotProps) => {
  const sizes = {
    banner: "min-h-[90px]",
    inline: "min-h-[120px]",
    square: "min-h-[250px]",
  };

  return (
    <aside
      aria-label="Sponsored"
      className={`border border-dashed border-border p-1 ${className}`}
    >
      <div
        className={`border border-dashed border-border ${sizes[variant]} flex flex-col items-center justify-center text-center gap-2 px-4 py-4`}
      >
        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
          Sponsored
        </span>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          // ad slot: {slot}
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          replace with adsense ins tag
        </p>

        {/* Real AdSense block (paste your ad unit and uncomment):
        <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slot}
             data-ad-format="auto"
             data-full-width-responsive="true" />
        */}
      </div>
    </aside>
  );
};
