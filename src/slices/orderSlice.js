import { getOrderTotals } from '../utils/cartUtils';

export const createOrder = ({ cartItems, checkout, currentUser }) => ({
  id: `FF-${Date.now().toString().slice(-6)}`,
  createdAt: new Date().toISOString(),
  userEmail: currentUser.email,
  userName: currentUser.name || currentUser.email,
  items: cartItems,
  shippingAddress: checkout.shippingAddress,
  paymentMethod: checkout.paymentMethod,
  totals: getOrderTotals(cartItems),
  status: 'U obradi',
});

export const updateOrderStatus = (orders, orderId, status) =>
  orders.map((order) => (order.id === orderId ? { ...order, status } : order));
