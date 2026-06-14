import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const cartId = `${item.type || 'product'}-${item._id}`;
            const existItem = state.cartItems.find((x) => x.cartId === cartId);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.cartId === cartId
                        ? { ...x, qty: Math.min(x.qty + 1, 12) }
                        : x
                );
            } else {
                state.cartItems = [...state.cartItems, { ...item, cartId, qty: 1 }];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.cartId !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            return updateCart(state);
        },
        updateCartQty: (state, action) => {
            const { cartId, qty } = action.payload;
            state.cartItems = state.cartItems.map((x) =>
                x.cartId === cartId ? { ...x, qty: Math.max(1, Math.min(12, qty)) } : x
            );
            return updateCart(state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
    updateCartQty,
} = cartSlice.actions;

export default cartSlice.reducer;