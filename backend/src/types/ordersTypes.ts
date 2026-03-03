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

  notes: string | null;
  created_at: string;
  updated_at: string;
}

// "order_items"- table supabase
export interface OrderItemRow {
  id: string;
  order_id: string;
  painting_id: string;
  quantity: number;

  // preserved data
  painting_title: string;
  price_at_purchase: number;

  created_at: string;
}

// Defines what an adress Looks like!
export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
  state?: string;
}

// ---------------------------
// Api Request/Response types!
// ---------------------------

// CreateOrderRequest
export interface CreateOrderRequest {
  payment_intent_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  notes?: string | null;
}

// OrderWithItems - this is used to fetch the order details
export interface OrderWithItems extends OrderRow {
  items: OrderItemWithPainting[];
}

// OrderItemWithPainting - this is a order item with additional painting details!
export interface OrderItemWithPainting extends OrderItemRow {
  painting?: {
    image_url: string | null;
    description: string | null;
    medium: string | null;
  };
}

// ------------------------
// SERVICE LAYER TYPES
// ------------------------

// CreateOrderParams - Internal parameter for service layer!

export interface CreateOrderParams {
  userId?: string;
  sessionId?: string;
  paymentIntentId: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    reservationCredit?: number;
    total: number;
  };
  notes?: string | null;
}
