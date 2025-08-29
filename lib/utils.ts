import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MetricType = "visitors" | "pageViews" | "bounceRate";

export const formatNumber = (value: number): string => {
  if (value >= 100000) {
    const millions = value / 1000000;
    return `${millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    const rounded = Math.round(thousands * 10) / 10;
    return `${rounded}K`;
  }
  return value.toString();
};

export const getDataKey = (
  metricType: MetricType
): keyof Pick<AnalyticsChartPoint, "visitors" | "pageviews"> => {
  return metricType === "pageViews" ? "pageviews" : "visitors"; // For bounceRate, we'll use visitors as fallback since it's not in chart data
};
