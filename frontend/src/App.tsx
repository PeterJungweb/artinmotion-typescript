import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js";
import { CartProvider } from "./contexts/CartProvider.js";
import LandingPage from "./Pages/LandingPage.js";
import MarketplacePage from "./Pages/MarketplacePage.js";
import { CartPage } from "./Pages/CartPage.js";
import { CheckoutPage } from "./Pages/CheckoutPage.js";
import { OrderSuccessPage } from "./Pages/OrderSuccessPage.js";

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
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
