export interface PaintingWithCartCount {
  cart_count: number;
}

export interface CartItem {
  id: string;
  painting_id: string;
  user_id?: string | null;
  session_id?: string | null;
  created_at: string;
}

export type RemoveCartParams = { painting_id: string };

// Cart Calculations:
export interface CartItemCal {
  id: string;
  price: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
