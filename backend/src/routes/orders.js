import express from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orders.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export const ordersRoutes = router;
