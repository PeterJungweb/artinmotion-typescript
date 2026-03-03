import { supabase } from "../utils/supabase.js";
import type { SupabaseResponse } from "../types/supabaseResponseType.js";
import type {
  OrderRow,
  OrderItemRow,
  CreateOrderParams,
  OrderWithItems,
} from "../types/ordersTypes.js";

export class OrdersService {
  static async createOrderFromCart(
    params: CreateOrderParams,
  ): Promise<OrderWithItems> {
    const {
      userId,
      sessionId,
      paymentIntentId,
      customerInfo,
      shippingAddress,
      billingAddress,
      totals,
      notes,
    } = params;

    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId is required");
    }

    const { data: existingOrder } = (await supabase
      .from("orders")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle()) as SupabaseResponse<{ id: string }>;

    if (existingOrder) {
      return this.getOrderById(existingOrder.id);
    }

    let cartQuery = supabase.from("cart_items").select("id, painting_id");

    if (userId) {
      cartQuery = cartQuery.eq("user_id", userId);
    } else {
      cartQuery = cartQuery.eq("session_id", sessionId);
    }

    const { data: cartItems, error: cartError } = await cartQuery;

    if (cartError) {
      throw new Error(`Failed to fetch cart: ${cartError.message}`);
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty - cannot create order");
    }

    const paintingIds = cartItems.map((item) => item.painting_id);

    const { data: paintings, error: paintingsError } = await supabase
      .from("paintings")
      .select("id, title, price, image_url, is_available")
      .in("id", paintingIds);

    if (paintingsError) {
      throw new Error(`Failed to fetch paintings: ${paintingsError.message}`);
    }

    const unavailablePaintings = paintings?.filter((p) => !p.is_available);
    if (unavailablePaintings && unavailablePaintings.length > 0) {
      throw new Error(
        `Some paintings are no longer available: ${unavailablePaintings.map((p) => p.title).join(",")}`,
      );
    }

    // Generate the orderNumber in this format: "ORD-YYYYMMDD-XXXXX" zb: "ORD-20260301-12345"
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // create the order
    const { data: newOrder, error: orderError } = (await supabase
      .from("orders")
      .insert({
        user_id: userId || null,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || null,
        shipping_address: shippingAddress,
        billing_address: billingAddress || null,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping_cost: totals.shipping,
        reservation_credit: totals.reservationCredit || 0,
        total: totals.total,
        payment_status: "succeeded",
        order_status: "completed",
        stripe_payment_intent_id: paymentIntentId,
        order_number: orderNumber,
        notes: notes || null,
      })
      .select()
      .single()) as SupabaseResponse<OrderRow>;

    if (orderError || !newOrder) {
      throw new Error(`Failed to create Order: ${orderError?.message}`);
    }

    // snap shot for preservation of data
    const orderItemsToInsert = paintings!.map((painting) => ({
      order_id: newOrder?.id,
      painting_id: painting.id,
      painting_title: painting.title,
      price_at_purchase: painting.price,
      quantity: 1,
    }));

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert)
      .select();

    if (itemsError) {
      // In production this should trigger a rollback or alert!!!
      console.error("CRITICAL: Order created but items failed:", itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Update paintings - mark as sold
    const { error: updateError } = await supabase
      .from("paintings")
      .update({
        is_available: false,
        availability_status: "sold",
      })
      .in("id", paintingIds);

    if (updateError) {
      console.error(
        "Warning: Failed to update painting availability:",
        updateError,
      );
    }

    // Clear Cart

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .in(
        "id",
        cartItems.map((item) => item.id),
      );

    if (deleteError) {
      console.error("Warning: Failed to clear cart:", deleteError);
    }

    // Return complete order with items!

    return {
      ...newOrder,
      items: orderItems || [],
    };
  }

  // Get all orders for a specific User
  static async getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    const { data: orders, error } = (await supabase
      .from("orders")
      .select(`*, items:order_items(*)`)
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })) as SupabaseResponse<OrderWithItems[]>;

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return orders || [];
  }

  // Get a single order by ID!
  static async getOrderById(
    orderId: string,
    userId?: string,
  ): Promise<OrderWithItems> {
    let query = supabase
      .from("orders")
      .select(
        `*,items:order_items(*,painting:paintings(image_url,description,medium))`,
      )
      .eq("id", orderId);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: order, error } =
      (await query.single()) as SupabaseResponse<OrderWithItems>;

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Order not found");
      }
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  // Update payment status (called by webhook)
  static async updatePaymentStatus(
    paymentIntentId: string,
    status: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("stripe_payment_intent_id", paymentIntentId);

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }
}
