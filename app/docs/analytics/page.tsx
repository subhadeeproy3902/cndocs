"use client"

import useSWR from "swr"
import AnalyticsOverlay from "@/components/analytics/AnalyticsOverlay"
import SessionAnalyticsOverlay from "@/components/analytics/SessionAnalytics"
import GeoAnalytics from "@/components/analytics/GeoAnalytics"
import PerformanceOverview from "@/components/analytics/Performance"
import { Loader } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsDashboard() {
  // Main analytics
  const { data, error, isLoading } = useSWR<AnalyticsResponse>(
    '/api/analytics?period=30',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  // Session analytics
  const { data: sessionData, error: sessionError, isLoading: sessionLoading } = useSWR<SessionAnalyticsResponse>(
    '/api/analytics/sessions?period=30',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  const { data: geoData } = useSWR<GeoAnalyticsResponse>("/api/analytics/geo?period=30", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading || sessionLoading) return (<div className="p-6 min-h-screen text-lg font-medium m-auto flex flex-col items-center justify-center">
    <Loader className="animate-spin h-8 w-8 m-auto text-primary" />
  </div>)
  if (error || !data) return <div className="p-6 text-lg text-red-500">Failed to load analytics.</div>
  if (sessionError || !sessionData) return <div className="p-6 text-lg text-red-500">Failed to load session analytics.</div>

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-16 flex flex-col gap-12">
      <AnalyticsOverlay isVisible={true} data={data} />
      <SessionAnalyticsOverlay data={sessionData} />
      <PerformanceOverview />
      {geoData && <GeoAnalytics data={geoData} />}
    </div>
  )
}
