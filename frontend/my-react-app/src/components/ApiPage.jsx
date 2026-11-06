export default function ApiPage({
  title,
  description,
  loading = false,
  error = "",
  children,
}) {
  return (
    <main className="api-page">
      <header className="api-page__header">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
      {loading && <p className="api-message">Loading data…</p>}
      {error && <p className="api-message api-message--error" role="alert">{error}</p>}
      {children}
    </main>
  );
}
