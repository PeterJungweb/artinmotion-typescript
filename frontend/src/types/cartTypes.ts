export interface Painting {
  id: string;
  title: string;
  price: number;
  image: string;
  is_available?: boolean;
}

export interface CartItem extends Painting {
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartContextValue {
  cartItems: CartItem[];
  cartTotals: CartTotals;
  loading: boolean;
  addToCart: (item: Painting) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
