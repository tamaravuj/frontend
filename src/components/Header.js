function Header() {
  return (
    <nav className="topbar">
      <a className="brand" href="#pocetna">
        FreshFit sokovi
      </a>

      <div className="nav-links">
        <a href="#pocetna">Pocetna</a>
        <a href="#katalog">Proizvodi</a>
        <a href="#paketi">Paketi</a>
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
