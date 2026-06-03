import { authRoutes } from '../constants';

function AuthRequired({ onNavigate }) {
  return (
    <section className="auth-page" aria-labelledby="cart-auth-title">
      <div className="auth-form">
        <p className="eyebrow">Korpa</p>
        <h1 id="cart-auth-title">Prijava je obavezna</h1>
        <p className="auth-note">Samo prijavljeni korisnici mogu da vide korpu i dodaju proizvode.</p>
        <button className="auth-submit" type="button" onClick={() => onNavigate(authRoutes.login)}>
          Prijavi se
        </button>
      </div>
    </section>
  );
}

export default AuthRequired;
