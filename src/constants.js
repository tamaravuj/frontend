export const BASE_URL = '';
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';

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

export const maxCartQuantity = 12;

export const emptyCheckout = {
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: '',
};