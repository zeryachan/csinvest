import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CS2_CASES } from "@/services/SteamMarketAPI";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useToast } from "@/hooks/use-toast";

export function AddInvestmentDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    marketHashName: "",
    displayName: "",
    type: "",
    quantity: "",
    avgBuyPrice: "",
    notes: "",
  });

  const addInvestment = usePortfolioStore((state) => state.addInvestment);
  const { toast } = useToast();

  const handleCaseSelect = (marketHashName: string) => {
    const selectedCase = CS2_CASES.find(c => c.market_hash_name === marketHashName);
    if (selectedCase) {
      setFormData(prev => ({
        ...prev,
        marketHashName,
        displayName: selectedCase.display_name,
        type: selectedCase.type,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marketHashName || !formData.quantity || !formData.avgBuyPrice) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    const avgBuyPrice = parseFloat(formData.avgBuyPrice);

    if (quantity <= 0 || avgBuyPrice <= 0) {
      toast({
        title: "Invalid Values",
        description: "Quantity and price must be positive numbers",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    addInvestment({
      marketHashName: formData.marketHashName,
      displayName: formData.displayName,
      type: formData.type,
      quantity,
      avgBuyPrice,
      notes: formData.notes || undefined,
    });

    toast({
      title: "Investment Added",
      description: `Added ${quantity} ${formData.displayName} to your portfolio`,
      duration: 3000,
    });

    // Reset form and close dialog
    setFormData({
      marketHashName: "",
      displayName: "",
      type: "",
      quantity: "",
      avgBuyPrice: "",
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-premium text-background hover:shadow-premium transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-select" className="text-foreground">
              Select CS2 Case *
            </Label>
            <Select onValueChange={handleCaseSelect} required>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Choose a case..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {CS2_CASES.map((caseInfo) => (
                  <SelectItem 
                    key={caseInfo.market_hash_name} 
                    value={caseInfo.market_hash_name}
                    className="text-foreground hover:bg-muted"
                  >
                    {caseInfo.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-foreground">
                Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgBuyPrice" className="text-foreground">
                Avg Buy Price ($) *
              </Label>
              <Input
                id="avgBuyPrice"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.000"
                value={formData.avgBuyPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, avgBuyPrice: e.target.value }))}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this investment..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-input border-border text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-premium text-background hover:shadow-premium"
            >
              Add Investment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}