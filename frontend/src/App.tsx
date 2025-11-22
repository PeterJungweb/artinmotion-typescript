import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js";
import { CartProvider } from "./contexts/CartProvider.js";
import LandingPage from "./Pages/LandingPage.jsx";
import MarketplacePage from "./Pages/MarketplacePage.jsx";
import CartPage from "./Pages/CartPage.jsx";

import "./App.css";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
