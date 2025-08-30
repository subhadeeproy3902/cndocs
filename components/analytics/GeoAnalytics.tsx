// components/analytics/GeoAnalytics.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Loading component for the map
const MapLoading = () => (
  <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg">
    <div className="text-muted-foreground">Loading map...</div>
  </div>
);

// Map component that only renders on client side
const LeafletMap = ({ points }: { points: GeoPoint[] }) => {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet only on client side
    import("leaflet").then((leaflet) => {
      // Dynamically add CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);
      
      // Fix default marker icon paths (Leaflet)
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      
      setL(leaflet.default);
    });
  }, []);

  if (!isClient || !L) {
    return <MapLoading />;
  }

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* circle markers scaled by traffic */}
      {points.slice(0, 30).map((p: GeoPoint, i: number) => (
        <Marker key={i} position={[p.lat, p.lng]}>
          <Popup>
            <div>
              <strong>{p.city ?? p.region ?? p.country ?? "Unknown"}</strong>
              <div>Visitors: {p.count}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default function GeoAnalytics({ data }: { data: GeoAnalyticsResponse }) {
  const points = data?.geo;

  // heatmap expects [lat, lng, intensity]
  const heatPoints = useMemo(() => points.map((p) => [p.lat, p.lng, p.count]), [points]);

  return (
    <div className="space-y-6">
      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {data.cities.map(([city, count]) => (
                <li key={city} className="flex justify-between text-sm">
                  <span className="truncate">{city}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Regions / States</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {data.regions.map(([region, count]) => (
                <li key={region} className="flex justify-between text-sm">
                  <span className="truncate">{region}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Full Map with pins + heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>World Map — User Locations</CardTitle>
        </CardHeader>
        <CardContent className="h-[520px]">
          <LeafletMap points={points} />
        </CardContent>
      </Card>
    </div>
  );
}
