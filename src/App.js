import { useMemo, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import PackageSection from './components/PackageSection';
import ProductSection from './components/ProductSection';
import Stats from './components/Stats';
import { categories, packages, products } from './data/shopData';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('sve');

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'sve') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="app">
      <Header />
      <Hero />
      <Stats productTotal={products.length} packageTotal={packages.length} />
      <ProductSection
        categories={categories}
        products={visibleProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <PackageSection packages={packages} />
      <Footer />
    </main>
  );
}

export default App;
