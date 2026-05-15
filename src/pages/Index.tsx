import { Link } from "react-router-dom";
import { tools } from "@/lib/tools";
import { AdSlot } from "@/components/hub/AdSlot";

const Index = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-12 flex flex-col gap-10">
      {/* Hero */}
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center gap-3 flex-wrap">
          Dev Utility Hub
          <span className="w-3 h-7 md:h-10 bg-primary animate-blink inline-block" aria-hidden />
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Small, fast tools for everyday dev work. No login, no setup — pick a tool and go.
        </p>

        <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="border border-border px-2 py-1">No login</span>
          <span className="border border-border px-2 py-1">Runs in your browser</span>
          <span className="border border-border px-2 py-1">{tools.length} tools</span>
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
                className="group relative flex flex-col min-h-[170px] p-5 border border-border hover:border-primary hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 border border-border flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    {tool.symbol}
                  </div>
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" aria-hidden />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {tool.short}
                </p>
                <div className="flex justify-end items-end text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
                  <span className="text-primary group-hover:underline">Open →</span>
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
