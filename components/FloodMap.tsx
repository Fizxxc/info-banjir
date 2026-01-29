"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { LatLngTuple } from "leaflet";
import { MapContainerProps } from "react-leaflet";
import type { FloodReport } from "@/types";

const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false }
);
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});
const useMapEvents = dynamic(
  async () => (await import("react-leaflet")).useMapEvents,
  { ssr: false }
);

const levelColors: Record<string, string> = {
  orange: "#f97316",
  red: "#dc2626",
  yellow: "#facc15",
  green: "#22c55e",
  blue: "#38bdf8",
};

function ClickHandler({
  onSelect,
}: {
  onSelect: (position: LatLngTuple) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

export default function FloodMap({
  reports,
  selected,
  onSelect,
}: {
  reports: FloodReport[];
  selected: LatLngTuple | null;
  onSelect: (position: LatLngTuple) => void;
}) {
  const center: LatLngTuple = [-6.2383, 106.9756];
  const mapProps: MapContainerProps = useMemo(
    () => ({
      center,
      zoom: 12,
      scrollWheelZoom: true,
      style: { height: "100%", width: "100%" },
    }),
    []
  );

  return (
    <div className="map-wrapper">
      <MapContainer {...mapProps}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={onSelect} />
        {selected && (
          <Marker position={selected}>
            <Popup>Lokasi laporan yang dipilih</Popup>
          </Marker>
        )}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
          >
            <Popup>
              <strong>{report.title}</strong>
              <div>{report.description}</div>
              <div style={{ color: levelColors[report.level] }}>
                {report.level.toUpperCase()}
              </div>
              <div>{report.timeLabel}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
