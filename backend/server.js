import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import authRoutes from "./src/routes/auth.js";

// Import routes
import paintingsRoutes from "./src/routes/paintings.js";
import cartRoutes from "./src/routes/cart.js";
import { timeStamp } from "console";
//import ordersRoutes from './src/routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server (for Websocket)
const server = http.createServer(app);

// WebSocket
const wss = new WebSocketServer({ server });

// Store Connected clients
const connectedClients = new Set();

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log("🔌 New client connected to real-time updates");
  connectedClients.add(ws);

  // Send WCmsg
  ws.send(
    JSON.stringify({
      type: "CONNECTION_ESTABLISHED",
      message: "Connected to Art in Motion real-time updates",
      timeStamp: new Date().toISOString(),
    })
  );

  // Client DC
  ws.on("close", () => {
    console.log("🔌 Client disconnected");
    connectedClients.delete(ws);
  });

  // Client Erros
  ws.on("error", (error) => {
    console.error("🔌 WebSocket error:", error);
    connectedClients.delete(ws);
  });
});

// Broadcast function for cart updates
export const broadcastCartUpdate = (paintingId, newCartCount) => {
  const message = JSON.stringify({
    type: "CART_COUNT_UPDATE",
    paintingId,
    cartCount: newCartCount,
    timeStamp: new Date().toISOString(),
  });

  console.log(
    "📡 Broadcasting cart update: Painting ${paintingId} -> ${newCartCount} interested"
  );

  // Send to all connected Clients
  connectedClients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Failed to send message to client:", error);
        connectedClients.delete(client);
      }
    }
  });

  console.log("📡 Message sent to ${connectedClients.size} connected clients");
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes - This connects your frontend API calls to backend logic!
app.use("/api/paintings", paintingsRoutes); // Handles paintingsApi calls
app.use("/api/cart", cartRoutes); // Handles cartApi calls
//app.use("/api/orders", ordersRoutes); // Handles orderApi calls
app.use("/api/auth", authRoutes);

// Health check with WS info
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
    websocketActive: true,
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Art in Motion Backend running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🎨 Paintings: http://localhost:${PORT}/api/paintings`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart/calculate`);
});
