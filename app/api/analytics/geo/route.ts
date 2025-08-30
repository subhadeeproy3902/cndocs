// app/api/analytics/geo/route.ts
import { NextResponse } from "next/server";
import { runHogqlQuery } from "@/lib/hogql"; // use the same helper your project already uses

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30";

    const queries = {
      cities: `
        SELECT properties.$geoip_city_name AS city, uniqExact(distinct_id) AS count
        FROM events
        WHERE properties.$geoip_city_name != '' AND timestamp >= NOW() - toIntervalDay(${period})
        GROUP BY city
        ORDER BY count DESC
        
      `,
      regions: `
        SELECT properties.$geoip_subdivision_name as region, uniqExact(distinct_id) AS count
        FROM events
        WHERE properties.$geoip_subdivision_name != '' AND timestamp >= NOW() - toIntervalDay(${period})
        GROUP BY region
        ORDER BY count DESC
        
      `,
      geo: `
        SELECT
          properties.$geoip_latitude as lat,
          properties.$geoip_longitude as lng,
          properties.$geoip_city_name as city,
          properties.$geoip_subdivision_name as region,
          properties.$geoip_country_name as country,
          uniqExact(distinct_id) as count
        FROM events
        WHERE properties.$geoip_latitude IS NOT NULL
          AND properties.$geoip_longitude IS NOT NULL
          AND timestamp >= NOW() - toIntervalDay(${period})
        GROUP BY lat, lng, city, region, country
        ORDER BY count DESC
      `,
    };

    const [citiesRes, regionsRes, geoRes] = await Promise.all([
      runHogqlQuery(queries.cities),
      runHogqlQuery(queries.regions),
      runHogqlQuery(queries.geo),
    ]);

    const cities = (citiesRes?.results || []).map((r: any[]) => [String(r[0] ?? "Unknown"), Number(r[1] ?? 0)]) as [string, number][];
    const regions = (regionsRes?.results || []).map((r: any[]) => [String(r[0] ?? "Unknown"), Number(r[1] ?? 0)]) as [string, number][];
    const geo = (geoRes?.results || []).map((r: any[]) => ({
      lat: Number(r[0]),
      lng: Number(r[1]),
      city: r[2] ?? null,
      region: r[3] ?? null,
      country: r[4] ?? null,
      count: Number(r[5] ?? 0),
    }));

    return NextResponse.json({ cities, regions, geo });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
