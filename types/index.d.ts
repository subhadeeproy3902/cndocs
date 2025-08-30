declare module 'dom-to-image-more'
declare module 'react-leaflet-heatmap-layer-v3'

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

interface SessionAnalyticsResponse {
  avgSessionDuration: number; // in seconds
  pagesPerSession: number;
  landingPages: [string, number][];
  exitPages: [string, number][];
}

interface GeoPoint {
  lat: number;
  lng: number;
  count: number;
  city?: string | null;
  region?: string | null;
  country?: string | null;
}

interface GeoAnalyticsResponse {
  cities: [string, number][];   // [city, count]
  regions: [string, number][];  // [region, count]
  geo: GeoPoint[];              // lat/lng/count + optional city/region/country
}

interface MetricDistribution {
  name: "LCP" | "CLS" | "FID" | "INP";
  avg: number;
  good: number;
  needs: number;
  poor: number;
  total: number;
}

interface Thresholds {
  good: number;
  needs: number;
}

interface PerformanceContext {
  lcp: Thresholds;
  cls: Thresholds;
  fid: Thresholds;
  inp: Thresholds;
}

interface PerformanceResponse {
  overallScore: number;
  periodDays: number;
  metrics: MetricDistribution[];
  context: PerformanceContext;
}
