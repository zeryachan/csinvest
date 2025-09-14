import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInvestment {
  id: string;
  marketHashName: string;
  displayName: string;
  type: string;
  quantity: number;
  avgBuyPrice: number;
  purchaseDate: Date;
  notes?: string;
}

interface PortfolioState {
  investments: UserInvestment[];
  addInvestment: (investment: Omit<UserInvestment, 'id' | 'purchaseDate'>) => void;
  updateInvestment: (id: string, updates: Partial<UserInvestment>) => void;
  removeInvestment: (id: string) => void;
  clearPortfolio: () => void;
  getTotalInvestments: () => number;
  getInvestmentById: (id: string) => UserInvestment | undefined;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      investments: [
        // Default investments for demo
        {
          id: '1',
          marketHashName: "Operation Broken Fang Case",
          displayName: "Operation Broken Fang Case",
          type: "Snakebite Case",
          quantity: 25,
          avgBuyPrice: 0.15,
          purchaseDate: new Date('2024-01-15'),
          notes: 'Initial investment'
        },
        {
          id: '2',
          marketHashName: "Fracture Case",
          displayName: "Fracture Case", 
          type: "Fracture Case",
          quantity: 50,
          avgBuyPrice: 0.08,
          purchaseDate: new Date('2024-02-01'),
        },
        {
          id: '3',
          marketHashName: "Spectrum 2 Case",
          displayName: "Spectrum 2 Case",
          type: "Gallery Case",
          quantity: 15,
          avgBuyPrice: 0.45,
          purchaseDate: new Date('2024-01-20'),
        },
        {
          id: '4',
          marketHashName: "Dreams & Nightmares Case",
          displayName: "Dreams & Nightmares Case",
          type: "Fever Case",
          quantity: 100,
          avgBuyPrice: 0.03,
          purchaseDate: new Date('2024-03-01'),
          notes: 'High volume investment'
        }
      ],

      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, {
          ...investment,
          id: generateId(),
          purchaseDate: new Date(),
        }]
      })),

      updateInvestment: (id, updates) => set((state) => ({
        investments: state.investments.map(inv => 
          inv.id === id ? { ...inv, ...updates } : inv
        )
      })),

      removeInvestment: (id) => set((state) => ({
        investments: state.investments.filter(inv => inv.id !== id)
      })),

      clearPortfolio: () => set({ investments: [] }),

      getTotalInvestments: () => {
        const { investments } = get();
        return investments.reduce((total, inv) => total + inv.quantity, 0);
      },

      getInvestmentById: (id) => {
        const { investments } = get();
        return investments.find(inv => inv.id === id);
      },
    }),
    {
      name: 'cs2-portfolio-storage',
      version: 1,
    }
  )
);