import express from "express";
import {
  calculateCartTotals,
  addToCart,
  removeFromCart,
} from "../controllers/cart.js";

const router = express.Router();

// POST /api/cart/calculate
router.post("/calculate", calculateCartTotals);

// POST /api/cart/add
router.post("/add", addToCart);

// DELETE /api/cart/remove/:painting_id
router.delete("/remove/:painting_id", removeFromCart);

export default router;
