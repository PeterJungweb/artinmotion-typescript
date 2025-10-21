import type {Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

interface PaintingInterface {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  medium: string;
  dimensions_width: number;
  dimensions_height: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  cart_count: number;
  availability_status: string;
  created_at: string;
}

interface SupabaseResponse{
  data: PaintingInterface[] | null;
  error: any
}

export const getAllPaintings = async (req: Request, res: Response) => {
  try {
    console.log("🎨 Fetching paintings from Supabase...");

    const { data: paintings, error }: SupabaseResponse = await supabase
      .from("paintings")
      .select(
        `
        id,
        title,
        description,
        price,
        category,
        medium,
        dimensions_width,
        dimensions_height,
        image_url,
        is_available,
        is_featured,
        cart_count,
        availability_status,
        created_at
        `
      )
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log(`✅ Found ${paintings?.length || 0} paintings`);
    console.log("Paintings:", paintings);

    res.json({
      paintings: paintings || [],
      total: paintings?.length || 0,
    });
  } catch (error: unknown) {
    console.log();
    res.status(500).json({
      error: "Failed to fetch Paintings",
      data: error instanceof Error ? error.message: String(error)
    });
  }
};

export const getPaintingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching painting with ID: ${id}`);

    const { data: painting, error } = await supabase
      .from("paintings")
      .select("*")
      .eq("id", id)
      .eq("is_available", true)
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(404).json({ error: "Painting not found" });
    }

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log(`✅ Found painting: ${painting.title}`);
    res.json(painting);
  } catch (error: unknown) {
    console.log();
    res.status(500).json({
      error: "Failed to fetch painting",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
