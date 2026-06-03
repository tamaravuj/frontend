import Product from './Product';

function ProductSection({ categories, products, reviews, selectedCategory, onAddToCart, onCategoryChange }) {
  const getProductReviews = (productId) => reviews.filter((review) => review.productId === productId);

  return (
    <section className="section" id="katalog">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Katalog</p>
          <h2>Proizvodi</h2>
        </div>

        <div className="filters">
          {categories.map((category) => (
            <button
              className={selectedCategory === category ? 'active' : ''}
              key={category}
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <Product key={product.id} onAddToCart={onAddToCart} product={product} reviews={getProductReviews(product.id)} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
