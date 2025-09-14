import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, BarChart3, Home, Settings, Wallet } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Portfolio", url: "/", icon: Wallet },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Market", url: "/market", icon: TrendingUp },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = navigationItems.some((i) => isActive(i.url));
  const isSettingsExpanded = settingsItems.some((i) => isActive(i.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-premium text-background font-medium shadow-premium" 
      : "hover:bg-muted/50 text-foreground";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Brand */}
        <div className="p-4 border-b border-border">
          {state !== "collapsed" && (
            <h2 className="text-xl font-bold bg-gradient-premium bg-clip-text text-transparent">
              CS2 Portfolio
            </h2>
          )}
          {state === "collapsed" && (
            <div className="w-8 h-8 bg-gradient-premium rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">C2</span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs">
            {state !== "collapsed" && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs">
            {state !== "collapsed" && "Settings"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}