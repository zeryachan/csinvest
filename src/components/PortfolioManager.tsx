import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, RefreshCw, Clock, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCasePrices } from "@/hooks/useCasePrices";
import { usePortfolioStore, type UserInvestment } from "@/stores/portfolioStore";
import { AddInvestmentDialog } from "@/components/AddInvestmentDialog";
import { DeleteInvestmentDialog } from "@/components/DeleteInvestmentDialog";
import { useState } from "react";

interface CaseCardProps {
  investment: UserInvestment;
  caseData: any;
  onDelete: (investment: UserInvestment) => void;
}

const CaseCard = ({ investment, caseData, onDelete }: CaseCardProps) => {
  const totalValue = investment.quantity * caseData.currentPrice;
  const totalCost = investment.quantity * investment.avgBuyPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? ((gainLoss / totalCost) * 100) : 0;
  const isPositive = gainLoss >= 0;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{investment.displayName}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isPositive ? "default" : "destructive"} 
              className={isPositive ? "bg-profit/20 text-profit border-profit/30" : "bg-loss/20 text-loss border-loss/30"}
            >
              {investment.type}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(investment)}
                  className="text-loss hover:bg-loss/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            <p className="text-xl font-bold text-foreground">{investment.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            {caseData.isLoading ? (
              <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg Buy Price:</span>
            <span className="text-foreground">${investment.avgBuyPrice.toFixed(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            {caseData.isLoading ? (
              <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <span className="font-semibold text-foreground">{caseData.priceFormatted}</span>
            )}
          </div>
          {caseData.volume && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Volume:</span>
              <span className="text-foreground">{caseData.volume}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">P&L:</span>
            {caseData.isLoading ? (
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-profit" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-loss" />
                )}
                <span className={`font-semibold ${isPositive ? "text-profit" : "text-loss"}`}>
                  ${Math.abs(gainLoss).toFixed(2)} ({Math.abs(gainLossPercent).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {investment.notes && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{investment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function PortfolioManager() {
  const { casePrices, isLoading, error, refreshPrices, lastUpdated } = useCasePrices();
  const investments = usePortfolioStore((state) => state.investments);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    refreshPrices();
    setIsRefreshing(false);
  };

  const handleDeleteClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setDeleteDialogOpen(true);
  };

  // Calculate portfolio totals
  const portfolioData = investments.map(investment => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Portfolio Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time CS2 case investment tracking with professional analytics
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
            className="bg-card border-border text-foreground hover:bg-muted transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
          </Button>
          <AddInvestmentDialog />
        </div>
      </div>

      {error && (
        <Card className="border-loss bg-loss/5">
          <CardContent className="p-4">
            <p className="text-loss font-medium">⚠️ Price Update Error</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</div>
            )}
            <p className="text-xs text-muted-foreground">Portfolio current value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Cost</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total invested amount</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Unrealized P&L</CardTitle>
            {isPortfolioPositive ? (
              <TrendingUp className="h-4 w-4 text-profit" />
            ) : (
              <TrendingDown className="h-4 w-4 text-loss" />
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className={`text-2xl font-bold ${isPortfolioPositive ? 'text-profit' : 'text-loss'}`}>
                ${Math.abs(totalGainLoss).toFixed(2)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {Math.abs(totalGainLossPercent).toFixed(1)}% {isPortfolioPositive ? 'gain' : 'loss'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Cases</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {investments.reduce((sum, inv) => sum + inv.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Cases in portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Investments Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Your Investments</h2>
        {investments.length === 0 ? (
          <Card className="bg-gradient-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-3">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">No Investments Yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Get started by adding your first CS2 case investment to track your portfolio performance.
                </p>
                <AddInvestmentDialog />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {investments.map((investment) => {
              const caseData = casePrices.find(c => c.marketHashName === investment.marketHashName);
              
              if (!caseData) {
                return (
                  <Card key={investment.id} className="bg-gradient-card border-border">
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
                  key={investment.id}
                  investment={investment}
                  caseData={caseData}
                  onDelete={handleDeleteClick}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {selectedInvestment && (
        <DeleteInvestmentDialog
          investment={selectedInvestment}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  );
}