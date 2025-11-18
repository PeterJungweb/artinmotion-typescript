import { createContext } from "react";
import type { CartContextValue } from "../types/cartTypes.js";

// Create and export the context with proper typing
export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);
