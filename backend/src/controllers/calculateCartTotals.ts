import { calculateCartTotals as calculateTotals } from "../utils/money.js";
import type { Response, Request } from "express";

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
}

export const calculateCartTotals = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    console.log("=== CART CALCULATION REQUEST ===");
    console.log(`Request body:${req.body.items?.length || 0} `);

    const { items } = req.body as { items: CartItemCal[] };

    // Validation
    if (!items) {
      console.log("❌ No items provided");
      return res.status(400).json({
        error: "Items array is required",
      });
    }

    if (!Array.isArray(items)) {
      console.log("❌ Items is not an array");
      return res.status(400).json({
        error: "Items must be an array",
      });
    }

    for (const item of items) {
      if (
        !item.id ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return res.status(400).json({
          error: "Each Item must have id, price and quantity properties!",
        });
      }
    }

    if (items.length === 0) {
      console.log("❌ Items array is empty");
      return res.status(400).json({
        error: "Items array cannot be empty",
      });
    }

    console.log(`✅ Calculating totals for ${items.length} items`);

    // Pure calculation - no database needed!
    const totals: CartTotals = calculateTotals(items);

    console.log(`📊 CALCULATION RESULTS:`);
    console.log(`   Subtotal: €${totals.subtotal}`);
    console.log(`   Tax (20%): €${totals.tax}`);
    console.log(
      `   Shipping: €${totals.shipping} ${
        totals.shipping === 0 ? "(FREE - over €100!)" : "(Standard rate)"
      }`
    );
    console.log(`   TOTAL: €${totals.total}`);

    // Return pure numbers (no database interaction)
    res.json(totals);
  } catch (error: unknown) {
    console.error("💥 Error calculating cart totals:", error);
    res.status(500).json({
      error: "Failed to calculate cart totals",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
