import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart, updateCartQty } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const updateQtyHandler = (item, qty) => {
        dispatch(updateCartQty({ cartId: item.cartId, qty: Number(qty) }));
    };

    const removeFromCartHandler = (cartId) => {
        dispatch(removeFromCart(cartId));
    };

    const checkoutHandler = () => {
        navigate('/prijava?redirect=/shipping');
    };

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <div className="cart-section">
            <h1>Korpa</h1>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    Korpa je prazna. <Link to="/">Vrati se nazad</Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.cartId}>
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">{Number(item.price).toFixed(2)} RSD</p>
                                </div>
                                <select
                                    className="cart-qty"
                                    value={item.qty}
                                    onChange={(e) => updateQtyHandler(item, e.target.value)}
                                >
                                    {[...Array(12).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>
                                <button
                                    className="cart-remove"
                                    onClick={() => removeFromCartHandler(item.cartId)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Pregled korpe</h2>
                        <div className="cart-summary-row">
                            <span>Broj artikala</span>
                            <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                        </div>
                        <div className="cart-summary-total">
                            <span>Ukupno</span>
                            <span>{total.toFixed(2)} RSD</span>
                        </div>
                        <button
                            className="add-cart-button"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Nastavi kupovinu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;