"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapTileConfig } from "../../lib/mapTiles";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const compactIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [18, 29],
  iconAnchor: [9, 29],
  popupAnchor: [1, -24],
  shadowSize: [29, 29]
});

function FitBounds({ points, compact = false }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: compact ? [12, 12] : [28, 28], maxZoom: compact ? 11 : 13 });
    map.invalidateSize();
  }, [map, points, compact]);
  return null;
}

export default function TripRouteMap({
  fromLat,
  fromLng,
  toLat,
  toLng,
  geometry = [],
  className = "h-44 w-full rounded-xl",
  compact = false
}) {
  const hasEndpoints =
    Number.isFinite(fromLat) &&
    Number.isFinite(fromLng) &&
    Number.isFinite(toLat) &&
    Number.isFinite(toLng);

  if (!hasEndpoints) {
    return (
      <div className={`flex items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-[10px] text-slate-500 ${className}`}>
        Map unavailable
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
  const icon = compact ? compactIcon : defaultIcon;
  const tiles = mapTileConfig();

  return (
    <div className={`overflow-hidden border border-slate-200 ${className}`}>
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        zoomControl={!compact}
        attributionControl={!compact}
        className="h-full w-full"
        style={{ minHeight: "100%" }}
      >
        <TileLayer attribution={tiles.attribution} url={tiles.url} />
        <FitBounds points={line} compact={compact} />
        <Marker position={[fromLat, fromLng]} icon={icon} />
        <Marker position={[toLat, toLng]} icon={icon} />
        <Polyline positions={line} pathOptions={{ color: "#0056D2", weight: compact ? 3 : 4, opacity: 0.9 }} />
      </MapContainer>
    </div>
  );
}
