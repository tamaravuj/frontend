import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { shippingAddress } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!shippingAddress?.address) navigate('/shipping');
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="checkout-section">
            <div className="checkout-steps">
                <button className="enabled"><span>1</span> Prijava</button>
                <button className="enabled"><span>2</span> Dostava</button>
                <button className="enabled"><span>3</span> Placanje</button>
                <button disabled><span>4</span> Pregled</button>
            </div>
            <div className="checkout-panel">
                <h1>Nacin placanja</h1>
                <form className="checkout-form" onSubmit={submitHandler}>
                    <fieldset>
                        <legend>Odaberite nacin placanja</legend>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="PayPal"
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            PayPal ili Kreditna kartica
                        </label>
                    </fieldset>
                    <button type="submit" className="auth-submit">
                        Nastavite
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;