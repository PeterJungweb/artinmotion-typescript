import { supabase } from "../utils/supabase.js";
import { broadcastCartUpdate } from "../server.js";
import type { Request, Response } from "express";
import type {
  SupabaseResponse,
  CartItem,
  PaintingWithCartCount,
  RemoveCartParams,
} from "../types/cartTypes.js";

export const addToCart = async (req: Request, res: Response) => {
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

    const { data: existing }: SupabaseResponse<CartItem[]> = await query;

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: "Item already  in cart" });
    }

    //Add to cart_items table
    const { data: cartItem, error }: SupabaseResponse<CartItem> = await supabase
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
    const {
      data: updatedPainting,
      error: countError,
    }: SupabaseResponse<PaintingWithCartCount> = await supabase
      .from("paintings")
      .select("cart_count")
      .eq("id", painting_id)
      .single();

    if (countError) throw countError;

    // NUll safety check
    if (!updatedPainting) {
      throw new Error("Faild to get updated painting cart count");
    }

    // Real time Broadcast
    broadcastCartUpdate(painting_id, updatedPainting.cart_count);

    console.log("✅ Added to cart successfully, broadcasting to clients");

    res.json({
      success: true,
      cartItem,
      message: "Added to cart successfully",
    });
  } catch (error: unknown) {
    console.error("💥 Error adding to cart:", error);
    res.status(500).json({
      error: "Failed to add to cart",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const removeFromCart = async (
  req: Request<RemoveCartParams, {}, { user_id?: string; session_id?: string }>,
  res: Response
) => {
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
    const {
      data: updatedPainting,
      error: countError,
    }: SupabaseResponse<PaintingWithCartCount> = await supabase
      .from("paintings")
      .select("cart_count")
      .eq("id", painting_id)
      .single();

    if (countError) throw countError;

    // Null safety check
    if (!updatedPainting) {
      throw new Error("Failed to get updated painting cart count");
    }

    if (!painting_id) {
      return res.status(400).json({
        error: "Missing painting ID parameter",
      });
    }

    // Broadcast in real time
    broadcastCartUpdate(painting_id, updatedPainting.cart_count);

    console.log("✅ Removed from cart successfully, broadcasting to clients");

    res.json({
      success: true,
      message: "Removed from cart successfully",
    });
  } catch (error: unknown) {
    console.error("💥 Error removing from cart:", error);
    res.status(500).json({
      error: "Failed to remove from cart",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export { calculateCartTotals } from "./calculateCartTotals.js";
