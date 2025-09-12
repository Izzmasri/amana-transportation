"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icons
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61205.png",
  iconSize: [30, 30],
});

const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

interface BusMapProps {
  busStops: [number, number][];
  busPosition: [number, number];
}

export default function BusMap({ busStops, busPosition }: BusMapProps) {
  return (
    <div className="h-[400px] w-[90%] mx-auto rounded-lg overflow-hidden shadow">
      <MapContainer
        center={[3.0738, 101.5183]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Bus Stops */}
        {busStops.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={stopIcon} />
        ))}

        {/* Bus Marker */}
        <Marker position={busPosition} icon={busIcon} />

        {/* Route */}
        <Polyline positions={[...busStops, busPosition]} color="black" />
      </MapContainer>
    </div>
  );
}
