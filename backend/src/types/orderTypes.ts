export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

// "orders" - table supabase!

export interface OrderRow {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;

  // Adresses stored
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress | null;

  // Money
  subtotal: number;
  tax: number;
  shipping_cost: number;
  reservation_credit: number;
  total: number;

  // Status
  payment_status: string;
  order_status: string;

  // Stripe
  stripe_payment_intent_id: string | null;
  order_number: string | null;

  notes: string;
  created_at: string;
  updated_at: string;
}

// "order_items"- table supabase
export interface OrderItemRow {
  id: string;
  order_id: string;
  painting_id: string;

  // preserved data
  painting_title: string;
  price_at_purchase: number;

  created_at: string;
}
