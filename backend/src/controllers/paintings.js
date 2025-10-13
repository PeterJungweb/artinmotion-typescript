import { supabase } from "../utils/supabase.js";

export const getAllPaintings = async (req, res) => {
  try {
    console.log("🎨 Fetching paintings from Supabase...");

    const { data: paintings, error } = await supabase
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
  } catch (error) {
    console.log();
    res.status(500).json({
      error: "Failed to fetch Paintings",
      data: error.message,
    });
  }
};

export const getPaintingById = async (req, res) => {
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
  } catch (error) {
    console.log();
    res.status(500).json({
      error: "Failed to fetch painting",
      details: error.message,
    });
  }
};
