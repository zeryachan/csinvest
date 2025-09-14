import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { usePortfolioStore, type UserInvestment } from "@/stores/portfolioStore";
import { useToast } from "@/hooks/use-toast";

interface DeleteInvestmentDialogProps {
  investment: UserInvestment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteInvestmentDialog({ 
  investment, 
  open, 
  onOpenChange 
}: DeleteInvestmentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeInvestment = usePortfolioStore((state) => state.removeInvestment);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    removeInvestment(investment.id);
    
    toast({
      title: "Investment Removed",
      description: `Removed ${investment.quantity} ${investment.displayName} from your portfolio`,
      duration: 3000,
    });
    
    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-loss" />
            Remove Investment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-loss/10 border border-loss/20 rounded-lg p-4">
            <p className="text-foreground mb-2">
              Are you sure you want to remove this investment?
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Case:</strong> {investment.displayName}</p>
              <p><strong className="text-foreground">Quantity:</strong> {investment.quantity}</p>
              <p><strong className="text-foreground">Avg Price:</strong> ${investment.avgBuyPrice.toFixed(3)}</p>
              <p><strong className="text-foreground">Total Cost:</strong> ${(investment.quantity * investment.avgBuyPrice).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-loss text-loss-foreground hover:shadow-loss"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-loss-foreground/30 border-t-loss-foreground rounded-full animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Investment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}