import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-20 flex flex-col items-start gap-4">
      <p className="text-muted-foreground text-sm terminal-prompt">cat {location.pathname}</p>
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest glow-text">
        404 // not_found
      </h1>
      <p className="text-muted-foreground">
        the requested module does not exist on this kernel.
      </p>
      <Link
        to="/"
        className="mt-4 border border-primary text-primary px-3 py-1.5 text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        [ return_home ]
      </Link>
    </div>
  );
};

export default NotFound;
