import { useState } from 'react';
import { authRoutes, usersStorageKey } from '../constants';
import { getStoredUsers, writeStoredJson } from '../utils/storage';

function RegisterScreen({ currentUser, onLogin, onNavigate }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const users = getStoredUsers();

    if (password !== confirmPassword) {
      setMessage('Lozinke se ne poklapaju.');
      return;
    }

    if (users.some((user) => user.email === email)) {
      setMessage('Nalog sa ovim emailom vec postoji.');
      return;
    }

    const user = { email, name, password, role: 'user' };
    writeStoredJson(usersStorageKey, [...users, user]);
    onLogin({ email, name, role: 'user' });
  };

  return (
    <section className="auth-page" aria-labelledby="register-title">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Novi nalog</p>
        <h1 id="register-title">Registracija</h1>

        <label>
          Ime i prezime
          <input type="text" name="name" autoComplete="name" placeholder="Unesi ime i prezime" required />
        </label>

        <label>
          Email
          <input type="email" name="email" autoComplete="email" placeholder="primer@email.com" required />
        </label>

        <label>
          Lozinka
          <input type="password" name="password" autoComplete="new-password" placeholder="Unesi lozinku" required />
        </label>

        <label>
          Potvrdi lozinku
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Ponovi lozinku"
            required
          />
        </label>

        {message && <p className="form-message">{message}</p>}
        {currentUser && (
          <p className="form-message success">Vec si prijavljen kao {currentUser.name || currentUser.email}.</p>
        )}

        <button className="auth-submit" type="submit">
          Registruj se
        </button>

        <p className="auth-switch">
          Vec imas nalog?{' '}
          <button type="button" onClick={() => onNavigate(authRoutes.login)}>
            Nazad na prijavu
          </button>
        </p>
      </form>
    </section>
  );
}

export default RegisterScreen;
