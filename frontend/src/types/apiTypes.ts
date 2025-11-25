import type { Painting, CartTotals } from "./cartTypes";

// ===================== Paintings Api Response ================== //
export interface PaintingFromBackend extends Painting {
  description: string;
  category: string;
  medium: string;
  dimensions_width: number;
  dimensions_height: number;
  image_url: string;
  is_featured: boolean;
  cart_count: number;
  availability_status: string;
  created_at: string;
}

export interface GetAllPaintingsResponse {
  paintings: PaintingFromBackend[];
  total: number;
}

// ===================== Cart Api Response ================== //

// POST /api/cart/add
export interface AddToCartResponse {
  success: boolean;
  cartItem: {
    painting_id: string;
    user_id: string | null;
    session_id: string | null;
  };
  message: string;
}

// DELETE /api/cart/remove/:id
export interface RemoveFromCartResponse {
  success: boolean;
  message: string;
}

// ===================== Orders Api Response ================== //
// needs to be created!!

// ===================== WebSocket Messag Types ================== //

interface CartCountUpdateMessage {
  type: "CART_COUNT_UPDATE";
  paintingId: string;
  cartCount: number;
}

interface ConnectionEstablishedMessage {
  type: "CONNECTION_ESTABLISHED";
  message: string;
}

export type WebSocketMessage =
  | CartCountUpdateMessage
  | ConnectionEstablishedMessage;
