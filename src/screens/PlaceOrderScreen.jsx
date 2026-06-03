import { useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import SummaryRow from '../components/SummaryRow';
import { paymentRoute, shippingRoute } from '../constants';
import { formatPrice, getOrderTotals } from '../utils/cartUtils';

function PlaceOrderScreen({ cartItems, checkout, onCompleteOrder, onNavigate }) {
  const totals = getOrderTotals(cartItems);
  const hasAddress = Boolean(checkout.shippingAddress?.address);
  const hasPayment = Boolean(checkout.paymentMethod);

  useEffect(() => {
    if (!hasAddress) {
      onNavigate(shippingRoute);
    } else if (!hasPayment) {
      onNavigate(paymentRoute);
    }
  }, [hasAddress, hasPayment, onNavigate]);

  return (
    <section className="section checkout-section" aria-labelledby="review-title">
      <CheckoutSteps activeStep={4} onNavigate={onNavigate} />
      <div className="order-layout">
        <div className="order-details">
          <h1 id="review-title">Pregled porudzbine</h1>
          <section>
            <h2>Podaci za dostavu</h2>
            <p>
              {checkout.shippingAddress.address}, {checkout.shippingAddress.city}{' '}
              {checkout.shippingAddress.postalCode}, {checkout.shippingAddress.country}
            </p>
          </section>
          <section>
            <h2>Nacin placanja</h2>
            <p>{checkout.paymentMethod}</p>
          </section>
          <section>
            <h2>Stavke porudzbine</h2>
            {cartItems.length === 0 ? (
              <p>Korpa je prazna.</p>
            ) : (
              <div className="review-items">
                {cartItems.map((item) => (
                  <article key={item.cartId}>
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.quantity} x {formatPrice(item.price)} = {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="cart-summary">
          <h3>Rezimiranje porudzbine</h3>
          <SummaryRow label="Stavke" value={formatPrice(totals.itemsPrice)} />
          <SummaryRow label="Dostava" value={formatPrice(totals.shippingPrice)} />
          <SummaryRow label="Porez" value={formatPrice(totals.taxPrice)} />
          <SummaryRow label="Ukupno" value={formatPrice(totals.totalPrice)} />
          <button className="auth-submit" disabled={cartItems.length === 0} onClick={onCompleteOrder} type="button">
            Porucite sada
          </button>
        </aside>
      </div>
    </section>
  );
}

export default PlaceOrderScreen;
