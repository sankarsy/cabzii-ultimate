"use client";

import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapTileConfig } from "../../lib/mapTiles";

const pickupIcon = L.divIcon({
  className: "cabzii-map-pin",
  html: '<span style="display:block;width:12px;height:12px;border-radius:999px;background:#16a34a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const dropIcon = L.divIcon({
  className: "cabzii-map-pin",
  html: '<span style="display:block;width:12px;height:12px;border-radius:999px;background:#dc2626;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const vehicleIcon = L.divIcon({
  className: "cabzii-vehicle-marker",
  html: '<span style="display:block;width:18px;height:18px;border-radius:999px;background:#0056D2;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

function isCoord(lat, lng) {
  return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
}

function FitPickupDrop({ pickup, drop }) {
  const map = useMap();
  const pickupLat = pickup?.[0];
  const pickupLng = pickup?.[1];
  const dropLat = drop?.[0];
  const dropLng = drop?.[1];

  useEffect(() => {
    const points = [];
    if (isCoord(pickupLat, pickupLng)) points.push([Number(pickupLat), Number(pickupLng)]);
    if (isCoord(dropLat, dropLng)) points.push([Number(dropLat), Number(dropLng)]);
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 13 });
    }
    map.invalidateSize();
  }, [map, pickupLat, pickupLng, dropLat, dropLng]);

  return null;
}

function InitialVehicleView({ lat, lng, hasRoute }) {
  const map = useMap();
  const lockedRef = useRef(false);

  useEffect(() => {
    if (hasRoute || lockedRef.current) return;
    if (!isCoord(lat, lng)) return;
    map.setView([Number(lat), Number(lng)], 13);
    lockedRef.current = true;
  }, [hasRoute, lat, lng, map]);

  return null;
}

function VehicleMarker({ lat, lng }) {
  const markerRef = useRef(null);
  const position = isCoord(lat, lng) ? [Number(lat), Number(lng)] : null;

  useEffect(() => {
    if (!position || !markerRef.current) return;
    markerRef.current.setLatLng(position);
  }, [lat, lng, position]);

  if (!position) return null;
  return <Marker ref={markerRef} position={position} icon={vehicleIcon} zIndexOffset={600} />;
}

export default function LiveTripMap({
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  vehicleLat,
  vehicleLng,
  className = "h-64 w-full rounded-xl"
}) {
  const tiles = mapTileConfig();
  const pickup = isCoord(pickupLat, pickupLng) ? [Number(pickupLat), Number(pickupLng)] : null;
  const drop = isCoord(dropLat, dropLng) ? [Number(dropLat), Number(dropLng)] : null;
  const vehicle = isCoord(vehicleLat, vehicleLng) ? [Number(vehicleLat), Number(vehicleLng)] : null;
  const hasRoute = Boolean(pickup || drop);
  const centerRef = useRef(null);

  if (!hasRoute && !vehicle) {
    return (
      <div className={`flex items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500 ${className}`}>
        Map unavailable
      </div>
    );
  }

  if (!centerRef.current) {
    centerRef.current = pickup || drop || vehicle;
  }

  return (
    <div className={`overflow-hidden border border-slate-200 bg-white ${className}`}>
      <MapContainer
        center={centerRef.current}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ minHeight: "100%" }}
      >
        <TileLayer attribution={tiles.attribution} url={tiles.url} />
        <FitPickupDrop pickup={pickup} drop={drop} />
        <InitialVehicleView lat={vehicleLat} lng={vehicleLng} hasRoute={hasRoute} />
        {pickup ? <Marker position={pickup} icon={pickupIcon} /> : null}
        {drop ? <Marker position={drop} icon={dropIcon} /> : null}
        <VehicleMarker lat={vehicleLat} lng={vehicleLng} />
      </MapContainer>
    </div>
  );
}
