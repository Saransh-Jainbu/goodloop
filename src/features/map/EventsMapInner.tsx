"use client";

// The actual Leaflet map. Only ever loaded in the browser (see EventsMap.tsx).
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { format } from "date-fns";
import { CauseBadge } from "@/features/discovery/cause";
import type { Event } from "@/features/events/types";

// A plain CSS dot, so we don't depend on Leaflet's default marker images (which break with bundlers).
export const pinIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#0f8a5f;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.45)"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

export const DEFAULT_CENTER: [number, number] = [28.6139, 77.209];

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 14);
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

export function EventsMapInner({ events }: { events: Event[] }) {
  const points = useMemo(() => events.map((e) => [e.lat, e.lng] as [number, number]), [events]);

  return (
    <MapContainer
      center={points[0] ?? DEFAULT_CENTER}
      zoom={12}
      scrollWheelZoom={false}
      dragging={!L.Browser.mobile} // one-finger drags scroll the page on phones instead of getting trapped
      className="z-0 h-72 w-full rounded-lg border sm:h-96"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {events.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={pinIcon}>
          <Popup>
            <div className="space-y-1">
              <CauseBadge cause={e.cause} />
              <br />
              <a href={`/events/${e.id}`} className="font-semibold text-emerald-700 hover:underline">
                {e.title}
              </a>
              <p className="text-xs text-gray-600">{format(e.startsAt, "EEE d MMM, h:mm a")}</p>
              <p className="text-xs text-gray-600">{e.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
