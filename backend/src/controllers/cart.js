import { supabase } from "../utils/supabase.js";
import { broadcastCartUpdate } from "../../server.js";

export const addToCart = async (req, res) => {
  try {
    const { painting_id, user_id, session_id } = req.body;

    console.log(`🛒 Adding painting ${painting_id} to cart`);

    //Check if item in cart!
    let query = supabase
      .from("cart_items")
      .select("*")
      .eq("painting_id", painting_id);

    if (user_id) {
      query = query.eq("user_id", user_id);
    } else {
      query = query.eq("session_id", session_id);
    }

    const { data: existing } = await query;

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: "Item already  in cart" });
    }

    //Add to cart_items table
    const { data: cartItem, error } = await supabase
      .from("cart_items")
      .insert({
        painting_id,
        user_id: user_id || null,
        session_id: session_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Get updated cart count and Broadcast
    const { data: updatedPainting } = await supabase
      .from("paintings")
      .select("cart_count")
      .eq("id", painting_id)
      .single();

    // Real time Broadcast
    broadcastCartUpdate(painting_id, updatedPainting.cart_count);

    console.log("✅ Added to cart successfully, broadcasting to clients");

    res.json({
      success: true,
      cartItem,
      message: "Added to cart successfully",
    });
  } catch (error) {
    console.error("💥 Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { painting_id } = req.params;
    const { user_id, session_id } = req.body;

    console.log(`🗑️ Removing painting ${painting_id} from cart`);

    let query = supabase
      .from("cart_items")
      .delete()
      .eq("painting_id", painting_id);

    if (user_id) {
      query = query.eq("user_id", user_id);
    } else {
      query = query.eq("session_id", session_id);
    }

    const { error } = await query;

    if (error) throw error;

    // Get Updated cart count and Broadcast
    const { data: updatedPainting } = await supabase
      .from("paintings")
      .select("cart_count")
      .eq("id", painting_id)
      .single();

    // Broadcast in real time
    broadcastCartUpdate(painting_id, updatedPainting.cart_count);

    console.log("✅ Removed from cart successfully, broadcasting to clients");

    res.json({
      success: true,
      message: "Removed from cart successfully",
    });
  } catch (error) {
    console.error("💥 Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

export { calculateCartTotals } from "./calculateCartTotals.js";
