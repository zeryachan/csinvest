import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, DollarSign, Target, BarChart3 } from "lucide-react";

interface CaseInvestment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  imageUrl: string;
}

const mockInvestments: CaseInvestment[] = [
  {
    id: "1",
    name: "Operation Broken Fang Case",
    type: "Snakebite Case",
    quantity: 25,
    avgBuyPrice: 0.15,
    currentPrice: 0.22,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2", 
    name: "Fracture Case",
    type: "Fracture Case",
    quantity: 50,
    avgBuyPrice: 0.08,
    currentPrice: 0.12,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Spectrum 2 Case",
    type: "Gallery Case", 
    quantity: 15,
    avgBuyPrice: 0.45,
    currentPrice: 0.38,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Dreams & Nightmares Case",
    type: "Fever Case",
    quantity: 100,
    avgBuyPrice: 0.03,
    currentPrice: 0.05,
    imageUrl: "/placeholder.svg"
  }
];

const CaseCard = ({ investment }: { investment: CaseInvestment }) => {
  const totalValue = investment.quantity * investment.currentPrice;
  const totalCost = investment.quantity * investment.avgBuyPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = ((gainLoss / totalCost) * 100);
  const isPositive = gainLoss >= 0;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{investment.name}</CardTitle>
          <Badge variant={isPositive ? "default" : "destructive"} className="ml-2">
            {investment.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Quantity</p>
            <p className="text-xl font-bold">{investment.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Buy Price:</span>
            <span>${investment.avgBuyPrice.toFixed(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            <span>${investment.currentPrice.toFixed(3)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">P&L:</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className={isPositive ? "text-success font-semibold" : "text-destructive font-semibold"}>
                ${Math.abs(gainLoss).toFixed(2)} ({Math.abs(gainLossPercent).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const totalValue = mockInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
  const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.avgBuyPrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = ((totalGainLoss / totalCost) * 100);
  const isPortfolioPositive = totalGainLoss >= 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CS2 Case Portfolio
            </h1>
            <p className="text-muted-foreground mt-2">Track your Counter-Strike 2 case investments</p>
          </div>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Portfolio current value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total invested amount</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
              {isPortfolioPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isPortfolioPositive ? 'text-success' : 'text-destructive'}`}>
                ${Math.abs(totalGainLoss).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.abs(totalGainLossPercent).toFixed(1)}% {isPortfolioPositive ? 'gain' : 'loss'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockInvestments.reduce((sum, inv) => sum + inv.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Cases in portfolio</p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockInvestments.map((investment) => (
              <CaseCard key={investment.id} investment={investment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};