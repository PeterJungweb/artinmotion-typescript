import { supabase } from "../utils/supabase.js";

export class PaintingsService {
  static async getAll() {
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Record not found
      throw error;
    }
    return data;
  }

  static async getAvailable() {
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .eq("status", "available");

    if (error) throw error;
    return data;
  }
}
