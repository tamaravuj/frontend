function Header({ onNavigate }) {
  const goToHomeSection = (event, sectionId) => {
    event.preventDefault();
    onNavigate('/');

    window.requestAnimationFrame(() => {
      document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const goToLogin = (event) => {
    event.preventDefault();
    onNavigate('/prijava');
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
        <a href="/prijava" onClick={goToLogin}>
          Prijava
        </a>
      </div>

      <div className="account-actions">
        <a className="contact-link" href="tel:+381601234567">
          060 123 4567
        </a>
      </div>
    </nav>
  );
}

export default Header;
