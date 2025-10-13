import { supabase } from "../utils/supabase.js";

export class ReservationsService {
  static async create(paintingId, userId) {
    // Check if painting is available
    const { data: painting, error: paintingError } = await supabase
      .from("paintings")
      .select("status")
      .eq("id", paintingId)
      .single();

    if (paintingError) throw paintingError;
    if (painting.status !== "available") {
      throw new Error("Painting is not available for reservation");
    }

    // Create reservation
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          painting_id: paintingId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActiveByUser(userId) {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        *,
        painting:paintings(*)
      `
      )
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    return data;
  }

  static async getRemainingTime(reservationId, userId) {
    const { data, error } = await supabase
      .from("reservations")
      .select("expires_at, user_id")
      .eq("id", reservationId)
      .single();

    if (error) throw error;

    // Ensure user owns this reservation
    if (data.user_id !== userId) {
      throw new Error("Not authorized to access this reservation");
    }

    const expiryTime = new Date(data.expires_at);
    const now = new Date();
    const remainingMs = expiryTime - now;

    if (remainingMs <= 0) return { minutes: 0, seconds: 0, expired: true };

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    return { minutes, seconds, expired: false };
  }

  static async cancel(reservationId, userId) {
    // First check if user owns the reservation
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("id, painting_id, user_id")
      .eq("id", reservationId)
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;
    if (!reservation) {
      throw new Error("Reservation not found or not owned by user");
    }

    // Update reservation status
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "expired" })
      .eq("id", reservationId);

    if (updateError) throw updateError;

    // Update painting status
    const { error: paintingError } = await supabase
      .from("paintings")
      .update({ status: "available" })
      .eq("id", reservation.painting_id);

    if (paintingError) throw paintingError;
  }
}
