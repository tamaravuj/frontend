import { useState } from 'react';
import { authRoutes } from '../constants';
import { getStoredUsers } from '../utils/storage';

function LoginScreen({ currentUser, onLogin, onNavigate }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const users = getStoredUsers();
    const user = users.find((storedUser) => storedUser.email === email && storedUser.password === password);

    if (!user) {
      setMessage('Email ili lozinka nisu tacni.');
      return;
    }

    onLogin({ email: user.email, name: user.name, role: user.role || 'user' });
  };

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Dobrodosli nazad</p>
        <h1 id="login-title">Prijava</h1>

        <label>
          Email
          <input type="email" name="email" autoComplete="email" placeholder="primer@email.com" required />
        </label>

        <label>
          Lozinka
          <input type="password" name="password" autoComplete="current-password" placeholder="Unesi lozinku" required />
        </label>

        {message && <p className="form-message">{message}</p>}
        {currentUser && (
          <p className="form-message success">Vec si prijavljen kao {currentUser.name || currentUser.email}.</p>
        )}

        <button className="auth-submit" type="submit">
          Prijavi se
        </button>

        <p className="auth-switch">
          Nemas nalog?{' '}
          <button type="button" onClick={() => onNavigate(authRoutes.register)}>
            Registruj se
          </button>
        </p>
      </form>
    </section>
  );
}

export default LoginScreen;
