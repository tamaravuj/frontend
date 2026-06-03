export const addToCart = (cartItems, item, type = 'product', maxQuantity = 12) => {
  const cartId = `${type}-${item.id}`;
  const existItem = cartItems.find((x) => x.cartId === cartId);

  if (existItem) {
    return cartItems.map((x) =>
      x.cartId === existItem.cartId ? { ...x, quantity: Math.min(x.quantity + 1, maxQuantity) } : x
    );
  }

  return [
    ...cartItems,
    {
      cartId,
      id: item.id,
      type,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      quantity: 1,
    },
  ];
};

export const updateCartQuantity = (cartItems, cartId, quantity, maxQuantity = 12) => {
  const nextQuantity = Math.max(1, Math.min(maxQuantity, quantity));

  return cartItems.map((item) => (item.cartId === cartId ? { ...item, quantity: nextQuantity } : item));
};

export const removeFromCart = (cartItems, cartId) => cartItems.filter((item) => item.cartId !== cartId);

export const clearCartItems = () => [];

export const getCartCount = (cartItems) => cartItems.reduce((total, item) => total + item.quantity, 0);
