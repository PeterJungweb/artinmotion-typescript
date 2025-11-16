export const formatPrice = (price: number): string => {
  if (!price) {
    return "price is not defined";
  }
  if (price < 0) {
    return "price can not be 0";
  }

  return `€${price.toFixed(2)}`;
};
