export interface PaintingWithCartCount{
  cart_count: number;
}

export interface CartItem{
  id: string;
  painting_id: string;
  user_id?: string | null;
  session_id?: string | null;
  created_at: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export type RemoveCartParams = {painting_id: string};