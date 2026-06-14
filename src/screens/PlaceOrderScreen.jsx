import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!cart.shippingAddress?.address) navigate('/shipping');
        else if (!cart.paymentMethod) navigate('/payment');
    }, [cart.paymentMethod, cart.shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate('/complete');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="checkout-section">
            <div className="checkout-steps">
                <button className="enabled"><span>1</span> Prijava</button>
                <button className="enabled"><span>2</span> Dostava</button>
                <button className="enabled"><span>3</span> Placanje</button>
                <button className="enabled"><span>4</span> Pregled</button>
            </div>

            <div className="order-layout">
                <div className="order-details">
                    <section>
                        <h2>Podaci za dostavu</h2>
                        <p>{cart.shippingAddress?.address}, {cart.shippingAddress?.city} {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}</p>
                    </section>

                    <section>
                        <h2>Nacin placanja</h2>
                        <p>{cart.paymentMethod}</p>
                    </section>

                    <section>
                        <h2>Stavke porudzbine</h2>
                        <div className="review-items">
                            {cart.cartItems.map((item, index) => (
                                <article key={index}>
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>{item.qty} x {item.price} RSD = {(item.qty * item.price).toFixed(2)} RSD</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="order-summary-card">
                    <h2>Rezime</h2>
                    <div className="summary-row"><span>Stavke</span><span>{cart.itemsPrice} RSD</span></div>
                    <div className="summary-row"><span>Dostava</span><span>{cart.shippingPrice} RSD</span></div>
                    <div className="summary-row"><span>Porez</span><span>{cart.taxPrice} RSD</span></div>
                    <div className="summary-row"><span>Ukupno</span><span>{cart.totalPrice} RSD</span></div>

                    {error && <Message variant="danger">{error?.data?.message || error.error}</Message>}

                    <button
                        className="add-cart-button"
                        style={{ marginTop: '16px' }}
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                    >
                        Porucite sada
                    </button>
                    {isLoading && <Loader />}
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;