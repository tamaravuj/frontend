export const addDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const formatPrice = (price) => `${Number(price || 0).toFixed(2)} RSD`;

export const getOrderTotals = (cartItems) => {
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 2500 || itemsPrice === 0 ? 0 : 350;
  const taxPrice = Math.round(itemsPrice * 0.2);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
