import Rating from '../common/Rating';

function ProductSection({ categories, products, reviews, selectedCategory, onAddToCart, onCategoryChange }) {
  // Svakom proizvodu prikazujemo samo recenzije koje pripadaju bas njemu.
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
          <ProductCard
            key={product.id}
            onAddToCart={onAddToCart}
            product={product}
            reviews={getProductReviews(product.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ onAddToCart, product, reviews }) {
  // Ako postoje recenzije korisnika, prosecna ocena ima prednost nad pocetnom ocenom proizvoda.
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
      : product.rating;

  return (
    <article className="product-card">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <small>{product.nutrition}</small>
        <div className="card-footer">
          <strong>{product.price} RSD</strong>
          <Rating value={averageRating} text={averageRating} />
        </div>
        {reviews.length > 0 && (
          <div className="product-reviews">
            <strong>Recenzije ({reviews.length})</strong>
            <p>{reviews[0].comment}</p>
          </div>
        )}
        <button className="add-cart-button" type="button" onClick={() => onAddToCart(product)}>
          Dodaj u korpu
        </button>
      </div>
    </article>
  );
}

export default ProductSection;
