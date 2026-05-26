function ProductSection({ categories, products, selectedCategory, onAddToCart, onCategoryChange }) {
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
          <article className="product-card" key={product.id}>
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="card-body">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <small>{product.nutrition}</small>
              <div className="card-footer">
                <strong>{product.price} RSD</strong>
                <span>Ocena {product.rating}</span>
              </div>
              <button className="add-cart-button" type="button" onClick={() => onAddToCart(product)}>
                Dodaj u korpu
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
