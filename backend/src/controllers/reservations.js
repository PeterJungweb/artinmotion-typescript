import { ReservationsService } from "../services/reservations.js";

export const createReservation = async (req, res) => {
  try {
    const { paintingId } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!paintingId) {
      return res.status(400).json({ error: "Painting ID is required" });
    }

    const reservation = await ReservationsService.create(paintingId, userId);
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);

    if (error.message === "Painting is not available for reservation") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to create reservation" });
  }
};

export const getActiveReservations = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const reservations = await ReservationsService.getActiveByUser(userId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

export const getReservationRemainingTime = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware

    const remainingTime = await ReservationsService.getRemainingTime(
      id,
      userId
    );
    res.status(200).json(remainingTime);
  } catch (error) {
    console.error("Error fetching remaining time:", error);
    res.status(500).json({ error: "Failed to fetch remaining time" });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware

    await ReservationsService.cancel(id, userId);
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
};
