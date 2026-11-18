"use client";
// Contract: <LocationPicker value onChange />. Click the map to drop the pin.
// Leaflet needs the browser, so the real map is loaded with next/dynamic (ssr: false).
import dynamic from "next/dynamic";

export type LatLng = { lat: number; lng: number };

const Inner = dynamic(() => import("./LocationPickerInner").then((m) => m.LocationPickerInner), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-muted sm:h-80" aria-busy="true" />,
});

export function LocationPicker({ value, onChange }: { value?: LatLng; onChange: (v: LatLng) => void }) {
  return <Inner value={value} onChange={onChange} />;
}
