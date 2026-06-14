export const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const formatPrice = (price) => `${Number(price || 0).toFixed(2)} RSD`;

export const updateCart = (state) => {
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    state.itemsPrice = addDecimal(itemsPrice);

    const shippingPrice = itemsPrice > 2500 ? 0 : 350;
    state.shippingPrice = addDecimal(shippingPrice);

    const taxPrice = 0.2 * itemsPrice;
    state.taxPrice = addDecimal(taxPrice);

    state.totalPrice = addDecimal(itemsPrice + shippingPrice + taxPrice);

    localStorage.setItem('cart', JSON.stringify(state));

    return state;
};