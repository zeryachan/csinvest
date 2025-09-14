// Steam Market API Service for CS2 Case Prices
export interface CaseMarketData {
  success: boolean;
  lowest_price?: string;
  volume?: string;
  median_price?: string;
  price_usd?: number;
  price_formatted?: string;
}

export interface CaseInfo {
  market_hash_name: string;
  display_name: string;
  type: string;
  image_url?: string;
}

// Popular CS2 Cases with their exact Steam Market names
export const CS2_CASES: CaseInfo[] = [
  {
    market_hash_name: "Operation Broken Fang Case",
    display_name: "Operation Broken Fang Case",
    type: "Snakebite Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9IwH8_Q/"
  },
  {
    market_hash_name: "Fracture Case", 
    display_name: "Fracture Case",
    type: "Fracture Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9Igz8_Q/"
  },
  {
    market_hash_name: "Spectrum 2 Case",
    display_name: "Spectrum 2 Case", 
    type: "Gallery Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9Iwj8_Q/"
  },
  {
    market_hash_name: "Dreams & Nightmares Case",
    display_name: "Dreams & Nightmares Case",
    type: "Fever Case", 
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9Iwf8_Q/"
  },
  {
    market_hash_name: "Recoil Case",
    display_name: "Recoil Case",
    type: "Recoil Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9Iwb8_Q/"
  },
  {
    market_hash_name: "Revolution Case",
    display_name: "Revolution Case", 
    type: "Revolution Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9Iwa8_Q/"
  },
  {
    market_hash_name: "Kilowatt Case",
    display_name: "Kilowatt Case",
    type: "Kilowatt Case", 
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9IwZ8_Q/"
  },
  {
    market_hash_name: "Chroma 3 Case",
    display_name: "Chroma 3 Case",
    type: "Chroma Case",
    image_url: "https://community.steamstatic.com/economy/image/6TMcQ7eX6E0tL_H8zd0EU0GADVKIhqQjAP0RX6i0lVM3MVy_Uj3CXA_jwwZe-AyRUjhpHLTKQ3Rl-HnhA4m9IwX8_Q/"
  }
];

class SteamMarketAPIService {
  private readonly STEAM_API_BASE = 'https://steamcommunity.com/market/priceoverview/';
  private readonly APP_ID = '730'; // CS2 App ID
  private readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  
  // Cache to avoid hitting API too frequently
  private priceCache = new Map<string, { data: CaseMarketData; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  private parsePriceString(priceStr: string): number {
    if (!priceStr) return 0;
    // Remove currency symbols and convert to number
    const numStr = priceStr.replace(/[$£€₽¥,]/g, '').trim();
    return parseFloat(numStr) || 0;
  }

  async fetchCasePrice(marketHashName: string): Promise<CaseMarketData> {
    // Check cache first
    const cached = this.priceCache.get(marketHashName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${this.STEAM_API_BASE}?appid=${this.APP_ID}&currency=1&market_hash_name=${encodeURIComponent(marketHashName)}`;
      const proxiedUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;
      
      console.log(`Fetching price for: ${marketHashName}`);
      
      const response = await fetch(proxiedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const result: CaseMarketData = {
        success: data.success || false,
        lowest_price: data.lowest_price,
        volume: data.volume,
        median_price: data.median_price,
        price_usd: data.lowest_price ? this.parsePriceString(data.lowest_price) : 0,
        price_formatted: data.lowest_price
      };

      // Cache the result
      this.priceCache.set(marketHashName, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Error fetching price for ${marketHashName}:`, error);
      
      // Return mock data as fallback to prevent app breaking
      const fallbackPrices: Record<string, number> = {
        "Operation Broken Fang Case": 0.22,
        "Fracture Case": 0.12,
        "Spectrum 2 Case": 0.38,
        "Dreams & Nightmares Case": 0.05,
        "Recoil Case": 0.15,
        "Revolution Case": 0.28,
        "Kilowatt Case": 0.18,
        "Chroma 3 Case": 0.25
      };

      return {
        success: false,
        price_usd: fallbackPrices[marketHashName] || 0.10,
        price_formatted: `$${(fallbackPrices[marketHashName] || 0.10).toFixed(2)}`
      };
    }
  }

  async fetchMultipleCasePrices(marketHashNames: string[]): Promise<Record<string, CaseMarketData>> {
    const results: Record<string, CaseMarketData> = {};
    
    // Fetch prices with small delay to avoid rate limiting
    for (let i = 0; i < marketHashNames.length; i++) {
      const name = marketHashNames[i];
      results[name] = await this.fetchCasePrice(name);
      
      // Add small delay between requests
      if (i < marketHashNames.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return results;
  }

  // Alternative method using a different API endpoint for backup
  async fetchCasePriceAlternative(marketHashName: string): Promise<CaseMarketData> {
    try {
      // Using a different approach - CS:GO market API
      const response = await fetch(`https://api.csgofloat.com/v1/market/items?search=${encodeURIComponent(marketHashName)}&limit=1`);
      
      if (!response.ok) {
        throw new Error(`Alternative API failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          success: true,
          price_usd: item.price || 0,
          price_formatted: `$${(item.price || 0).toFixed(2)}`
        };
      }

      throw new Error('No data found');
    } catch (error) {
      console.error(`Alternative API failed for ${marketHashName}:`, error);
      return this.fetchCasePrice(marketHashName); // Fallback to main method
    }
  }

  clearCache(): void {
    this.priceCache.clear();
  }
}

export const steamMarketAPI = new SteamMarketAPIService();