import { useEffect, useMemo, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import PackageSection from './components/PackageSection';
import ProductSection from './components/ProductSection';
import Stats from './components/Stats';
import { categories, packages, products } from './data/shopData';
import './App.css';

const authRoutes = {
  login: '/prijava',
  register: '/registracija',
};

const cartRoute = '/korpa';
const usersStorageKey = 'freshfit-users';
const sessionStorageKey = 'freshfit-session';
const cartStoragePrefix = 'freshfit-cart';
const maxCartQuantity = 12;

const readStoredJson = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const getCartStorageKey = (email) => `${cartStoragePrefix}:${email}`;

function App() {
  const [selectedCategory, setSelectedCategory] = useState('sve');
  const [page, setPage] = useState(() => window.location.pathname);
  const [currentUser, setCurrentUser] = useState(() => readStoredJson(sessionStorageKey, null));
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser?.email) {
      setCartItems([]);
      return;
    }

    setCartItems(readStoredJson(getCartStorageKey(currentUser.email), []));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email) {
      return;
    }

    window.localStorage.setItem(getCartStorageKey(currentUser.email), JSON.stringify(cartItems));
  }, [cartItems, currentUser]);

  useEffect(() => {
    const handlePopState = () => setPage(window.location.pathname);

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setPage(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user) => {
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(user));
    setCurrentUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    window.localStorage.removeItem(sessionStorageKey);
    setCurrentUser(null);
    setCartItems([]);
    navigate('/');
  };

  const requireLogin = () => {
    navigate(authRoutes.login);
  };

  const addToCart = (item, type = 'product') => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems((items) => {
      const cartId = `${type}-${item.id}`;
      const existing = items.find((cartItem) => cartItem.cartId === cartId);

      if (existing) {
        return items.map((cartItem) =>
          cartItem.cartId === cartId
            ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, maxCartQuantity) }
            : cartItem
        );
      }

      return [
        ...items,
        {
          cartId,
          id: item.id,
          type,
          name: item.name,
          price: item.price,
          description: item.description,
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    const nextQuantity = Math.max(1, Math.min(maxCartQuantity, quantity));
    setCartItems((items) =>
      items.map((item) => (item.cartId === cartId ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const removeFromCart = (cartId) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems((items) => items.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems([]);
  };

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'sve') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const isAuthPage = page === authRoutes.login || page === authRoutes.register;
  const isCartPage = page === cartRoute;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="app">
      <Header
        cartCount={cartCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={navigate}
      />
      {isAuthPage ? (
        <AuthPage currentUser={currentUser} onLogin={handleLogin} page={page} onNavigate={navigate} />
      ) : isCartPage ? (
        currentUser ? (
          <CartPage
            cartItems={cartItems}
            maxQuantity={maxCartQuantity}
            onClearCart={clearCart}
            onNavigate={navigate}
            onRemove={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
          />
        ) : (
          <AuthRequired onNavigate={navigate} />
        )
      ) : (
        <>
          <Hero />
          <Stats productTotal={products.length} packageTotal={packages.length} />
          <ProductSection
            categories={categories}
            products={visibleProducts}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={(product) => addToCart(product, 'product')}
          />
          <PackageSection onAddToCart={(item) => addToCart(item, 'package')} packages={packages} />
        </>
      )}
      <Footer />
    </main>
  );
}

function AuthPage({ currentUser, onLogin, page, onNavigate }) {
  const isRegister = page === authRoutes.register;
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const users = readStoredJson(usersStorageKey, []);

    if (isRegister) {
      const name = formData.get('name').trim();
      const confirmPassword = formData.get('confirmPassword');

      if (password !== confirmPassword) {
        setMessage('Lozinke se ne poklapaju.');
        return;
      }

      if (users.some((user) => user.email === email)) {
        setMessage('Nalog sa ovim emailom vec postoji.');
        return;
      }

      const user = { email, name, password };
      window.localStorage.setItem(usersStorageKey, JSON.stringify([...users, user]));
      onLogin({ email, name });
      return;
    }

    const user = users.find((storedUser) => storedUser.email === email && storedUser.password === password);

    if (!user) {
      setMessage('Email ili lozinka nisu tacni.');
      return;
    }

    onLogin({ email: user.email, name: user.name });
  };

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">{isRegister ? 'Novi nalog' : 'Dobrodosli nazad'}</p>
        <h1 id="auth-title">{isRegister ? 'Registracija' : 'Prijava'}</h1>

        {isRegister && (
          <label>
            Ime i prezime
            <input type="text" name="name" autoComplete="name" placeholder="Unesi ime i prezime" required />
          </label>
        )}

        <label>
          Email
          <input type="email" name="email" autoComplete="email" placeholder="primer@email.com" required />
        </label>

        <label>
          Lozinka
          <input
            type="password"
            name="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="Unesi lozinku"
            required
          />
        </label>

        {isRegister && (
          <label>
            Potvrdi lozinku
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Ponovi lozinku"
              required
            />
          </label>
        )}

        {message && <p className="form-message">{message}</p>}

        {currentUser && (
          <p className="form-message success">Vec si prijavljen kao {currentUser.name || currentUser.email}.</p>
        )}

        <button className="auth-submit" type="submit">
          {isRegister ? 'Registruj se' : 'Prijavi se'}
        </button>

        <p className="auth-switch">
          {isRegister ? 'Vec imas nalog?' : 'Nemas nalog?'}{' '}
          <button
            type="button"
            onClick={() => onNavigate(isRegister ? authRoutes.login : authRoutes.register)}
          >
            {isRegister ? 'Nazad na prijavu' : 'Registruj se'}
          </button>
        </p>
      </form>
    </section>
  );
}

function AuthRequired({ onNavigate }) {
  return (
    <section className="auth-page" aria-labelledby="cart-auth-title">
      <div className="auth-form auth-panel">
        <p className="eyebrow">Korpa</p>
        <h1 id="cart-auth-title">Prijava je obavezna</h1>
        <p className="auth-note">Samo prijavljeni korisnici mogu da vide korpu i dodaju proizvode.</p>
        <button className="auth-submit" type="button" onClick={() => onNavigate(authRoutes.login)}>
          Prijavi se
        </button>
      </div>
    </section>
  );
}

function CartPage({ cartItems, maxQuantity, onClearCart, onNavigate, onRemove, onUpdateQuantity }) {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <section className="section cart-section" aria-labelledby="cart-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Korpa</p>
          <h2 id="cart-title">Tvoja porudzbina</h2>
        </div>

        <button className="secondary-action" type="button" onClick={() => onNavigate('/')}>
          Nastavi kupovinu
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Korpa je prazna</h3>
          <p>Izaberi sokove ili pakete iz kataloga i dodaj ih u korpu.</p>
          <button className="auth-submit" type="button" onClick={() => onNavigate('/')}>
            Pogledaj proizvode
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.cartId}>
                <div>
                  <p className="cart-item-type">{item.type === 'package' ? 'Paket' : 'Proizvod'}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="quantity-control" aria-label={`Kolicina za ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                    disabled={item.quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>

                <strong>{item.price * item.quantity} RSD</strong>
                <button className="remove-button" type="button" onClick={() => onRemove(item.cartId)}>
                  Ukloni
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Pregled</h3>
            <div className="summary-row">
              <span>Ukupno</span>
              <strong>{subtotal} RSD</strong>
            </div>
            <p>Porudzbina je vezana za prijavljen nalog i ostaje sacuvana za sledecu posetu.</p>
            <button className="auth-submit" type="button">
              Posalji porudzbinu
            </button>
            <button className="secondary-action" type="button" onClick={onClearCart}>
              Isprazni korpu
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default App;
