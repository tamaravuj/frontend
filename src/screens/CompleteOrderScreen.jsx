function CompleteOrderScreen({ onNavigate }) {
  return (
    <section className="auth-page" aria-labelledby="complete-title">
      <div className="auth-form">
        <p className="eyebrow">Porudzbina</p>
        <h1 id="complete-title">Porudzbina je poslata</h1>
        <p className="auth-note">Hvala na kupovini. Vasa porudzbina je uspesno zabelezena.</p>
        <button className="auth-submit" type="button" onClick={() => onNavigate('/')}>
          Nazad na proizvode
        </button>
      </div>
    </section>
  );
}

export default CompleteOrderScreen;
