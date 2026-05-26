function Header({ cartCount, currentUser, onNavigate }) {
  const goTo = (event, path) => {
    event.preventDefault();
    onNavigate(path);
  };

  const goToHomeSection = (event, sectionId) => {
    event.preventDefault();
    onNavigate('/');

    window.requestAnimationFrame(() => {
      document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <nav className="topbar">
      <a className="brand" href="#pocetna" onClick={(event) => goToHomeSection(event, '#pocetna')}>
        FreshFit sokovi
      </a>

      <div className="nav-links">
        <a href="#pocetna" onClick={(event) => goToHomeSection(event, '#pocetna')}>
          Pocetna
        </a>
        <a href="#katalog" onClick={(event) => goToHomeSection(event, '#katalog')}>
          Proizvodi
        </a>
        <a href="#paketi" onClick={(event) => goToHomeSection(event, '#paketi')}>
          Paketi
        </a>
        <a href="/korpa" onClick={(event) => goTo(event, currentUser ? '/korpa' : '/prijava')}>
          Korpa ({cartCount})
        </a>
        {!currentUser && (
          <a href="/prijava" onClick={(event) => goTo(event, '/prijava')}>
            Prijava
          </a>
        )}
        {currentUser?.role === 'admin' && (
          <a href="/admin" onClick={(event) => goTo(event, '/admin')}>
            Admin
          </a>
        )}
      </div>

      <div className="account-actions">
        {currentUser ? (
          <a className="contact-link" href="/profile" onClick={(event) => goTo(event, '/profile')}>
            {currentUser.name || currentUser.email}
          </a>
        ) : (
          <a className="contact-link" href="tel:+381601234567">
            060 123 4567
          </a>
        )}
      </div>
    </nav>
  );
}

export default Header;
