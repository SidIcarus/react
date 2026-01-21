import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/dashboardCharts')({
  server: {
    handlers: {
      GET: () => json(data),
    },
  },
})

const data = {
  impressions: {
    total: 52189,
    unique: 2886
  },
  clickThroughRate: {
    percent: 4.06,
    total: 2117
  },
  engagementRate: {
    percent: 7.42,
    total: 3873
  }
}

export type DashboardChartData = typeof data
