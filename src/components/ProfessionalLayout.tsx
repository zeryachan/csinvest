import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";

interface ProfessionalLayoutProps {
  children: ReactNode;
}

export function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Global Header */}
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}