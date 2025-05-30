import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      // Add item to cart
      addItem: (item) => {
        console.log('Adding item to cart:', item);
        const { items } = get();
        const existingItem = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          console.log('Item exists, updating quantity');
          // Update quantity if item exists
          set(state => {
            const newState = {
              items: state.items.map(i =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              total: state.total + (item.price * item.quantity),
              itemCount: state.itemCount + item.quantity
            };
            console.log('New cart state:', newState);
            return newState;
          });
        } else {
          console.log('Adding new item');
          // Add new item
          set(state => {
            const newState = {
              items: [...state.items, item],
              total: state.total + (item.price * item.quantity),
              itemCount: state.itemCount + item.quantity
            };
            console.log('New cart state:', newState);
            return newState;
          });
        }
      },

      // Remove item from cart
      removeItem: (productId, variantId) => {
        console.log('Removing item:', { productId, variantId });
        const { items } = get();
        const itemToRemove = items.find(
          i => i.productId === productId && i.variantId === variantId
        );

        if (itemToRemove) {
          set(state => {
            const newState = {
              items: state.items.filter(
                i => !(i.productId === productId && i.variantId === variantId)
              ),
              total: state.total - (itemToRemove.price * itemToRemove.quantity),
              itemCount: state.itemCount - itemToRemove.quantity
            };
            console.log('New cart state after removal:', newState);
            return newState;
          });
        }
      },

      // Update item quantity
      updateQuantity: (productId, variantId, newQuantity) => {
        console.log('Updating quantity:', { productId, variantId, newQuantity });
        const { items } = get();
        const item = items.find(
          i => i.productId === productId && i.variantId === variantId
        );

        if (item && newQuantity > 0) {
          const quantityDiff = newQuantity - item.quantity;
          set(state => {
            const newState = {
              items: state.items.map(i =>
                i.productId === productId && i.variantId === variantId
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
              total: state.total + (item.price * quantityDiff),
              itemCount: state.itemCount + quantityDiff
            };
            console.log('New cart state after quantity update:', newState);
            return newState;
          });
        }
      },

      // Clear cart
      clearCart: () => {
        console.log('Clearing cart');
        set({ items: [], total: 0, itemCount: 0 });
      },

      // Get cart item count
      getItemCount: () => {
        return get().itemCount;
      },

      // Get cart total
      getTotal: () => {
        return get().total;
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }), // persist items, total, and itemCount
    }
  )
);

export default useCartStore; 