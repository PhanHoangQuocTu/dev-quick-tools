import { Outlet } from "react-router-dom";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalFooter } from "./TerminalFooter";

export const HubLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <TerminalHeader />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <TerminalFooter />
    </div>
  );
};
