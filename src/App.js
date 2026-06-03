import { useEffect, useState } from 'react';
import AuthRequired from './components/AuthRequired';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import {
  adminRoute,
  authRoutes,
  cartRoute,
  completeRoute,
  emptyCheckout,
  getCartStorageKey,
  getCheckoutStorageKey,
  maxCartQuantity,
  ordersStorageKey,
  paymentRoute,
  productsStorageKey,
  profileRoute,
  protectedRoutes,
  reviewRoute,
  reviewsStorageKey,
  sessionStorageKey,
  shippingRoute,
  usersStorageKey,
} from './constants';
import { useStoredState } from './hooks/useStoredState';
import { categories, packages, products as initialProducts } from './data/shopData';
import { getStoredUsers, readStoredJson, writeStoredJson } from './utils/storage';
import AdminScreen from './screens/AdminScreen';
import CartScreen from './screens/CartScreen';
import CompleteOrderScreen from './screens/CompleteOrderScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import { updateUserProfile } from './slices/authSlice';
import {
  addToCart,
  clearCartItems,
  getCartCount,
  removeFromCart,
  updateCartQuantity,
} from './slices/cartSlice';
import { createOrder, updateOrderStatus } from './slices/orderSlice';
import { deleteProduct, saveProduct } from './slices/productsSlice';
import { createReview } from './slices/reviewsSlice';
import './styles/App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('sve');
  const [page, setPage] = useState(() => window.location.pathname);
  const [currentUser, setCurrentUser] = useStoredState(sessionStorageKey, null);
  const [products, setProducts] = useStoredState(productsStorageKey, initialProducts);
  const [orders, setOrders] = useStoredState(ordersStorageKey, []);
  const [reviews, setReviews] = useStoredState(reviewsStorageKey, []);
  const [cartItems, setCartItems] = useState([]);
  const [checkout, setCheckout] = useState(emptyCheckout);

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
    if (currentUser?.email) {
      writeStoredJson(getCartStorageKey(currentUser.email), cartItems);
    }
  }, [cartItems, currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      writeStoredJson(getCheckoutStorageKey(currentUser.email), checkout);
    }
  }, [checkout, currentUser]);

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

  const requireLogin = () => {
    navigate(authRoutes.login);
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

  const addToCartHandler = (item, type = 'product') => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems((items) => addToCart(items, item, type, maxCartQuantity));
  };

  const updateCartQuantityHandler = (cartId, quantity) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems((items) => updateCartQuantity(items, cartId, quantity, maxCartQuantity));
  };

  const removeFromCartHandler = (cartId) => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems((items) => removeFromCart(items, cartId));
  };

  const clearCartHandler = () => {
    if (!currentUser) {
      requireLogin();
      return;
    }

    setCartItems(clearCartItems());
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

    const order = createOrder({ cartItems, checkout, currentUser });

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
    const { updatedUser, updatedUsers } = updateUserProfile(users, currentUser, { name, password });

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

    const review = createReview({ product, productId, rating, comment, currentUser });

    setReviews((currentReviews) => [review, ...currentReviews]);
  };

  const saveProductHandler = (product) => {
    setProducts((currentProducts) => saveProduct(currentProducts, product));
  };

  const deleteProductHandler = (productId) => {
    setProducts((currentProducts) => deleteProduct(currentProducts, productId));
  };

  const updateOrderStatusHandler = (orderId, status) => {
    setOrders((currentOrders) => updateOrderStatus(currentOrders, orderId, status));
  };

  const visibleProducts =
    selectedCategory === 'sve' ? products : products.filter((product) => product.category === selectedCategory);
  const cartCount = getCartCount(cartItems);
  const currentUserOrders = orders.filter((order) => order.userEmail === currentUser?.email);
  const isProtectedPage = protectedRoutes.includes(page);

  const renderPage = () => {
    if (page === authRoutes.login || page === authRoutes.register) {
      return page === authRoutes.login ? (
        <LoginScreen currentUser={currentUser} onLogin={handleLogin} onNavigate={navigate} />
      ) : (
        <RegisterScreen currentUser={currentUser} onLogin={handleLogin} onNavigate={navigate} />
      );
    }

    if (!currentUser && isProtectedPage) {
      return <AuthRequired onNavigate={navigate} />;
    }

    if (page === cartRoute) {
      return (
        <CartScreen
          cartItems={cartItems}
          maxQuantity={maxCartQuantity}
          onClearCart={clearCartHandler}
          onNavigate={navigate}
          onRemove={removeFromCartHandler}
          onUpdateQuantity={updateCartQuantityHandler}
        />
      );
    }

    if (page === shippingRoute) {
      return <ShippingScreen checkout={checkout} onNavigate={navigate} onSaveShipping={saveShippingAddress} />;
    }

    if (page === paymentRoute) {
      return <PaymentScreen checkout={checkout} onNavigate={navigate} onSavePayment={savePaymentMethod} />;
    }

    if (page === reviewRoute) {
      return (
        <PlaceOrderScreen
          cartItems={cartItems}
          checkout={checkout}
          onCompleteOrder={completeOrder}
          onNavigate={navigate}
        />
      );
    }

    if (page === completeRoute) {
      return <CompleteOrderScreen onNavigate={navigate} />;
    }

    if (page === profileRoute) {
      return (
        <ProfileScreen
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

    if (page === adminRoute) {
      return currentUser?.role === 'admin' ? (
        <AdminScreen
          orders={orders}
          products={products}
          users={getStoredUsers()}
          onDeleteProduct={deleteProductHandler}
          onSaveProduct={saveProductHandler}
          onUpdateOrderStatus={updateOrderStatusHandler}
        />
      ) : (
        <AuthRequired onNavigate={navigate} />
      );
    }

    return (
      <HomeScreen
        categories={categories}
        packageTotal={packages.length}
        packages={packages}
        products={visibleProducts}
        productTotal={products.length}
        reviews={reviews}
        selectedCategory={selectedCategory}
        onAddPackageToCart={(item) => addToCartHandler(item, 'package')}
        onAddProductToCart={(product) => addToCartHandler(product, 'product')}
        onCategoryChange={setSelectedCategory}
      />
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

export default App;
