"use client"

import useSWR from "swr"
import AnalyticsOverlay from "@/components/analytics/AnalyticsOverlay"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsDashboard() {
  // Always fetch 30 days of data
  const { data, error, isLoading } = useSWR<AnalyticsResponse>(
    '/api/analytics?period=30',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time data
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  console.log(data)

  if (isLoading) return <div className="p-6 text-lg font-medium">Loading...</div>
  if (error || !data) return <div className="p-6 text-lg text-red-500">Failed to load analytics.</div>

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-16 min-h-screen bg-background">
      <AnalyticsOverlay 
        isVisible={true} 
        data={data}
      />
    </div>
  )
}
