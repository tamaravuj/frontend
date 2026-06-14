import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useEffect } from 'react';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutApiCall] = useLogoutMutation();

    const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location]);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/prijava');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const goToSection = (e, sectionId) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/' + sectionId);
        }
    };

    return (
        <header>
            <nav className="topbar">
                <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    FreshFit sokovi
                </a>

                <div className="nav-links">
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Pocetna</a>
                    <a href="/#katalog" onClick={(e) => goToSection(e, '#katalog')}>Proizvodi</a>
                    <a href="/#paketi" onClick={(e) => goToSection(e, '#paketi')}>Paketi</a>
                    <a href="/korpa" onClick={(e) => { e.preventDefault(); navigate('/korpa'); }}>
                        Korpa ({cartCount})
                    </a>
                    {!userInfo && (
                        <a href="/prijava" onClick={(e) => { e.preventDefault(); navigate('/prijava'); }}>
                            Prijava
                        </a>
                    )}
                    {userInfo?.isAdmin && (
                        <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
                            Admin
                        </a>
                    )}
                    {userInfo && (
                        <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
                            {userInfo.name}
                        </a>
                    )}
                    {userInfo && (
                        <button onClick={logoutHandler}>Odjava</button>
                    )}
                </div>

                <div className="account-actions">
                    <a className="contact-link" href="tel:+381601234567">060 123 4567</a>
                </div>
            </nav>
        </header>
    );
};

export default Header;