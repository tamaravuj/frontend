import { useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { emptyCheckout } from '../constants';

function ShippingScreen({ checkout, onNavigate, onSaveShipping }) {
  const [form, setForm] = useState(checkout.shippingAddress || emptyCheckout.shippingAddress);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onSaveShipping(form);
  };

  return (
    <section className="section checkout-section" aria-labelledby="shipping-title">
      <CheckoutSteps activeStep={2} onNavigate={onNavigate} />
      <div className="checkout-panel">
        <h1 id="shipping-title">Podaci o dostavi</h1>
        <form className="checkout-form" onSubmit={submitHandler}>
          <label>
            Adresa
            <input
              name="address"
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="Unesite adresu"
              required
              type="text"
              value={form.address}
            />
          </label>
          <label>
            Grad
            <input
              name="city"
              onChange={(event) => updateField('city', event.target.value)}
              placeholder="Unesite grad"
              required
              type="text"
              value={form.city}
            />
          </label>
          <label>
            Postanski broj
            <input
              name="postalCode"
              onChange={(event) => updateField('postalCode', event.target.value)}
              placeholder="Unesite postanski broj"
              required
              type="text"
              value={form.postalCode}
            />
          </label>
          <label>
            Drzava
            <input
              name="country"
              onChange={(event) => updateField('country', event.target.value)}
              placeholder="Unesite drzavu"
              required
              type="text"
              value={form.country}
            />
          </label>
          <button className="auth-submit" type="submit">
            Nastavi
          </button>
        </form>
      </div>
    </section>
  );
}

export default ShippingScreen;
