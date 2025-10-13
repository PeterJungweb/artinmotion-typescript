import { useState, useEffect } from "react";

export const useRealtimeCartUpdates = (paintnings, setPaintings) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    console.log("🔌 Initializing WebSocket connection...");

    const wsURL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
    const ws = new WebSocket(wsURL);

    ws.onopen = () => {
      console.log("🔌 Connected to real-time updates");
      setIsConnected(true);
      setConnectionError(null);
    };

    ws.onmessage = () => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Real-time message received:", data);

        if (data.type === "CART_COUNT_UPDATE") {
          console.log(
            `🔄 Updating cart count: Painting ${data.paintingId} -> ${data.cartCount} interested`
          );

          // Update paintings state with new cart
          setPaintings((currentPaintings) =>
            currentPaintings.map((painting) =>
              painting.id === data.paintingId
                ? { ...painting, cart_count: data.cartCount }
                : painting
            )
          );
        }

        if (data.type === "CONNECTION_ESTABLISHED") {
          console.log("✅ WebSocket connection established:", data.message);
        }
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket connection closed");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("🔌 WebSocket error:", error);
      setConnectionError("WebSocket connection failed");
      setIsConnected(false);
    };

    // Cleanup function
    return () => {
      console.log("🔌 Closing WebSocket connection");
      ws.close();
    };
  }, [setPaintings]);

  return { isConnected, connectionError };
};
