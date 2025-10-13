import express from "express";
import {
  createReservation,
  getActiveReservations,
  getReservationRemainingTime,
  cancelReservation,
} from "../controllers/reservations.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/active", getActiveReservations);
router.get("/:id/remaining-time", getReservationRemainingTime);
router.delete("/:id", cancelReservation);

export const reservationsRoutes = router;
