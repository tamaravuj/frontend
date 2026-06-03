export const BASE_URL = '';

export const authRoutes = {
  login: '/prijava',
  register: '/registracija',
};

export const cartRoute = '/korpa';
export const shippingRoute = '/shipping';
export const paymentRoute = '/payment';
export const reviewRoute = '/placeorder';
export const completeRoute = '/complete';
export const profileRoute = '/profile';
export const adminRoute = '/admin';

export const protectedRoutes = [
  cartRoute,
  shippingRoute,
  paymentRoute,
  reviewRoute,
  completeRoute,
  profileRoute,
  adminRoute,
];

export const usersStorageKey = 'freshfit-users';
export const sessionStorageKey = 'freshfit-session';
export const productsStorageKey = 'freshfit-products';
export const ordersStorageKey = 'freshfit-orders';
export const reviewsStorageKey = 'freshfit-reviews';
export const cartStoragePrefix = 'freshfit-cart';
export const checkoutStoragePrefix = 'freshfit-checkout';

export const maxCartQuantity = 12;

export const defaultAdmin = {
  email: 'admin@freshfit.rs',
  name: 'Administrator',
  password: 'admin123',
  role: 'admin',
};

export const emptyCheckout = {
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: '',
};

export const getCartStorageKey = (email) => `${cartStoragePrefix}:${email}`;
export const getCheckoutStorageKey = (email) => `${checkoutStoragePrefix}:${email}`;
