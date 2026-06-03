import { useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { shippingRoute } from '../constants';

function PaymentScreen({ checkout, onNavigate, onSavePayment }) {
  const hasAddress = Boolean(checkout.shippingAddress?.address);
  const [paymentMethod, setPaymentMethod] = useState(checkout.paymentMethod || 'PayPal');

  useEffect(() => {
    if (!hasAddress) {
      onNavigate(shippingRoute);
    }
  }, [hasAddress, onNavigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    onSavePayment(paymentMethod);
  };

  return (
    <section className="section checkout-section" aria-labelledby="payment-title">
      <CheckoutSteps activeStep={3} onNavigate={onNavigate} />
      <div className="checkout-panel">
        <h1 id="payment-title">Placanje</h1>
        <form className="checkout-form" onSubmit={submitHandler}>
          <fieldset>
            <legend>Odaberite nacin placanja</legend>
            <label className="radio-option">
              <input
                checked={paymentMethod === 'PayPal'}
                name="paymentMethod"
                onChange={(event) => setPaymentMethod(event.target.value)}
                type="radio"
                value="PayPal"
              />
              PayPal ili kreditna kartica
            </label>
          </fieldset>
          <button className="auth-submit" type="submit">
            Nastavite
          </button>
        </form>
      </div>
    </section>
  );
}

export default PaymentScreen;
