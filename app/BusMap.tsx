"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { useState, useEffect, useRef } from 'react';

// Icons// Bus Icon - Simple black bus icon
const busIcon = L.divIcon({
  className: 'bus-icon',
  html: `
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <svg viewBox="0 0 24 24" width="24" height="24" style="fill: #000000;">
        <path d="M17 20H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H2V8h1V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3h1v4h-2v9a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zM5 5v9h14V5H5zm0 11v2h4v-2H5zm10 0v2h4v-2h-4z"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

const stopIcon = L.divIcon({
  className: 'bus-stop-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  html: '<div class="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>'
});

const stopIconSelected = L.divIcon({
  className: 'bus-stop-icon-selected',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: '<div class="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg"></div>'
});

// Add some CSS for the markers
const mapStyles = `
  .bus-stop-icon { background: transparent !important; border: none !important; }
  .bus-stop-icon-selected { background: transparent !important; border: none !important; }
  .leaflet-popup-content {
    margin: 10px 12px;
  }
`;

// Component to auto-fit the map to show all markers
// Update the FitBounds component to accept padding prop
// Update the FitBounds component to use useMemo for padding
function FitBounds({ 
    positions, 
    padding = [50, 50] 
  }: { 
    positions: LatLngTuple[]; 
    padding?: [number, number]; 
  }) {
    const map = useMap();
    const memoizedPadding = React.useMemo(() => padding, [padding[0], padding[1]]);
    
    useEffect(() => {
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: memoizedPadding });
      }
    }, [map, positions, memoizedPadding]);
    
    return null;
  }

interface BusStop {
  latitude: number;
  longitude: number;
  name?: string;
}

interface BusRoute {
  id: number;
  name: string;
  bus_stops: BusStop[];
  current_location: {
    latitude: number;
    longitude: number;
  };
}

interface BusMapProps {
  routes: BusRoute[];
  activeRouteId: number | null;
}

export default function BusMap({ routes, activeRouteId }: BusMapProps) {
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const mapRef = useRef<L.Map>(null);

  // Get all bus stops from all routes or just the active route
  const allStops = activeRouteId
    ? routes.find(route => route.id === activeRouteId)?.bus_stops || []
    : routes.flatMap(route => route.bus_stops);
  
  // Get the active route if one is selected
  const activeRoute = activeRouteId 
    ? routes.find(route => route.id === activeRouteId)
    : null;

  // Get routes to show buses for (all or just the active one)
  const visibleBuses = activeRouteId
    ? routes.filter(route => route.id === activeRouteId)
    : routes;

  // Prepare positions for the complete route
  const routePositions: LatLngTuple[] = allStops.map(stop => [
    stop.latitude,
    stop.longitude
  ]);

  // Handle marker click
  const handleMarkerClick = (index: number) => {
    setSelectedStop(selectedStop === index ? null : index);
  };

  // Calculate bounds to fit all markers
  const calculateBounds = (): LatLngTuple[] => {
    const lats = allStops.map(stop => stop.latitude);
    const lngs = allStops.map(stop => stop.longitude);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <style>{mapStyles}</style>
      
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {activeRoute ? activeRoute.name : 'All Bus Routes'}
          </h3>
          <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
            In Service
          </span>
        </div>
      </div>
      
      <MapContainer
        center={[3.1417, 101.6197]} // Center of all the points
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-fit the map to show all markers */}
        <FitBounds positions={calculateBounds()} padding={[50, 50]} />

        {/* Main Route Line - Connect all points */}
        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Bus Stops */}
        {allStops.map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            position={[stop.latitude, stop.longitude]}
            icon={selectedStop === index ? stopIconSelected : stopIcon}
            eventHandlers={{
              click: () => handleMarkerClick(index),
            }}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h4 className="font-bold text-base mb-1">
                  {stop.name || `Stop ${index + 1}`}
                </h4>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus Positions - Only show visible buses */}
        {visibleBuses.map((bus) => (
          <Marker 
            key={`bus-${bus.id}`}
            position={[bus.current_location.latitude, bus.current_location.longitude]}
            icon={busIcon}
          >
            <Popup>
              <div className="text-center">
                <h4 className="font-bold">{bus.name}</h4>
                <p className="text-sm">Status: In Service</p>
                <p className="text-xs mt-1">
                  {bus.current_location.latitude.toFixed(4)}, {bus.current_location.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
