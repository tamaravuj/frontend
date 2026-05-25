function PackageSection({ packages }) {
  return (
    <section className="section packages-section" id="paketi">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Paketi</p>
          <h2>Gotove kombinacije</h2>
        </div>
      </div>

      <div className="package-grid">
        {packages.map((item) => (
          <article className="package-card" key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <small>{item.items}</small>
            <div className="card-footer">
              <strong>{item.price} RSD</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PackageSection;
