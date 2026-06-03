import { authRoutes, paymentRoute, reviewRoute, shippingRoute } from '../constants';

function CheckoutSteps({ activeStep, onNavigate }) {
  const steps = [
    { id: 1, label: 'Prijava', path: authRoutes.login },
    { id: 2, label: 'Podaci o dostavi', path: shippingRoute },
    { id: 3, label: 'Placanje', path: paymentRoute },
    { id: 4, label: 'Pregled porudzbine', path: reviewRoute },
  ];

  return (
    <nav className="checkout-steps" aria-label="Koraci kupovine">
      {steps.map((step) => (
        <button
          className={activeStep >= step.id ? 'enabled' : ''}
          disabled={activeStep < step.id}
          key={step.id}
          onClick={() => onNavigate(step.path)}
          type="button"
        >
          <span>{step.id}</span>
          {step.label}
        </button>
      ))}
    </nav>
  );
}

export default CheckoutSteps;
