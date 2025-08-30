import { NextResponse } from "next/server";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST!;
const PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID!;
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY!;

// Add the following to the query for dynamic URL filtering
// AND properties.$host = 'localhost:3001'

// Overall the query becomes like for example

// SELECT properties.$pathname as page, COUNT(*) as views 
// FROM events 
// WHERE event = '$pageview' 
//   AND properties.$host = '{projectHost}' 
//   AND timestamp >= NOW() - toIntervalDay(${period}) 
// GROUP BY page ORDER BY views DESC

// Where projectHost is the vercel deployed link (Maybe without https://)


// Helper for running a HogQL query
async function runHogqlQuery(query: string) {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
  });
  return res.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";

    const queries = {
      pages: `SELECT properties.$pathname as page, COUNT(*) as views FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY page ORDER BY views DESC`,
      devices: `SELECT properties.$device_type as device, COUNT(*) as count FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY device ORDER BY count DESC`,
      browsers: `SELECT properties.$browser as browser, COUNT(*) as count FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY browser ORDER BY count DESC`,
      countries: `SELECT properties.$geoip_country_name as country, COUNT(*) as count FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY country ORDER BY count DESC`,
      referrers: `SELECT properties.$referrer as referrer, COUNT(*) as count FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY referrer ORDER BY count DESC`,
      oss: `SELECT properties.$os as os, COUNT(*) as count FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period}) GROUP BY os ORDER BY count DESC`,

      visitors: `SELECT COUNT(DISTINCT person_id) as visitors FROM events WHERE timestamp >= NOW() - toIntervalDay(${period})`,
      pageviews: `SELECT COUNT(*) as pageviews FROM events WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period})`,
      bounceRate: `WITH session_pageviews AS (
        SELECT properties.$session_id as session_id, COUNT(*) as views
        FROM events
        WHERE event = '$pageview' AND timestamp >= NOW() - toIntervalDay(${period})
        GROUP BY session_id
      )
      SELECT ROUND(100.0 * SUM(CASE WHEN views = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) as bounce_rate FROM session_pageviews`,

      chart: `SELECT dateTrunc('day', toTimeZone(timestamp, 'Asia/Kolkata')) as date,
        COUNT(DISTINCT person_id) as visitors,
        countIf(event = '$pageview') as pageviews
        FROM events
        WHERE timestamp >= NOW() - toIntervalDay(${period})
        GROUP BY date ORDER BY date`,
    };

    const [
      pages,
      devices,
      browsers,
      countries,
      referrers,
      oss,
      visitors,
      pageviews,
      bounceRate,
      chart,
    ] = await Promise.all([
      runHogqlQuery(queries.pages),
      runHogqlQuery(queries.devices),
      runHogqlQuery(queries.browsers),
      runHogqlQuery(queries.countries),
      runHogqlQuery(queries.referrers),
      runHogqlQuery(queries.oss),
      runHogqlQuery(queries.visitors),
      runHogqlQuery(queries.pageviews),
      runHogqlQuery(queries.bounceRate),
      runHogqlQuery(queries.chart),
    ]);

    return NextResponse.json({
      pages: pages.results,
      devices: devices.results,
      browsers: browsers.results,
      countries: countries.results,
      referrers: referrers.results,
      oss: oss.results,
      visitors: visitors.results?.[0]?.[0] ?? 0,
      pageviews: pageviews.results?.[0]?.[0] ?? 0,
      bounceRate: bounceRate.results?.[0]?.[0] ?? 0,
      chart: chart.results.map((row: any[]) => ({
        date: row[0],
        visitors: row[1],
        pageviews: row[2],
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
