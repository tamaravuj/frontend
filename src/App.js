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

function App() {
  const [selectedCategory, setSelectedCategory] = useState('sve');
  const [page, setPage] = useState(() => window.location.pathname);

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

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'sve') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const isAuthPage = page === authRoutes.login || page === authRoutes.register;

  return (
    <main className="app">
      <Header onNavigate={navigate} />
      {isAuthPage ? (
        <AuthPage page={page} onNavigate={navigate} />
      ) : (
        <>
          <Hero />
          <Stats productTotal={products.length} packageTotal={packages.length} />
          <ProductSection
            categories={categories}
            products={visibleProducts}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <PackageSection packages={packages} />
        </>
      )}
      <Footer />
    </main>
  );
}

function AuthPage({ page, onNavigate }) {
  const isRegister = page === authRoutes.register;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">{isRegister ? 'Novi nalog' : 'Dobrodosli nazad'}</p>
        <h1 id="auth-title">{isRegister ? 'Registracija' : 'Prijava'}</h1>

        {isRegister && (
          <label>
            Ime i prezime
            <input type="text" name="name" autoComplete="name" required />
          </label>
        )}

        <label>
          Email
          <input type="email" name="email" autoComplete="email" required />
        </label>

        <label>
          Lozinka
          <input
            type="password"
            name="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />
        </label>

        {isRegister && (
          <label>
            Potvrdi lozinku
            <input type="password" name="confirmPassword" autoComplete="new-password" required />
          </label>
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

export default App;
