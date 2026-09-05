export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-page">
      <section className="auth-visual" aria-hidden="true">
        <div className="visual-grid" />
        <div className="visual-copy">
          <p className="brand-mark">Vaultline</p>
          <h2>Credentials in. Token out. Access unlocked.</h2>
        </div>
      </section>

      <section className="auth-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="panel-subtitle">{subtitle}</p>
        {children}
      </section>
    </div>
  );
}
