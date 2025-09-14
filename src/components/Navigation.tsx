import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Settings, Home } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CS2 Portfolio
            </div>
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};