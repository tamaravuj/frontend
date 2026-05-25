function Hero() {
  return (
    <header className="hero" id="pocetna">
      <section className="hero-text">
        <p className="eyebrow">Online prodaja</p>
        <h1>Prirodni sokovi za svaki dan.</h1>
        <p>Sveze cedjeni sokovi od voca i povrca, pripremljeni za detoks, imunitet, energiju i trening.</p>

        <div className="hero-actions">
          <a href="#katalog">Pogledaj proizvode</a>
          <a className="secondary-link" href="#paketi">Pogledaj pakete</a>
        </div>
      </section>

      <section className="juice-preview" aria-label="Sokovi u ponudi">
        <img src="/images/pocetnasokovi.jpeg" alt="Prirodni cedjeni sok" />
      </section>
    </header>
  );
}

export default Hero;
