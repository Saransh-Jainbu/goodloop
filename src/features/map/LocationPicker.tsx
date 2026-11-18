"use client";
// OWNER: Samaksh. Contract: <LocationPicker value onChange />
export type LatLng = { lat: number; lng: number };

export function LocationPicker({ value, onChange }: { value?: LatLng; onChange: (v: LatLng) => void }) {
  return (
    <button
      type="button"
      className="h-48 w-full rounded-lg border bg-muted text-sm text-muted-foreground"
      onClick={() => onChange(value ?? { lat: 28.6139, lng: 77.209 })}
    >
      Location picker placeholder {value ? `(${value.lat}, ${value.lng})` : ""}
    </button>
  );
}
