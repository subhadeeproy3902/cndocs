declare module 'dom-to-image-more'

interface AnalyticsResponse {
  pages: [string, number][];
  devices: [string, number][];
  browsers: [string, number][];
  countries: [string, number][];
  referrers: [string, number][];
  oss: [string, number][];
  visitors: number;
  pageviews: number;
  bounceRate: number;
  chart: AnalyticsChartPoint[];
}

interface AnalyticsChartPoint {
  date: string; 
  visitors: number;
  pageviews: number;
}
