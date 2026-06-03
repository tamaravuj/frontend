import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/cartUtils';

function ProfileScreen({ currentUser, orders, products, reviews, onLogout, onSaveReview, onUpdateProfile }) {
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

export default ProfileScreen;
