import { OrdersService } from "../services/orders.js";
import type { CreateOrderRequest } from "../types/ordersTypes.js";
import type { Request, Response } from "express";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    full_name: string;
    email_verified: boolean;
  };
};

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const requestBody = req.body as CreateOrderRequest;

    // Validate required fields
    if (!requestBody.payment_intent_id) {
      res.status(400).json({
        error: "Payment intent ID is required",
      });
      return;
    }

    if (!requestBody.customer_email || !requestBody.customer_name) {
      res.status(400).json({
        error: "customer email and name are required",
      });
      return;
    }

    if (!requestBody.shipping_address) {
      res.status(400).json({
        error: "shipping address is required",
      });
      return;
    }

    // Get user Info an validate
    const userId = req.user?.id;
    const sessionId = req.body.session_id;

    if (!userId && !sessionId) {
      res.status(400).json({
        error: "UserId or SessionId is required",
      });
      return;
    }

    // Todo: for now we have the totals here but later we should recalculate them server-side!
    const totals = req.body.totals || {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    };

    // Call service to create order!
    const order = await OrdersService.createOrderFromCart({
      userId,
      sessionId,
      paymentIntentId: requestBody.payment_intent_id,
      customerInfo: {
        name: requestBody.customer_name,
        email: requestBody.customer_email,
        phone: requestBody.customer_phone,
      },
      shippingAddress: requestBody.shipping_address,
      billingAddress: requestBody.billing_address,
      totals,
      notes: requestBody.notes,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error: unknown) {
    console.error("order creation error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Cart is empty")) {
        res.status(400).json({
          error: "Cannot create order from empty cart",
        });
        return;
      }

      if (error.message.includes("no longer available")) {
        res.status(409).json({
          error: error.message,
        });
        return;
      }

      if (error.message.includes("already exists")) {
        res.status(409).json({
          error: "Order already exists for this payment",
        });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to create order",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

// ----------------------------
// Get all orders for user
// ----------------------------

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    const orders = await OrdersService.getOrdersByUser(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: unknown) {
    console.error("Get orders error:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

// ----------------------------
// Get single order by ID
// ----------------------------

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      res.status(400).json({
        error: "Order ID is required",
      });
      return;
    }

    const userId = req.user?.id;

    const order = await OrdersService.getOrderById(orderId, userId);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: unknown) {
    console.error("Get order by ID error:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        res.status(404).json({
          error: "Order not found",
        });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to fetch order",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
