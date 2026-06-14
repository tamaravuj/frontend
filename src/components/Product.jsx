import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const ratingPercent = `${(product.rating / 5) * 100}%`;

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, type: 'product' }));
        toast.success('Proizvod dodat u korpu');
    };

    return (
        <article className="product-card">
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="card-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.nutrition && <small>{product.nutrition}</small>}
                <div className="card-footer">
                    <div className="rating">
                        <span
                            className="rating-stars"
                            style={{ '--rating-percent': ratingPercent }}
                            aria-label={`Ocena ${product.rating} od 5`}
                        />
                        <span className="rating-text">({product.numReviews})</span>
                    </div>
                    <strong>{product.price} RSD</strong>
                </div>
                <button className="add-cart-button" type="button" onClick={addToCartHandler}>
                    Dodaj u korpu
                </button>
            </div>
        </article>
    );
};

export default Product;