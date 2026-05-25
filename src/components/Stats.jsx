function Stats({ productTotal, packageTotal }) {
  return (
    <section className="stats">
      <article>
        <strong>{productTotal}</strong>
        <span>proizvoda</span>
      </article>
      <article>
        <strong>{packageTotal}</strong>
        <span>paketa</span>
      </article>
      <article>
        <strong>24h</strong>
        <span>priprema porudzbine</span>
      </article>
    </section>
  );
}

export default Stats;
