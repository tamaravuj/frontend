import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) navigate(redirect);
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1>Prijavite se</h1>
                <form onSubmit={submitHandler}>
                    <label>
                        Email
                        <input
                            type="email"
                            placeholder="Upisite email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        Lozinka
                        <input
                            type="password"
                            placeholder="Upisite lozinku"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        Prijava
                    </button>
                    {isLoading && <Loader />}
                </form>
                <p className="auth-switch">
                    Nemate nalog?{' '}
                    <Link to={redirect ? `/registracija?redirect=${redirect}` : '/registracija'}>
                        Registrujte se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;