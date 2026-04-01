export function SkeletonBlock ({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function StatsSkeleton () {
  return (
    <section className="stats-grid">
      <SkeletonBlock className="stat-card skeleton-card" />
      <SkeletonBlock className="stat-card skeleton-card" />
      <SkeletonBlock className="stat-card skeleton-card" />
      <SkeletonBlock className="stat-card skeleton-card" />
    </section>
  )
}

export function ChartsSkeleton () {
  return (
    <section className="charts-grid">
      <SkeletonBlock className="panel skeleton-chart" />
      <SkeletonBlock className="panel skeleton-chart" />
    </section>
  )
}

export function TableSkeleton ({ rows = 5 }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonBlock key={index} className="skeleton-row" />
      ))}
    </div>
  )
}
