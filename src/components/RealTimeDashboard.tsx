import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, DollarSign, Target, BarChart3, RefreshCw, Clock } from "lucide-react";
import { useCasePrices } from "@/hooks/useCasePrices";
import { useState } from "react";

interface UserInvestment {
  marketHashName: string;
  quantity: number;
  avgBuyPrice: number;
}

// Mock user investments - in real app this would come from user data/localStorage
const mockUserInvestments: UserInvestment[] = [
  {
    marketHashName: "Operation Broken Fang Case",
    quantity: 25,
    avgBuyPrice: 0.15,
  },
  {
    marketHashName: "Fracture Case", 
    quantity: 50,
    avgBuyPrice: 0.08,
  },
  {
    marketHashName: "Spectrum 2 Case",
    quantity: 15,
    avgBuyPrice: 0.45,
  },
  {
    marketHashName: "Dreams & Nightmares Case",
    quantity: 100,
    avgBuyPrice: 0.03,
  },
  {
    marketHashName: "Recoil Case",
    quantity: 30,
    avgBuyPrice: 0.12,
  }
];

const CaseCard = ({ 
  caseData, 
  investment 
}: { 
  caseData: any;
  investment: UserInvestment;
}) => {
  const totalValue = investment.quantity * caseData.currentPrice;
  const totalCost = investment.quantity * investment.avgBuyPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? ((gainLoss / totalCost) * 100) : 0;
  const isPositive = gainLoss >= 0;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{caseData.displayName}</CardTitle>
          <Badge variant={isPositive ? "default" : "destructive"} className="ml-2">
            {caseData.type}
          </Badge>
        </div>
        {caseData.lastUpdated && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated: {new Date(caseData.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Quantity</p>
            <p className="text-xl font-bold">{investment.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            {caseData.isLoading ? (
              <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold">${totalValue.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Buy Price:</span>
            <span>${investment.avgBuyPrice.toFixed(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            {caseData.isLoading ? (
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <span className="font-semibold">{caseData.priceFormatted}</span>
            )}
          </div>
          {caseData.volume && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Volume:</span>
              <span>{caseData.volume}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">P&L:</span>
            {caseData.isLoading ? (
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RealTimeDashboard = () => {
  const { casePrices, isLoading, error, refreshPrices, lastUpdated } = useCasePrices();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Visual feedback
    refreshPrices();
    setIsRefreshing(false);
  };

  // Calculate portfolio totals
  const portfolioData = mockUserInvestments.map(investment => {
    const caseData = casePrices.find(c => c.marketHashName === investment.marketHashName);
    if (!caseData) return null;
    
    const totalValue = investment.quantity * caseData.currentPrice;
    const totalCost = investment.quantity * investment.avgBuyPrice;
    const gainLoss = totalValue - totalCost;
    
    return { totalValue, totalCost, gainLoss, caseData, investment };
  }).filter(Boolean);

  const totalValue = portfolioData.reduce((sum, item) => sum + (item?.totalValue || 0), 0);
  const totalCost = portfolioData.reduce((sum, item) => sum + (item?.totalCost || 0), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100) : 0;
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
            <p className="text-muted-foreground mt-2">
              Real-time Counter-Strike 2 case investment tracking
            </p>
            {lastUpdated > 0 && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing || isLoading}
              className="hover:shadow-glow transition-all duration-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Investment
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-destructive font-medium">⚠️ Price Update Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              )}
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
              {isLoading ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className={`text-2xl font-bold ${isPortfolioPositive ? 'text-success' : 'text-destructive'}`}>
                  ${Math.abs(totalGainLoss).toFixed(2)}
                </div>
              )}
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
                {mockUserInvestments.reduce((sum, inv) => sum + inv.quantity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Cases in portfolio</p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Investments Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockUserInvestments.map((investment) => {
              const caseData = casePrices.find(c => c.marketHashName === investment.marketHashName);
              
              if (!caseData) {
                return (
                  <Card key={investment.marketHashName} className="bg-gradient-card border-border">
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        Case data not found: {investment.marketHashName}
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              
              return (
                <CaseCard 
                  key={investment.marketHashName}
                  caseData={caseData}
                  investment={investment}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};