"use client";

// The actual Leaflet picker. Only ever loaded in the browser (see LocationPicker.tsx).
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { DEFAULT_CENTER, pinIcon } from "./EventsMapInner";

export type LatLng = { lat: number; lng: number };

function ClickToPick({ onChange }: { onChange: (v: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LocationPickerInner({ value, onChange }: { value?: LatLng; onChange: (v: LatLng) => void }) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : DEFAULT_CENTER}
      zoom={value ? 14 : 11}
      scrollWheelZoom={false}
      className="z-0 h-64 w-full cursor-crosshair rounded-lg border sm:h-80"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPick onChange={onChange} />
      {value && <Marker position={[value.lat, value.lng]} icon={pinIcon} />}
    </MapContainer>
  );
}
