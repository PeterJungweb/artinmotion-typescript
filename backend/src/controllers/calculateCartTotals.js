import { calculateCartTotals as calculateTotals } from "../utils/money.js";

export const calculateCartTotals = async (req, res) => {
  try {
    console.log("=== CART CALCULATION REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { items } = req.body;

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

    if (items.length === 0) {
      console.log("❌ Items array is empty");
      return res.status(400).json({
        error: "Items array cannot be empty",
      });
    }

    console.log(`✅ Calculating totals for ${items.length} items`);

    // Pure calculation - no database needed!
    const totals = calculateTotals(items);

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
  } catch (error) {
    console.error("💥 Error calculating cart totals:", error);
    res.status(500).json({ error: "Failed to calculate cart totals" });
  }
};
