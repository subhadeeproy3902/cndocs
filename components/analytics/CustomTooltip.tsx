"use client";

import { formatNumber } from "@/lib/utils";

type MetricType = "visitors" | "pageViews" | "bounceRate";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    color: string;
  }>;
  label?: string;
  metricType?: MetricType;
  metricLabels: { visitors: string; pageViews: string; bounceRate: string };
}

const CustomTooltip = ({
  active,
  payload,
  label,
  metricType,
  metricLabels,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const value =
      metricType === "bounceRate"
        ? `${payload[0].value}%`
        : formatNumber(payload[0].value);
    return (
      <div className="black-card gradient-before-rounded-sm rounded-sm p-3">
        <p className="text-xs text-muted-foreground mb-2">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 aspect-square rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className="text-xs text-foreground">
            {metricLabels[metricType || "visitors"]}: {value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
