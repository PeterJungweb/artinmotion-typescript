import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { cartApi } from "../services/api";
import { getSessionId, getUserId } from "../utils/session";
import type { ReactNode } from "react";
import type { CartItem, CartTotals, Painting } from "../types/cartTypes";
import { isAxiosError } from "axios";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // Calculate totals via Backend
  useEffect(() => {
    const calculateTotals = async () => {
      if (cartItems.length > 0) {
        try {
          setLoading(true);
          const totals = await cartApi.calculateTotals(cartItems);
          setCartTotals(totals);
        } catch (error: unknown) {
          console.error("Faild to calculate total: ", error);
          if (isAxiosError(error)) {
            console.error("❌ Server Response: ", error.response?.data);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Reset totals when cart is empty
        setCartTotals({ subtotal: 0, tax: 0, shipping: 0, total: 0 });
      }
    };

    calculateTotals();
  }, [cartItems]);

  // cart operations (ui state managment)

  const addToCart = async (item: Painting) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      const newItem: CartItem = {
        ...item,
        quantity: 1,
        image: item.image || "/images/placeholder-image.jpg",
      };
      setCartItems([...cartItems, newItem]);
    }

    // Add to Database(cart_count)
    try {
      const sessionId = getSessionId();
      const userId = getUserId();

      const result = await cartApi.addToCart(item.id, userId, sessionId);
      console.log("✅ API response:", result);
    } catch (error: unknown) {
      console.error("❌ Failed to add Cart to the database: ", error);

      if (isAxiosError(error)) {
        console.error("❌ Server Response: ", error.response?.data);
      }
    }
  };

  // Remove cartItems!!
  const removeFromCart = async (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));

    // Decrease "cart_count" in database
    try {
      const sessionId = getSessionId();
      const userId = getUserId();

      await cartApi.removeFromCart(itemId, userId, sessionId);
      console.log("✅ Removed from database cart");
    } catch (error: unknown) {
      console.error("❌ Failed to remove from database cart:", error);

      if (isAxiosError(error)) {
        console.error("❌ Server Response: ", error.response?.data);
      }
    }
  };

  // Uptade cart quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotals,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
