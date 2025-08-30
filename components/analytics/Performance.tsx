// components/analytics/PerformanceOverview.tsx
"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatMs(ms: number) {
  if (!ms) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
  return `${Math.round(ms)} ms`;
}

function formatCls(val: number) {
  if (val === 0) return "—";
  return val.toFixed(2);
}

export default function PerformanceOverview({ period = 30 }: { period?: number }) {
  const { data, error } = useSWR(
    `/api/analytics/performance?period=${period}`,
    fetcher,
    { refreshInterval: 15000 }
  );

  if (error) return <div className="p-4 text-red-500">Failed to load performance metrics.</div>;
  if (!data) return <div className="p-4">Loading performance overview…</div>;

  const {
    overall_score,
    good_pct,
    needs_improvement_pct,
    poor_pct,
    lcp_value,
    lcp_label,
    inp_value,
    inp_label,
    cls_value,
    cls_label,
  } = data;

  return (
    <div className="space-y-6">
      {/* Header / Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex items-center gap-6">
            {/* Circular Score Ring */}
            <div style={{ width: 120, height: 120 }}>
              <svg viewBox="0 0 36 36" className="w-full h-full text-white">
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray={`${overall_score}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <text
                  x="50%"
                  y="52%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="6"
                  fill="var(--color-primary)"
                  fontWeight={700}
                >
                  {overall_score}%
                </text>
              </svg>
            </div>

            <div>
              <div className="text-lg font-semibold">Overall Performance Score</div>
              <div className="text-sm text-muted-foreground max-w-xl">
                This score is based on the percentage of “good” samples across LCP, INP, and CLS in the last {period} days.
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded border bg-secondary/50">
              <div className="text-sm text-muted-foreground">Good</div>
              <div className="text-lg font-semibold">{good_pct.toFixed(1)}%</div>
            </div>
            <div className="p-4 rounded border bg-secondary/50">
              <div className="text-sm text-muted-foreground">Needs Improvement</div>
              <div className="text-lg font-semibold">{needs_improvement_pct.toFixed(1)}%</div>
            </div>
            <div className="p-4 rounded border bg-secondary/50">
              <div className="text-sm text-muted-foreground">Poor</div>
              <div className="text-lg font-semibold">{poor_pct.toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{lcp_label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMs(lcp_value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{inp_label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMs(inp_value)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{cls_label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCls(cls_value)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
