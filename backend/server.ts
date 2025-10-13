import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { WebSocket, WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import http from "http";
import type { Request, Response } from "express";
import authRoutes from "./src/routes/auth.js";

// Import routes
import paintingsRoutes from "./src/routes/paintings.js";
import cartRoutes from "./src/routes/cart.js";
// import { timeStamp } from "console"; // unused
//import ordersRoutes from './src/routes/orders.js';

dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT as string, 10) : 3000;

// Create HTTP server (for Websocket)
const server = http.createServer(app);

// WebSocket
const wss = new WebSocketServer({ server });

// Store Connected clients
const connectedClients = new Set<WebSocket>();

// WebSocket connection handling
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
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
  ws.on("error", (error: Error) => {
    console.error("🔌 WebSocket error:", error);
    connectedClients.delete(ws);
  });
});

// Broadcast function for cart updates
interface CartCountUpdateMessage {
  type: 'CART_COUNT_UPDATE';
  paintingId: string;
  cartCount: number;
  timeStamp: string;
}

export const broadcastCartUpdate = (paintingId: string, newCartCount: number) => {
 const payload: CartCountUpdateMessage = {
  type: 'CART_COUNT_UPDATE',
  paintingId,
  cartCount: newCartCount,
  timeStamp: new Date().toISOString(),
 }

 const message = JSON.stringify(payload);
  console.log(
    `📡 Broadcasting cart update: Painting ${paintingId} -> ${newCartCount} interested`
  );

  // Send to all connected Clients
  connectedClients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Failed to send message to client:", error);
        connectedClients.delete(client);
      }
    }
  });

  console.log(`📡 Message sent to ${connectedClients.size} connected clients`);
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
app.get("/health", (req: Request, res: Response) => {
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
