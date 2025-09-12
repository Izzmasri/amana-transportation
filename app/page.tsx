"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy-load BusMap (fixes "window is not defined")
const BusMap = dynamic(() => import("./BusMap"), { ssr: false });

export default function Home() {
  // Example placeholder bus stops
  const busStops: [number, number][] = [
    [3.0738, 101.5183],
    [3.0838, 101.5283],
    [3.0938, 101.5383],
    [3.1038, 101.5483],
  ];

  // Bus state
  const [activeBus, setActiveBus] = useState(1);
  const busPosition: [number, number] = [3.0838, 101.5283]; // Example

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-900 text-white px-4 py-3">
        <div className="font-bold">Amana Logo</div>
        <button className="bg-gray-700 px-4 py-2 rounded">Menu</button>
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
          {Array.from({ length: 8 }, (_, i) => {
            const busNum = i + 1;
            return (
              <button
                key={busNum}
                onClick={() => setActiveBus(busNum)}
                className={`px-4 py-2 rounded transition-colors ${
                  activeBus === busNum
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Bus {busNum}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <BusMap busStops={busStops} busPosition={busPosition} />
      </section>
    </div>
  );
}
