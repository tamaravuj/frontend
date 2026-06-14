import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="checkout-section">
            <div className="checkout-steps">
                <button className="enabled"><span>1</span> Prijava</button>
                <button className="enabled"><span>2</span> Dostava</button>
                <button disabled><span>3</span> Placanje</button>
                <button disabled><span>4</span> Pregled</button>
            </div>
            <div className="checkout-panel">
                <h1>Podaci o dostavi</h1>
                <form className="checkout-form" onSubmit={submitHandler}>
                    <label>
                        Adresa
                        <input
                            type="text"
                            placeholder="Unesite adresu"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        Grad
                        <input
                            type="text"
                            placeholder="Unesite grad"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </label>
                    <label>
                        Postanski broj
                        <input
                            type="text"
                            placeholder="Unesite postanski broj"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </label>
                    <label>
                        Drzava
                        <input
                            type="text"
                            placeholder="Unesite drzavu"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="auth-submit">
                        Nastavi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingScreen;