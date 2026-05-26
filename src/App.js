import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import PackageSection from './components/PackageSection';
import ProductSection from './components/ProductSection';
import Stats from './components/Stats';
import { categories, packages, products as initialProducts } from './data/shopData';
import './App.css';

const authRoutes = {
  login: '/prijava',
  register: '/registracija',
};

const cartRoute = '/korpa';
const shippingRoute = '/shipping';
const paymentRoute = '/payment';
const reviewRoute = '/placeorder';
const completeRoute = '/complete';
const profileRoute = '/profile';
const adminRoute = '/admin';
const usersStorageKey = 'freshfit-users';
const sessionStorageKey = 'freshfit-session';
const productsStorageKey = 'freshfit-products';
const ordersStorageKey = 'freshfit-orders';
const reviewsStorageKey = 'freshfit-reviews';
const cartStoragePrefix = 'freshfit-cart';
const checkoutStoragePrefix = 'freshfit-checkout';
const maxCartQuantity = 12;
const defaultAdmin = {
  email: 'admin@freshfit.rs',
  name: 'Administrator',
  password: 'admin123',
  role: 'admin',
};

// Citanje iz localStorage je izdvojeno da aplikacija ne pukne ako podaci nisu ispravni.
const readStoredJson = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const useStoredState = (key, fallback) => {
  const [value, setValue] = useState(() => readStoredJson(key, fallback));

  // Svaka promena stanja se odmah cuva, pa podaci ostaju i posle osvezavanja stranice.
  useEffect(() => {
    writeStoredJson(key, value);
  }, [key, value]);

  return [value, setValue];
};

const getCartStorageKey = (email) => `${cartStoragePrefix}:${email}`;
const getCheckoutStorageKey = (email) => `${checkoutStoragePrefix}:${email}`;

const emptyCheckout = {
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: '',
};

const formatPrice = (price) => `${Number(price || 0).toFixed(2)} RSD`;

const getStoredUsers = () => {
  const users = readStoredJson(usersStorageKey, []);
  const hasAdmin = users.some((user) => user.email === defaultAdmin.email);
  const nextUsers = hasAdmin ? users : [...users, defaultAdmin];

  if (!hasAdmin) {
    writeStoredJson(usersStorageKey, nextUsers);
  }

  return nextUsers;
};

const createOrderId = () => `FF-${Date.now().toString().slice(-6)}`;

function App() {
  const [selectedCategory, setSelectedCategory] = useState('sve');
  const [page, setPage] = useState(() => window.location.pathname);
  const [currentUser, setCurrentUser] = useStoredState(sessionStorageKey, null);
  const [products, setProducts] = useStoredState(productsStorageKey, initialProducts);
  const [orders, setOrders] = useStoredState(ordersStorageKey, []);
  const [reviews, setReviews] = useStoredState(reviewsStorageKey, []);
  const [cartItems, setCartItems] = useState([]);
  const [checkout, setCheckout] = useState(emptyCheckout);

  // Korpa i podaci za kupovinu se ucitavaju za trenutno prijavljenog korisnika.
  useEffect(() => {
    if (!currentUser?.email) {
      setCartItems([]);
      setCheckout(emptyCheckout);
      return;
    }

    setCartItems(readStoredJson(getCartStorageKey(currentUser.email), []));
    setCheckout(readStoredJson(getCheckoutStorageKey(currentUser.email), emptyCheckout));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email) {
      return;
    }

    writeStoredJson(getCartStorageKey(currentUser.email), cartItems);
  }, [cartItems, currentUser]);

  useEffect(() => {
    if (!currentUser?.email) {
      return;
    }

    writeStoredJson(getCheckoutStorageKey(currentUser.email), checkout);
  }, [checkout, currentUser]);

  // Aplikacija koristi svoju jednostavnu navigaciju preko adrese u browseru.
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
    setCurrentUser(user);
    navigate('/');
  };

  const handleLogout = () => {
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
      // Isti proizvod se ne duplira u korpi, vec mu se samo poveca kolicina.
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
          image: item.image,
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

  const saveShippingAddress = (shippingAddress) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCheckout((current) => ({ ...current, shippingAddress }));
    navigate(paymentRoute);
  };

  const savePaymentMethod = (paymentMethod) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCheckout((current) => ({ ...current, paymentMethod }));
    navigate(reviewRoute);
  };

  const completeOrder = () => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    // Porudzbina cuva sve bitne podatke u trenutku kupovine.
    const order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      userEmail: currentUser.email,
      userName: currentUser.name || currentUser.email,
      items: cartItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totals: getOrderTotals(cartItems),
      status: 'U obradi',
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCartItems([]);
    navigate(completeRoute);
  };

  const updateProfile = ({ name, password }) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    const users = getStoredUsers();
    const updatedUser = { ...currentUser, name };
    const updatedUsers = users.map((user) =>
      user.email === currentUser.email
        ? { ...user, name, password: password || user.password }
        : user
    );

    writeStoredJson(usersStorageKey, updatedUsers);
    setCurrentUser(updatedUser);
  };

  const saveReview = ({ productId, rating, comment }) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    const product = products.find((item) => item.id === Number(productId));

    if (!product) {
      return;
    }

    const review = {
      id: Date.now(),
      productId: Number(productId),
      productName: product.name,
      userEmail: currentUser.email,
      userName: currentUser.name || currentUser.email,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((currentReviews) => [review, ...currentReviews]);
  };

  const saveProduct = (product) => {
    setProducts((currentProducts) => {
      if (product.id) {
        return currentProducts.map((item) =>
          item.id === product.id ? { ...item, ...product, price: Number(product.price) } : item
        );
      }

      const nextId = Math.max(0, ...currentProducts.map((item) => item.id)) + 1;

      return [
        ...currentProducts,
        {
          ...product,
          id: nextId,
          price: Number(product.price),
          rating: Number(product.rating || 4.5),
          image: product.image || '/images/pocetnasokovi.jpeg',
        },
      ];
    });
  };

  const deleteProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const visibleProducts =
    selectedCategory === 'sve'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const isAuthPage = page === authRoutes.login || page === authRoutes.register;
  const isCartPage = page === cartRoute;
  const isShippingPage = page === shippingRoute;
  const isPaymentPage = page === paymentRoute;
  const isReviewPage = page === reviewRoute;
  const isCompletePage = page === completeRoute;
  const isProfilePage = page === profileRoute;
  const isAdminPage = page === adminRoute;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const currentUserOrders = orders.filter((order) => order.userEmail === currentUser?.email);
  const protectedPage =
    isCartPage ||
    isShippingPage ||
    isPaymentPage ||
    isReviewPage ||
    isCompletePage ||
    isProfilePage ||
    isAdminPage;

  const renderPage = () => {
    if (isAuthPage) {
      return <AuthPage currentUser={currentUser} onLogin={handleLogin} page={page} onNavigate={navigate} />;
    }

    if (!currentUser && protectedPage) {
      return <AuthRequired onNavigate={navigate} />;
    }

    if (isCartPage) {
      return (
        <CartPage
          cartItems={cartItems}
          maxQuantity={maxCartQuantity}
          onClearCart={clearCart}
          onNavigate={navigate}
          onRemove={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
        />
      );
    }

    if (isShippingPage) {
      return <ShippingPage checkout={checkout} onNavigate={navigate} onSaveShipping={saveShippingAddress} />;
    }

    if (isPaymentPage) {
      return <PaymentPage checkout={checkout} onNavigate={navigate} onSavePayment={savePaymentMethod} />;
    }

    if (isReviewPage) {
      return (
        <ReviewOrderPage
          cartItems={cartItems}
          checkout={checkout}
          onCompleteOrder={completeOrder}
          onNavigate={navigate}
        />
      );
    }

    if (isCompletePage) {
      return <CompleteOrderPage onNavigate={navigate} />;
    }

    if (isProfilePage) {
      return (
        <ProfilePage
          currentUser={currentUser}
          orders={currentUserOrders}
          products={products}
          reviews={reviews}
          onLogout={handleLogout}
          onSaveReview={saveReview}
          onUpdateProfile={updateProfile}
        />
      );
    }

    if (isAdminPage) {
      return currentUser?.role === 'admin' ? (
        <AdminPage
          orders={orders}
          products={products}
          users={getStoredUsers()}
          onDeleteProduct={deleteProduct}
          onSaveProduct={saveProduct}
          onUpdateOrderStatus={updateOrderStatus}
        />
      ) : (
        <AuthRequired onNavigate={navigate} />
      );
    }

    return (
        <>
          <Hero />
          <Stats productTotal={products.length} packageTotal={packages.length} />
          <ProductSection
            categories={categories}
            products={visibleProducts}
            reviews={reviews}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={(product) => addToCart(product, 'product')}
          />
          <PackageSection onAddToCart={(item) => addToCart(item, 'package')} packages={packages} />
        </>
    );
  };

  return (
    <main className="app">
      <Header cartCount={cartCount} currentUser={currentUser} onNavigate={navigate} />
      {renderPage()}
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
    const users = getStoredUsers();

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

      const user = { email, name, password, role: 'user' };
      writeStoredJson(usersStorageKey, [...users, user]);
      onLogin({ email, name, role: 'user' });
      return;
    }

    const user = users.find((storedUser) => storedUser.email === email && storedUser.password === password);

    if (!user) {
      setMessage('Email ili lozinka nisu tacni.');
      return;
    }

    onLogin({ email: user.email, name: user.name, role: user.role || 'user' });
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
      <div className="auth-form">
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

function ProfilePage({ currentUser, orders, products, reviews, onLogout, onSaveReview, onUpdateProfile }) {
  const [name, setName] = useState(currentUser.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const orderedProductIds = Array.from(
    new Set(
      orders.flatMap((order) =>
        order.items.filter((item) => item.type === 'product').map((item) => Number(item.id))
      )
    )
  );
  const reviewableProducts = products.filter((product) => orderedProductIds.includes(product.id));
  const userReviews = reviews.filter((review) => review.userEmail === currentUser.email);

  const submitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Lozinke se ne poklapaju.');
      return;
    }

    onUpdateProfile({ name, password });
    setPassword('');
    setConfirmPassword('');
    setMessage('Profil je uspesno sacuvan.');
  };

  return (
    <section className="section profile-section" aria-labelledby="profile-title">
      <div className="profile-layout">
        <form className="auth-form" onSubmit={submitHandler}>
          <p className="eyebrow">Profil</p>
          <h1 id="profile-title">Moj profil</h1>

          <label>
            Ime
            <input
              autoComplete="name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Upisite ime"
              required
              type="text"
              value={name}
            />
          </label>

          <label>
            Email
            <input disabled name="email" type="email" value={currentUser.email} />
          </label>

          <label>
            Nova lozinka
            <input
              autoComplete="new-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Upisite novu lozinku"
              type="password"
              value={password}
            />
          </label>

          <label>
            Potvrdite novu lozinku
            <input
              autoComplete="new-password"
              name="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Potvrdite novu lozinku"
              type="password"
              value={confirmPassword}
            />
          </label>

          {message && <p className="form-message success">{message}</p>}

          <button className="auth-submit" type="submit">
            Sacuvaj izmene
          </button>

          <button className="secondary-action" type="button" onClick={onLogout}>
            Odjava
          </button>
        </form>

        <div className="profile-stack">
          <OrderHistory orders={orders} />
          <ReviewPanel products={reviewableProducts} reviews={userReviews} onSaveReview={onSaveReview} />
        </div>
      </div>
    </section>
  );
}

function OrderHistory({ orders }) {
  return (
    <section className="profile-panel" aria-labelledby="orders-title">
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">Istorija</p>
          <h2 id="orders-title">Moje porudzbine</h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="muted-text">Jos uvek nemate porudzbine.</p>
      ) : (
        <div className="history-list">
          {orders.map((order) => (
            <article className="history-card" key={order.id}>
              <div>
                <h3>{order.id}</h3>
                <p>{new Date(order.createdAt).toLocaleDateString('sr-RS')}</p>
              </div>
              <strong>{formatPrice(order.totals.totalPrice)}</strong>
              <span className="status-pill">{order.status}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewPanel({ products, reviews, onSaveReview }) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProductId(products[0]?.id || '');
  }, [products]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!productId) {
      return;
    }

    onSaveReview({ productId, rating, comment });
    setComment('');
    setRating(5);
    setMessage('Recenzija je sacuvana.');
  };

  return (
    <section className="profile-panel" aria-labelledby="review-title">
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">Recenzije</p>
          <h2 id="review-title">Oceni proizvod</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="muted-text">Recenziju mozete ostaviti nakon prve kupovine proizvoda.</p>
      ) : (
        <form className="checkout-form review-form" onSubmit={submitHandler}>
          <label>
            Proizvod
            <select value={productId} onChange={(event) => setProductId(event.target.value)} required>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ocena
            <select value={rating} onChange={(event) => setRating(event.target.value)} required>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Komentar
            <textarea
              onChange={(event) => setComment(event.target.value)}
              placeholder="Podelite utisak o ukusu, svezeni i isporuci"
              required
              rows="4"
              value={comment}
            />
          </label>
          {message && <p className="form-message success">{message}</p>}
          <button className="auth-submit" type="submit">
            Sacuvaj recenziju
          </button>
        </form>
      )}

      {reviews.length > 0 && (
        <div className="review-list">
          {reviews.slice(0, 3).map((review) => (
            <article key={review.id}>
              <strong>{review.productName}</strong>
              <span>Ocena {review.rating}</span>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CartPage({ cartItems, maxQuantity, onClearCart, onNavigate, onRemove, onUpdateQuantity }) {
  const totals = getOrderTotals(cartItems);

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
                <div className="cart-item-main">
                  {item.image && <img src={item.image} alt={item.name} />}
                  <div>
                  <p className="cart-item-type">{item.type === 'package' ? 'Paket' : 'Proizvod'}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  </div>
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

                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <button className="remove-button" type="button" onClick={() => onRemove(item.cartId)}>
                  Ukloni
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Pregled</h3>
            <div className="summary-row">
              <span>Ukupno ({totals.itemCount})</span>
              <strong>{formatPrice(totals.itemsPrice)}</strong>
            </div>
            <p>Porudzbina je vezana za prijavljen nalog i ostaje sacuvana za sledecu posetu.</p>
            <button className="auth-submit" type="button" onClick={() => onNavigate(shippingRoute)}>
              Nastavi kupovinu
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

function CheckoutSteps({ activeStep, onNavigate }) {
  const steps = [
    { id: 1, label: 'Prijava', path: authRoutes.login },
    { id: 2, label: 'Podaci o dostavi', path: shippingRoute },
    { id: 3, label: 'Placanje', path: paymentRoute },
    { id: 4, label: 'Pregled porudzbine', path: reviewRoute },
  ];

  return (
    <nav className="checkout-steps" aria-label="Koraci kupovine">
      {steps.map((step) => (
        <button
          className={activeStep >= step.id ? 'enabled' : ''}
          disabled={activeStep < step.id}
          key={step.id}
          onClick={() => onNavigate(step.path)}
          type="button"
        >
          <span>{step.id}</span>
          {step.label}
        </button>
      ))}
    </nav>
  );
}

function CheckoutShell({ activeStep, children, onNavigate, title }) {
  return (
    <section className="section checkout-section" aria-labelledby="checkout-title">
      <CheckoutSteps activeStep={activeStep} onNavigate={onNavigate} />
      <div className="checkout-panel">
        <h1 id="checkout-title">{title}</h1>
        {children}
      </div>
    </section>
  );
}

function ShippingPage({ checkout, onNavigate, onSaveShipping }) {
  const [form, setForm] = useState(checkout.shippingAddress || emptyCheckout.shippingAddress);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onSaveShipping(form);
  };

  return (
    <CheckoutShell activeStep={2} onNavigate={onNavigate} title="Podaci o dostavi">
      <form className="checkout-form" onSubmit={submitHandler}>
        <label>
          Adresa
          <input
            name="address"
            onChange={(event) => updateField('address', event.target.value)}
            placeholder="Unesite adresu"
            required
            type="text"
            value={form.address}
          />
        </label>
        <label>
          Grad
          <input
            name="city"
            onChange={(event) => updateField('city', event.target.value)}
            placeholder="Unesite grad"
            required
            type="text"
            value={form.city}
          />
        </label>
        <label>
          Postanski broj
          <input
            name="postalCode"
            onChange={(event) => updateField('postalCode', event.target.value)}
            placeholder="Unesite postanski broj"
            required
            type="text"
            value={form.postalCode}
          />
        </label>
        <label>
          Drzava
          <input
            name="country"
            onChange={(event) => updateField('country', event.target.value)}
            placeholder="Unesite drzavu"
            required
            type="text"
            value={form.country}
          />
        </label>
        <button className="auth-submit" type="submit">
          Nastavi
        </button>
      </form>
    </CheckoutShell>
  );
}

function PaymentPage({ checkout, onNavigate, onSavePayment }) {
  const hasAddress = Boolean(checkout.shippingAddress?.address);
  const [paymentMethod, setPaymentMethod] = useState(checkout.paymentMethod || 'PayPal');

  useEffect(() => {
    if (!hasAddress) {
      onNavigate(shippingRoute);
    }
  }, [hasAddress, onNavigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    onSavePayment(paymentMethod);
  };

  return (
    <CheckoutShell activeStep={3} onNavigate={onNavigate} title="Placanje">
      <form className="checkout-form" onSubmit={submitHandler}>
        <fieldset>
          <legend>Odaberite nacin placanja</legend>
          <label className="radio-option">
            <input
              checked={paymentMethod === 'PayPal'}
              name="paymentMethod"
              onChange={(event) => setPaymentMethod(event.target.value)}
              type="radio"
              value="PayPal"
            />
            PayPal ili kreditna kartica
          </label>
        </fieldset>
        <button className="auth-submit" type="submit">
          Nastavite
        </button>
      </form>
    </CheckoutShell>
  );
}

function ReviewOrderPage({ cartItems, checkout, onCompleteOrder, onNavigate }) {
  const totals = getOrderTotals(cartItems);
  const hasAddress = Boolean(checkout.shippingAddress?.address);
  const hasPayment = Boolean(checkout.paymentMethod);

  useEffect(() => {
    if (!hasAddress) {
      onNavigate(shippingRoute);
    } else if (!hasPayment) {
      onNavigate(paymentRoute);
    }
  }, [hasAddress, hasPayment, onNavigate]);

  return (
    <section className="section checkout-section" aria-labelledby="review-title">
      <CheckoutSteps activeStep={4} onNavigate={onNavigate} />
      <div className="order-layout">
        <div className="order-details">
          <h1 id="review-title">Pregled porudzbine</h1>
          <section>
            <h2>Podaci za dostavu</h2>
            <p>
              {checkout.shippingAddress.address}, {checkout.shippingAddress.city}{' '}
              {checkout.shippingAddress.postalCode}, {checkout.shippingAddress.country}
            </p>
          </section>
          <section>
            <h2>Nacin placanja</h2>
            <p>{checkout.paymentMethod}</p>
          </section>
          <section>
            <h2>Stavke porudzbine</h2>
            {cartItems.length === 0 ? (
              <p>Korpa je prazna.</p>
            ) : (
              <div className="review-items">
                {cartItems.map((item) => (
                  <article key={item.cartId}>
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.quantity} x {formatPrice(item.price)} ={' '}
                        {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="cart-summary">
          <h3>Rezimiranje porudzbine</h3>
          <SummaryRow label="Stavke" value={formatPrice(totals.itemsPrice)} />
          <SummaryRow label="Dostava" value={formatPrice(totals.shippingPrice)} />
          <SummaryRow label="Porez" value={formatPrice(totals.taxPrice)} />
          <SummaryRow label="Ukupno" value={formatPrice(totals.totalPrice)} />
          <button
            className="auth-submit"
            disabled={cartItems.length === 0}
            onClick={onCompleteOrder}
            type="button"
          >
            Porucite sada
          </button>
        </aside>
      </div>
    </section>
  );
}

function CompleteOrderPage({ onNavigate }) {
  return (
    <section className="auth-page" aria-labelledby="complete-title">
      <div className="auth-form">
        <p className="eyebrow">Porudzbina</p>
        <h1 id="complete-title">Porudzbina je poslata</h1>
        <p className="auth-note">Hvala na kupovini. Vasa porudzbina je uspesno zabelezena.</p>
        <button className="auth-submit" type="button" onClick={() => onNavigate('/')}>
          Nazad na proizvode
        </button>
      </div>
    </section>
  );
}

function AdminPage({ orders, products, users, onDeleteProduct, onSaveProduct, onUpdateOrderStatus }) {
  const emptyProductForm = {
    id: null,
    name: '',
    category: 'detoks',
    price: '',
    rating: 4.5,
    image: '/images/pocetnasokovi.jpeg',
    description: '',
    nutrition: '',
  };
  const [productForm, setProductForm] = useState(emptyProductForm);

  const updateProductField = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const submitProduct = (event) => {
    event.preventDefault();
    onSaveProduct(productForm);
    setProductForm(emptyProductForm);
  };

  const editProduct = (product) => {
    setProductForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="section admin-section" aria-labelledby="admin-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 id="admin-title">Upravljanje prodavnicom</h1>
        </div>
      </div>

      <div className="admin-grid">
        <form className="admin-panel checkout-form" onSubmit={submitProduct}>
          <h2>{productForm.id ? 'Izmena proizvoda' : 'Novi proizvod'}</h2>
          <label>
            Naziv
            <input
              onChange={(event) => updateProductField('name', event.target.value)}
              required
              type="text"
              value={productForm.name}
            />
          </label>
          <label>
            Kategorija
            <select
              onChange={(event) => updateProductField('category', event.target.value)}
              value={productForm.category}
            >
              {categories.filter((category) => category !== 'sve').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cena
            <input
              min="1"
              onChange={(event) => updateProductField('price', event.target.value)}
              required
              type="number"
              value={productForm.price}
            />
          </label>
          <label>
            Slika
            <input
              onChange={(event) => updateProductField('image', event.target.value)}
              required
              type="text"
              value={productForm.image}
            />
          </label>
          <label>
            Sastav
            <textarea
              onChange={(event) => updateProductField('description', event.target.value)}
              required
              rows="3"
              value={productForm.description}
            />
          </label>
          <label>
            Nutritivne vrednosti
            <input
              onChange={(event) => updateProductField('nutrition', event.target.value)}
              required
              type="text"
              value={productForm.nutrition}
            />
          </label>
          <button className="auth-submit" type="submit">
            Sacuvaj proizvod
          </button>
          {productForm.id && (
            <button className="secondary-action" type="button" onClick={() => setProductForm(emptyProductForm)}>
              Odustani od izmene
            </button>
          )}
        </form>

        <section className="admin-panel">
          <h2>Proizvodi</h2>
          <div className="admin-list">
            {products.map((product) => (
              <article key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category} | {formatPrice(product.price)}</p>
                </div>
                <div className="admin-actions">
                  <button className="secondary-action" type="button" onClick={() => editProduct(product)}>
                    Izmeni
                  </button>
                  <button className="remove-button" type="button" onClick={() => onDeleteProduct(product.id)}>
                    Obrisi
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-grid wide">
        <section className="admin-panel">
          <h2>Porudzbine</h2>
          <div className="admin-list">
            {orders.length === 0 ? (
              <p className="muted-text">Nema pristiglih porudzbina.</p>
            ) : (
              orders.map((order) => (
                <article key={order.id}>
                  <div>
                    <h3>{order.id}</h3>
                    <p>{order.userName} | {formatPrice(order.totals.totalPrice)}</p>
                  </div>
                  <select value={order.status} onChange={(event) => onUpdateOrderStatus(order.id, event.target.value)}>
                    <option>U obradi</option>
                    <option>Odobrena</option>
                    <option>Poslata</option>
                    <option>Isporucena</option>
                    <option>Otkazana</option>
                  </select>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Korisnici</h2>
          <div className="admin-list">
            {users.map((user) => (
              <article key={user.email}>
                <div>
                  <h3>{user.name || user.email}</h3>
                  <p>{user.email}</p>
                </div>
                <span className="status-pill">{user.role || 'user'}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getOrderTotals(cartItems) {
  // Na jednom mestu racunamo iznose koji se prikazuju u korpi i pregledu porudzbine.
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 2500 || itemsPrice === 0 ? 0 : 350;
  const taxPrice = Math.round(itemsPrice * 0.2);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}

export default App;
