import { useState, useEffect, useCallback } from 'react';
import { steamMarketAPI, CS2_CASES, type CaseMarketData } from '@/services/SteamMarketAPI';
import { useToast } from '@/hooks/use-toast';

interface CasePriceData {
  marketHashName: string;
  displayName: string;
  type: string;
  imageUrl: string;
  currentPrice: number;
  priceFormatted: string;
  volume?: string;
  isLoading: boolean;
  lastUpdated?: Date;
}

export const useCasePrices = () => {
  const [casePrices, setCasePrices] = useState<Record<string, CasePriceData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeCases = useCallback(() => {
    const initial: Record<string, CasePriceData> = {};
    
    CS2_CASES.forEach(caseInfo => {
      initial[caseInfo.market_hash_name] = {
        marketHashName: caseInfo.market_hash_name,
        displayName: caseInfo.display_name,
        type: caseInfo.type,
        imageUrl: caseInfo.image_url || '/placeholder.svg',
        currentPrice: 0,
        priceFormatted: '$0.00',
        isLoading: true,
      };
    });
    
    setCasePrices(initial);
  }, []);

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const marketNames = CS2_CASES.map(c => c.market_hash_name);
      console.log('Fetching prices for cases:', marketNames);
      
      const priceData = await steamMarketAPI.fetchMultipleCasePrices(marketNames);
      
      setCasePrices(prev => {
        const updated = { ...prev };
        
        Object.entries(priceData).forEach(([marketName, data]) => {
          if (updated[marketName]) {
            updated[marketName] = {
              ...updated[marketName],
              currentPrice: data.price_usd || 0,
              priceFormatted: data.price_formatted || `$${(data.price_usd || 0).toFixed(2)}`,
              volume: data.volume,
              isLoading: false,
              lastUpdated: new Date(),
            };
          }
        });
        
        return updated;
      });

      toast({
        title: "Prices Updated",
        description: "CS2 case prices have been refreshed from Steam Market",
        duration: 3000,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case prices';
      setError(errorMessage);
      
      toast({
        title: "Price Update Failed", 
        description: "Using cached/fallback prices. Check your connection.",
        variant: "destructive",
        duration: 5000,
      });

      // Set loading to false for all cases even on error
      setCasePrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key].isLoading = false;
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshPrices = useCallback(() => {
    steamMarketAPI.clearCache();
    fetchPrices();
  }, [fetchPrices]);

  // Initialize cases and fetch prices on mount
  useEffect(() => {
    initializeCases();
  }, [initializeCases]);

  useEffect(() => {
    if (Object.keys(casePrices).length > 0) {
      fetchPrices();
    }
  }, [fetchPrices, Object.keys(casePrices).length]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        console.log('Auto-refreshing case prices...');
        fetchPrices();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchPrices, isLoading]);

  return {
    casePrices: Object.values(casePrices),
    isLoading,
    error,
    refreshPrices,
    lastUpdated: Math.max(...Object.values(casePrices).map(c => c.lastUpdated?.getTime() || 0))
  };
};