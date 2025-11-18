import { useContext } from "react";
import { CartContext } from "../contexts/CartContext.js";
import type { CartContextValue } from "../types/cartTypes.js";

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
