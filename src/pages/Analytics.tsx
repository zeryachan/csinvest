import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Calendar } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Portfolio Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed analysis and insights for your CS2 case investments
        </p>
      </div>

      {/* Coming Soon Placeholder */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
            <h3 className="text-2xl font-semibold text-foreground">Advanced Analytics Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              We're building detailed charts, performance metrics, and market insights to help you make better investment decisions.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              <Badge variant="outline" className="border-profit/30 text-profit">
                Price History Charts
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Performance Metrics
              </Badge>
              <Badge variant="outline" className="border-neutral/30 text-neutral">
                Market Comparison
              </Badge>
              <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                Risk Analysis
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}