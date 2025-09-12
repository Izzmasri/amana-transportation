"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Lazy-load BusMap
const BusMap = dynamic(() => import("./BusMap"), { ssr: false });

const staticData = {
  "message": "Amana Transportation bus data retrieved successfully",
  "bus_lines": [
    {
      "id": 1,
      "name": "Bus 1",
      "bus_stops": [
        { "latitude": 3.1387, "longitude": 101.6169 },
        { "latitude": 3.1392, "longitude": 101.6173 },
        { "latitude": 3.1397, "longitude": 101.6177 }
      ],
      "current_location": { "latitude": 3.1392, "longitude": 101.6173 }
    },
    {
      "id": 2,
      "name": "Bus 2",
      "bus_stops": [
        { "latitude": 3.1402, "longitude": 101.6183 },
        { "latitude": 3.1407, "longitude": 101.6187 },
        { "latitude": 3.1412, "longitude": 101.6191 }
      ],
      "current_location": { "latitude": 3.1407, "longitude": 101.6187 }
    },
    {
      "id": 3,
      "name": "Bus 3",
      "bus_stops": [
        { "latitude": 3.1417, "longitude": 101.6197 },
        { "latitude": 3.1422, "longitude": 101.6201 },
        { "latitude": 3.1427, "longitude": 101.6205 }
      ],
      "current_location": { "latitude": 3.1422, "longitude": 101.6201 }
    },
    {
      "id": 4,
      "name": "Bus 4",
      "bus_stops": [
        { "latitude": 3.1432, "longitude": 101.6211 },
        { "latitude": 3.1437, "longitude": 101.6215 },
        { "latitude": 3.1442, "longitude": 101.6219 }
      ],
      "current_location": { "latitude": 3.1437, "longitude": 101.6215 }
    },
    {
      "id": 5,
      "name": "Bus 5",
      "bus_stops": [
        { "latitude": 3.1447, "longitude": 101.6225 },
        { "latitude": 3.1452, "longitude": 101.6229 },
        { "latitude": 3.1457, "longitude": 101.6233 }
      ],
      "current_location": { "latitude": 3.1452, "longitude": 101.6229 }
    }
  ],
  "operational_summary": {
    "total_buses": 5,
    "active_buses": 4,
    "maintenance_buses": 1,
    "out_of_service_buses": 0,
    "total_capacity": 215,
    "current_passengers": 117,
    "average_utilization": 53
  }
};

export default function Home() {
  const [activeBus, setActiveBus] = useState<number | null>(null);
  const [busData, setBusData] = useState<Array<any>>([]);

  useEffect(() => {
    // Use the static data instead of fetching
    setBusData(staticData.bus_lines);
    
    // Auto-refresh every 30s
    const interval = setInterval(() => {
      setBusData(prevData => {
        // Just update the current location slightly to simulate movement
        return prevData.map(bus => ({
          ...bus,
          current_location: {
            ...bus.current_location,
            latitude: bus.current_location.latitude + (Math.random() * 0.0001 - 0.00005),
            longitude: bus.current_location.longitude + (Math.random() * 0.0001 - 0.00005)
          }
        }));
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-900 text-white px-4 py-3">
        <div className="font-bold">Amana Logo</div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div>Active: {staticData.operational_summary.active_buses}/{staticData.operational_summary.total_buses} Buses</div>
            <div>Passengers: {staticData.operational_summary.current_passengers}/{staticData.operational_summary.total_capacity}</div>
          </div>
          <button className="bg-gray-700 px-4 py-2 rounded">Menu</button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-400 text-center py-10">
        <h1 className="text-3xl font-bold">Amana Transportation</h1>
        <p className="mt-2">
          Proudly Servicing Malaysian Bus Riders Since 2019!
        </p>
      </section>

      {/* Active Bus Map */}
      <section className="bg-yellow-100 text-center py-6">
        <h2 className="text-xl font-semibold mb-4">Active Bus Map</h2>

        {/* Bus buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveBus(null)}
            className={`px-4 py-2 rounded transition-colors ${
              activeBus === null
                ? "bg-green-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            All Buses
          </button>
          {busData.map((bus) => (
            <button
              key={bus.id}
              onClick={() => setActiveBus(bus.id)}
              className={`px-4 py-2 rounded transition-colors ${
                activeBus === bus.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {bus.name}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[600px] w-full">
              {busData.length > 0 ? (
                <BusMap 
                  routes={busData} 
                  activeRouteId={activeBus} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>Loading bus data...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
