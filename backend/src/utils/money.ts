import type {
  CartItemCal,
  CartTotals,
} from "../controllers/calculateCartTotals.js";

// Raw calculation helpers (returns pure numbers)
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal, rate = 0.2) => {
  return subtotal * rate; // Austrian VAT 20%
};

export const calculateShipping = (
  subtotal,
  freeThreshold = 100,
  standardRate = 15
) => {
  return subtotal >= freeThreshold ? 0 : standardRate;
};

export const roundToTwoDecimals = (amount) => {
  return Math.round(amount * 100) / 100;
};

// Complete cart calculation (returns object with raw numbers)
export const calculateCartTotals = (items: CartItem[]): CartTotals => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: roundToTwoDecimals(subtotal),
    tax: roundToTwoDecimals(tax),
    shipping: roundToTwoDecimals(shipping),
    total: roundToTwoDecimals(total),
    itemCount,
  };
};

// Formatting helpers (returns formatted strings)
export const formatPrice = (price) => {
  return `€${price.toFixed(2)}`;
};

export const formatCartTotals = (totals) => {
  return {
    subtotal: formatPrice(totals.subtotal),
    tax: formatPrice(totals.tax),
    shipping: formatPrice(totals.shipping),
    total: formatPrice(totals.total),
    itemCount: totals.itemCount,
  };
};
