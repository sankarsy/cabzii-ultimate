"use client";

import PlaceAutocomplete from "./PlaceAutocomplete";

/**
 * City picker — Google Places (New) localities, not a hardcoded city list.
 */
export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "Search city…",
  className = "",
  inputClassName = ""
}) {
  return (
    <PlaceAutocomplete
      className={className}
      inputClassName={inputClassName}
      placeholder={placeholder}
      value={value}
      types="cities"
      allowCurrentLocation={false}
      onChange={(label) => {
        if (!String(label || "").trim()) onChange("");
      }}
      onResolved={(area) => {
        if (area?.label) {
          onChange(area.label, {
            placeId: area.placeId,
            lat: area.lat,
            lng: area.lng
          });
        }
      }}
    />
  );
}
