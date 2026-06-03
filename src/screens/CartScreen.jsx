import { shippingRoute } from '../constants';
import { formatPrice, getOrderTotals } from '../utils/cartUtils';

function CartScreen({ cartItems, maxQuantity, onClearCart, onNavigate, onRemove, onUpdateQuantity }) {
  const totals = getOrderTotals(cartItems);

  return (
    <section className="section cart-section" aria-labelledby="cart-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Korpa</p>
          <h2 id="cart-title">Tvoja porudzbina</h2>
        </div>

        <button className="secondary-action" type="button" onClick={() => onNavigate('/')}>
          Nastavi kupovinu
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Korpa je prazna</h3>
          <p>Izaberi sokove ili pakete iz kataloga i dodaj ih u korpu.</p>
          <button className="auth-submit" type="button" onClick={() => onNavigate('/')}>
            Pogledaj proizvode
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.cartId}>
                <div className="cart-item-main">
                  {item.image && <img src={item.image} alt={item.name} />}
                  <div>
                    <p className="cart-item-type">{item.type === 'package' ? 'Paket' : 'Proizvod'}</p>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>

                <div className="quantity-control" aria-label={`Kolicina za ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                    disabled={item.quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <button className="remove-button" type="button" onClick={() => onRemove(item.cartId)}>
                  Ukloni
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Pregled</h3>
            <div className="summary-row">
              <span>Ukupno ({totals.itemCount})</span>
              <strong>{formatPrice(totals.itemsPrice)}</strong>
            </div>
            <p>Porudzbina je vezana za prijavljen nalog i ostaje sacuvana za sledecu posetu.</p>
            <button className="auth-submit" type="button" onClick={() => onNavigate(shippingRoute)}>
              Nastavi kupovinu
            </button>
            <button className="secondary-action" type="button" onClick={onClearCart}>
              Isprazni korpu
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartScreen;
