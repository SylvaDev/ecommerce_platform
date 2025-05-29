import { create } from 'zustand';

const useStore = create((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] }),
}));

export default useStore; 