import { NextResponse } from "next/server";
import { runHogqlQuery } from "@/lib/hogql";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";

    const queries = {
      avgSessionDuration: `
        WITH session_times AS (
          SELECT 
            properties.$session_id as session_id,
            MIN(timestamp) as session_start,
            MAX(timestamp) as session_end
          FROM events
          WHERE event = '$pageview' 
            AND timestamp >= NOW() - toIntervalDay(${period})
          GROUP BY session_id
        )
        SELECT ROUND(AVG(dateDiff('second', session_start, session_end)), 0) as avg_duration_seconds 
        FROM session_times
      `,
      pagesPerSession: `
        WITH session_pageviews AS (
          SELECT 
            properties.$session_id as session_id,
            COUNT(*) as views
          FROM events
          WHERE event = '$pageview' 
            AND timestamp >= NOW() - toIntervalDay(${period})
          GROUP BY session_id
        )
        SELECT ROUND(AVG(views), 2) as avg_pages_per_session 
        FROM session_pageviews
      `,
      landingPages: `
        WITH ranked_pages AS (
          SELECT 
            properties.$session_id as session_id,
            properties.$pathname as page,
            timestamp,
            row_number() OVER (PARTITION BY properties.$session_id ORDER BY timestamp ASC) as rn
          FROM events
          WHERE event = '$pageview' 
            AND timestamp >= NOW() - toIntervalDay(${period})
        )
        SELECT page, COUNT(*) as count 
        FROM ranked_pages 
        WHERE rn = 1
        GROUP BY page
        ORDER BY count DESC
        
      `,
      exitPages: `
        WITH ranked_pages AS (
          SELECT 
            properties.$session_id as session_id,
            properties.$pathname as page,
            timestamp,
            row_number() OVER (PARTITION BY properties.$session_id ORDER BY timestamp DESC) as rn
          FROM events
          WHERE event = '$pageview' 
            AND timestamp >= NOW() - toIntervalDay(${period})
        )
        SELECT page, COUNT(*) as count 
        FROM ranked_pages 
        WHERE rn = 1
        GROUP BY page
        ORDER BY count DESC
        
      `
    };

    const [
      avgSessionDuration,
      pagesPerSession,
      landingPages,
      exitPages
    ] = await Promise.all([
      runHogqlQuery(queries.avgSessionDuration),
      runHogqlQuery(queries.pagesPerSession),
      runHogqlQuery(queries.landingPages),
      runHogqlQuery(queries.exitPages),
    ]);

    return NextResponse.json({
      avgSessionDuration: avgSessionDuration.results?.[0]?.[0] ?? 0,
      pagesPerSession: pagesPerSession.results?.[0]?.[0] ?? 0,
      landingPages: landingPages.results || [],
      exitPages: exitPages.results || []
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
