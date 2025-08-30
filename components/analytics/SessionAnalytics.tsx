"use client"

import { memo } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"

interface SessionAnalyticsOverlayProps {
  data: SessionAnalyticsResponse
}

const SessionAnalyticsOverlay = memo(({ data }: SessionAnalyticsOverlayProps) => {
  const durationMinutes = Math.floor(data.avgSessionDuration / 60)
  const durationSeconds = data.avgSessionDuration % 60

  const panels = [
    { title: "Top Landing Pages", items: data.landingPages },
    { title: "Top Exit Pages", items: data.exitPages }
  ]

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl text-foreground font-semibold">Session Analytics</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-secondary/50">
          <div className="text-sm text-muted-foreground">Avg. Session Duration</div>
          <div className="text-2xl font-bold">
            {durationMinutes}m {durationSeconds}s
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-secondary/50">
          <div className="text-sm text-muted-foreground">Pages per Session</div>
          <div className="text-2xl font-bold">
            {data.pagesPerSession.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Landing / Exit Pages Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panels.map((panel, idx) => {
          const chartData = panel.items.map((item, index) => ({
            name: item[0],
            value: item[1],
            fill: `var(--chart-${(index % 5) + 1})`,
          }))

          return (
            <div key={idx} className="border rounded-lg p-4 bg-gradient-to-b from-secondary/10 to-card">
              <h3 className="text-lg font-medium mb-4">{panel.title}</h3>
              <ChartContainer
                config={{ value: { label: "Value", color: "hsl(var(--chart-1))" } }}
                className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-56"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={6}
                  />
                </PieChart>
              </ChartContainer>

              <ScrollArea className="h-40 mt-4">
                <div className="space-y-2">
                  {panel.items.map(([label, value], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded hover:bg-card transition-colors"
                    >
                      <span className="text-muted-foreground text-sm">{label}</span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )
        })}
      </div>
    </div>
  )
})

SessionAnalyticsOverlay.displayName = "SessionAnalyticsOverlay"

export default SessionAnalyticsOverlay
