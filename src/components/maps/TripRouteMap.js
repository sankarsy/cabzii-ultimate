"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
  }, [map, points]);
  return null;
}

export default function TripRouteMap({
  fromLat,
  fromLng,
  toLat,
  toLng,
  geometry = [],
  className = "h-44 w-full rounded-xl"
}) {
  const hasEndpoints =
    Number.isFinite(fromLat) &&
    Number.isFinite(fromLng) &&
    Number.isFinite(toLat) &&
    Number.isFinite(toLng);

  if (!hasEndpoints) {
    return (
      <div className={`flex items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500 ${className}`}>
        Map unavailable — select addresses from search
      </div>
    );
  }

  const line =
    geometry?.length >= 2
      ? geometry
      : [
          [fromLat, fromLng],
          [toLat, toLng]
        ];
  const center = [(fromLat + toLat) / 2, (fromLng + toLng) / 2];

  return (
    <div className={`overflow-hidden border border-slate-200 ${className}`}>
      <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="h-full w-full" style={{ minHeight: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={line} />
        <Marker position={[fromLat, fromLng]} icon={defaultIcon} />
        <Marker position={[toLat, toLng]} icon={defaultIcon} />
        <Polyline positions={line} pathOptions={{ color: "#0056D2", weight: 4, opacity: 0.85 }} />
      </MapContainer>
    </div>
  );
}
