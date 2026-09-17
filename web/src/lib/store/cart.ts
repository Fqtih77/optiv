"use client";

import { create } from "zustand";

interface CartLine {
  productId: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  setQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { lines: state.lines.filter((l) => l.productId !== productId) };
      }
      const exists = state.lines.find((l) => l.productId === productId);
      if (exists) {
        return {
          lines: state.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        };
      }
      return { lines: [...state.lines, { productId, quantity }] };
    }),
  removeLine: (productId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
  clear: () => set({ lines: [] }),
}));
