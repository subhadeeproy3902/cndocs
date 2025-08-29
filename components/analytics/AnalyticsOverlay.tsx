"use client";

import { memo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import AnimationContainer from "../ui/animation-container";
import { LineChart } from "./LineChart";

interface AnalyticsOverlayProps {
  isVisible: boolean;
  data: AnalyticsResponse;
}

interface AnalyticsPanelProps {
  title: string;
  items: [string, number][];
}

interface MetricCardProps {
  label: string;
  value: number;
  isActive: boolean;
  onClick: () => void;
}

const MetricCard = memo(({ label, value, isActive, onClick }: MetricCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isActive 
          ? "bg-primary/10 border-primary text-primary" 
          : "bg-secondary/50 border-border hover:bg-secondary"
      }`}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </div>
  );
});

MetricCard.displayName = "MetricCard";

const AnalyticsPanel = memo(({ title, items }: AnalyticsPanelProps) => {
  return (
    <div className="border-border from-secondary/10 to-card relative w-full overflow-hidden bg-gradient-to-b shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] rounded-lg p-4 border">
      <div className="bg-primary/20 absolute -top-10 left-0 h-16 w-full blur-2xl"></div>
      <h3 className="text-foreground text-lg font-medium mb-4">{title}</h3>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {items.map(([label, value], index) => (
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
  );
});

AnalyticsPanel.displayName = "AnalyticsPanel";

const AnalyticsOverlay = memo(({
  isVisible,
  data
}: AnalyticsOverlayProps) => {
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'pageviews'>('visitors');

  return (
    <div
      className={`w-full h-full flex flex-col ${isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }`}
    >
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-5">
          <h2 className="text-2xl text-foreground font-semibold">
            Analytics
          </h2>
          <div className="h-6 w-px bg-secondary" />
        </div>
      </div>

      <AnimationContainer animationType="fade" className="flex-1 flex flex-col gap-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Visitors"
            value={data.visitors}
            isActive={activeMetric === 'visitors'}
            onClick={() => setActiveMetric('visitors')}
          />
          <MetricCard
            label="Page Views"
            value={data.pageviews}
            isActive={activeMetric === 'pageviews'}
            onClick={() => setActiveMetric('pageviews')}
          />
          <div className="p-4 rounded-lg border bg-secondary/50">
            <div className="text-sm text-muted-foreground">Bounce Rate</div>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gradient-to-b from-background to-secondary rounded-lg p-4 border h-80">
          <h3 className="text-lg font-medium mb-4 capitalize">{activeMetric}</h3>
          <div className="h-64">
            <LineChart
              chartData={data.chart}
              metricType={activeMetric}
            />
          </div>
        </div>

        {/* Data Panels */}
        <div className="grid grid-cols-3 gap-6 flex-1">
          <AnalyticsPanel title="Pages" items={data.pages} />
          <AnalyticsPanel title="Devices" items={data.devices} />
          <AnalyticsPanel title="Referrers" items={data.referrers} />
          <AnalyticsPanel title="Browsers" items={data.browsers} />
          <AnalyticsPanel title="Countries" items={data.countries} />
          <AnalyticsPanel title="Operating Systems" items={data.oss} />
        </div>
      </AnimationContainer>
    </div>
  );
});

AnalyticsOverlay.displayName = "AnalyticsOverlay";

export default AnalyticsOverlay;
