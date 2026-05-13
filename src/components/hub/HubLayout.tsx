import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalFooter } from "./TerminalFooter";
import { AppSidebar } from "./AppSidebar";

export const HubLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-dvh flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
            <SidebarTrigger className="ml-2 text-muted-foreground hover:text-primary" />
            <div className="flex-1 min-w-0">
              <TerminalHeader />
            </div>
          </div>
          <main className="flex-1 w-full">
            <Outlet />
          </main>
          <TerminalFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};
