import { OrdersService } from "../services/orders.js";
import type { CreateOrderRequest } from "../types/ordersTypes.js";
import type { Request, Response } from "express";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    full_name: string;
    email_verified: boolean;
  };
};
