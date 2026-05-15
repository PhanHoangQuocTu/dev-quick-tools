import { NavLink, useLocation } from "react-router-dom";
import { Home, Terminal } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { tools } from "@/lib/tools";

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-2 px-2 py-2">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-foreground">
              DevHub
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")} tooltip="Home">
                  <NavLink to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">
              Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const Icon = tool.icon;
                const path = `/${tool.slug}`;
                return (
                  <SidebarMenuItem key={tool.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(path)}
                      tooltip={tool.name}
                    >
                      <NavLink to={path} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{tool.name}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
