import Hero from '../components/sections/Hero';
import PackageSection from '../components/sections/PackageSection';
import ProductSection from '../components/sections/ProductSection';
import Stats from '../components/sections/Stats';

function HomeScreen({
  categories,
  packageTotal,
  packages,
  products,
  reviews,
  selectedCategory,
  onAddPackageToCart,
  onAddProductToCart,
  onCategoryChange,
  productTotal,
}) {
  return (
    <>
      <Hero />
      <Stats productTotal={productTotal} packageTotal={packageTotal} />
      <ProductSection
        categories={categories}
        products={products}
        reviews={reviews}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onAddToCart={onAddProductToCart}
      />
      <PackageSection onAddToCart={onAddPackageToCart} packages={packages} />
    </>
  );
}

export default HomeScreen;
