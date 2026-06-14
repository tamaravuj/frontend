import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) navigate(redirect);
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Lozinke se ne poklapaju');
            return;
        }
        try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1>Registrujte se</h1>
                <form onSubmit={submitHandler}>
                    <label>
                        Ime
                        <input
                            type="text"
                            placeholder="Upisite ime"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
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
                    <label>
                        Potvrdite lozinku
                        <input
                            type="password"
                            placeholder="Potvrdite lozinku"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        Registruj se
                    </button>
                    {isLoading && <Loader />}
                </form>
                <p className="auth-switch">
                    Imate nalog?{' '}
                    <Link to={redirect ? `/prijava?redirect=${redirect}` : '/prijava'}>
                        Prijavite se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;