import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { cartApi } from "../services/api";
import { getSessionId, getUserId } from "../utils/session";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState({
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
        } catch (error) {
          console.log("Faild to calculate total:", error);
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

  const addToCart = async (item) => {
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
      const newItem = {
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
    } catch (error) {
      console.error("❌ Failed to add to database cart:", error);
      console.error("❌ Error details:", error.response?.data);
    }
  };

  // Remove cartItems!!
  const removeFromCart = async (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));

    // Decrease "cart_count" in database
    try {
      const sessionId = getSessionId();
      const userId = getUserId();

      await cartApi.removeFromCart(itemId, userId, sessionId);
      console.log("✅ Removed from database cart");
    } catch (error) {
      console.error("❌ Failed to remove from database cart:", error);
    }
  };

  // Uptade cart quantity
  const updateQuantity = (itemId, quantity) => {
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
