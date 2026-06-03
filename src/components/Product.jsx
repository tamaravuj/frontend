import Rating from './Rating';

const Product = ({ product, reviews = [], onAddToCart }) => {
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
};

export default Product;
