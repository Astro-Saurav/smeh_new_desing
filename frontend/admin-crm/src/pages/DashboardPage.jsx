import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analyticsApi } from '../api/analyticsApi'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { ChartsSkeleton, StatsSkeleton } from '../components/Skeletons'

export function DashboardPage () {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.overview(),
    refetchInterval: 20000
  })

  if (isLoading) {
    return (
      <div className="stack-lg">
        <StatsSkeleton />
        <ChartsSkeleton />
      </div>
    )
  }

  if (error) {
    return <div className="panel error">Unable to load analytics.</div>
  }

  const totals = data.totals

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Analytics"
        title="Performance Dashboard"
        subtitle="Track editorial pipeline, publishing throughput, and category health in one place."
      />

      <section className="stats-grid">
        <StatCard title="Total News" value={totals.totalNews} subtitle="All records" />
        <StatCard title="Draft" value={totals.draft} subtitle="Needs editorial review" />
        <StatCard title="Published" value={totals.published} subtitle="Live to audience" />
        <StatCard title="Scheduled" value={totals.scheduled} subtitle="Queued for publishing" />
      </section>

      <section className="charts-grid">
        <article className="panel">
          <h3>News by Category</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.categoryCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="var(--chart-1)" name="News count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <h3>Monthly Publish Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="var(--chart-2)" strokeWidth={3} name="Published" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  )
}
