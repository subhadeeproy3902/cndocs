// app/api/analytics/performance/route.ts
import { NextResponse } from "next/server";
import { runHogqlQuery } from "@/lib/hogql";

export async function GET() {
  try {
    const query = `
      SELECT
          round((
              100.0 * sumIf(1, toFloat(properties.$web_vitals_LCP_value) <= 2.5) / count() +
              100.0 * sumIf(1, toFloat(properties.$web_vitals_INP_value) <= 0.2) / count() +
              100.0 * sumIf(1, toFloat(properties.$web_vitals_CLS_value) <= 0.1) / count() +
              100.0 * sumIf(1, toFloat(properties.$web_vitals_FID_value) <= 0.1) / count()
          ) / 4) AS overall_score,
          count() AS pageviews,
          (
              (
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_LCP_value) <= 2.5) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_INP_value) <= 0.2) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_CLS_value) <= 0.1) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_FID_value) <= 0.1) / count()
              ) / 4
          ) AS good_pct,
          (
              (
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_LCP_value) > 2.5 AND toFloat(properties.$web_vitals_LCP_value) <= 4) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_INP_value) > 0.2 AND toFloat(properties.$web_vitals_INP_value) <= 0.5) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_CLS_value) > 0.1 AND toFloat(properties.$web_vitals_CLS_value) <= 0.25) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_FID_value) > 0.1 AND toFloat(properties.$web_vitals_FID_value) <= 0.3) / count()
              ) / 4
          ) AS needs_improvement_pct,
          (
              (
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_LCP_value) > 4) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_INP_value) > 0.5) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_CLS_value) > 0.25) / count() +
                  100.0 * sumIf(1, toFloat(properties.$web_vitals_FID_value) > 0.3) / count()
              ) / 4
          ) AS poor_pct,
          round(avg(toFloat(properties.$web_vitals_LCP_value)), 2) AS lcp_value,
          'Largest Contentful Paint' AS lcp_label,
          round(avg(toFloat(properties.$web_vitals_INP_value)), 0) AS inp_value,
          'Interaction to Next Paint' AS inp_label,
          round(avg(toFloat(properties.$web_vitals_CLS_value)), 2) AS cls_value,
          'Cumulative Layout Shift' AS cls_label
      FROM events
      WHERE event = '$web_vitals'
        AND timestamp >= now() - INTERVAL 30 DAY
    `;

    const result = await runHogqlQuery(query);

    return NextResponse.json({
      overall_score: result.results?.[0]?.[0] ?? 0,
      pageviews: result.results?.[0]?.[1] ?? 0,
      good_pct: result.results?.[0]?.[2] ?? 0,
      needs_improvement_pct: result.results?.[0]?.[3] ?? 0,
      poor_pct: result.results?.[0]?.[4] ?? 0,
      lcp_value: result.results?.[0]?.[5] ?? 0,
      lcp_label: result.results?.[0]?.[6] ?? "LCP",
      inp_value: result.results?.[0]?.[7] ?? 0,
      inp_label: result.results?.[0]?.[8] ?? "INP",
      cls_value: result.results?.[0]?.[9] ?? 0,
      cls_label: result.results?.[0]?.[10] ?? "CLS",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
