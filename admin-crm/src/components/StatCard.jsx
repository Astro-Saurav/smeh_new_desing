export function StatCard ({ title, value, subtitle }) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-subtitle">{subtitle}</p>
    </article>
  )
}
