import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Lozinke se ne poklapaju');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Profil je azuriran');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="profile-section">
            <div className="profile-layout">
                <div className="profile-panel">
                    <h2>Profil korisnika</h2>
                    <form className="checkout-form" onSubmit={submitHandler}>
                        <label>
                            Ime
                            <input
                                type="text"
                                placeholder="Unesite ime"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Mejl adresa
                            <input
                                type="email"
                                placeholder="Unesite mejl adresu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Lozinka
                            <input
                                type="password"
                                placeholder="Unesite lozinku"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            Potvrdite lozinku
                            <input
                                type="password"
                                placeholder="Potvrdite lozinku"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit" className="auth-submit" disabled={loadingUpdateProfile}>
                            Azurirajte profil
                        </button>
                        {loadingUpdateProfile && <Loader />}
                    </form>
                </div>

                <div>
                    <h2>Moje porudzbine</h2>
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">{error?.data?.message || error.error}</Message>
                    ) : orders?.length === 0 ? (
                        <Message>Nemate porudzbina.</Message>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Datum</th>
                                    <th>Ukupna cena</th>
                                    <th>Placeno</th>
                                    <th>Dostavljeno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id.slice(-6)}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice} RSD</td>
                                        <td>
                                            {order.isPaid
                                                ? order.paidAt.substring(0, 10)
                                                : <FaTimes style={{ color: '#9a3b28' }} />}
                                        </td>
                                        <td>
                                            {order.isDelivered
                                                ? order.deliveredAt.substring(0, 10)
                                                : <FaTimes style={{ color: '#9a3b28' }} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;