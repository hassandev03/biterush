import { create } from 'zustand';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

async function adjustStock(productId: string, delta: number) {
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
  } catch {
    // Fire-and-forget — silently ignore network errors
  }
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product._id === product._id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }

    // Reduce stock by 1 each time an item is added
    adjustStock(product._id, -1);
  },
  removeItem: (productId) => {
    const items = get().items;
    const item = items.find((i) => i.product._id === productId);

    if (item) {
      // Restore the full quantity back to stock
      adjustStock(productId, item.quantity);
    }

    set({ items: items.filter((i) => i.product._id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;

    const items = get().items;
    const currentItem = items.find((i) => i.product._id === productId);

    if (currentItem) {
      const delta = currentItem.quantity - quantity; // positive = restore stock, negative = reserve more
      adjustStock(productId, delta);
    }

    set({
      items: items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
}));
