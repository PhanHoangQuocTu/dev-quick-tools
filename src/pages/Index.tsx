import { Link } from "react-router-dom";
import { tools } from "@/lib/tools";
import { AdSlot } from "@/components/hub/AdSlot";

const Index = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm terminal-prompt">
          ./list_modules.sh --all
        </p>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest glow-text flex items-center gap-3 flex-wrap">
          Dev_Utility_Hub
          <span className="w-3 h-7 md:h-10 bg-primary animate-blink inline-block" aria-hidden />
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
          A focused set of fast, no-login developer tools. Format JSON, decode Base64,
          test regex, diff text, convert timestamps, generate mock data — all from one
          terminal.
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="border border-border px-2 py-1">no_login</span>
          <span className="border border-border px-2 py-1">runs_local</span>
          <span className="border border-border px-2 py-1">{tools.length}_modules_loaded</span>
        </div>
      </section>

      {/* Modules grid */}
      <section>
        <h2 className="sr-only">Available tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                to={`/${tool.slug}`}
                className="group relative flex flex-col min-h-[210px] p-5 border border-border hover:border-primary hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 border border-border flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    {tool.symbol}
                  </div>
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" aria-hidden />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2 group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 pr-2">
                  {tool.description}
                </p>
                <div className="flex justify-between items-end text-[10px] text-muted-foreground mt-4 border-t border-border/60 pt-3 uppercase tracking-widest">
                  <span>{tool.code} // {tool.meta}</span>
                  <span className="text-primary">[ run ]</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad slot */}
      <AdSlot slot="home-bottom" variant="banner" />
    </div>
  );
};

export default Index;
