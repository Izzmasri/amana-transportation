"use client";

interface ScheduleTableProps {
  stops: {
    id: number;
    name: string;
    time: string;
    isNextStop: boolean;
  }[];
  selectedBus: string | null;
  onBusSelect: (bus: string) => void;
  buses: string[];
}

export default function ScheduleTable({ stops, selectedBus, onBusSelect, buses }: ScheduleTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Bus Selection Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
        {buses.map((bus) => (
          <button
            key={bus}
            onClick={() => onBusSelect(bus)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedBus === bus
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {bus}
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stop
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Arrival
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stops.length > 0 ? (
              stops.map((stop) => (
                <tr 
                  key={stop.id} 
                  className={stop.isNextStop ? 'bg-orange-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        stop.isNextStop ? 'bg-orange-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="text-sm font-medium text-gray-900">
                        {stop.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      stop.isNextStop ? 'text-orange-600 font-semibold' : 'text-gray-500'
                    }`}>
                      {stop.time}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  No schedule data available for this bus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white p-4 text-center text-sm">
        {new Date().getFullYear()} Amana Transportation. All rights reserved.
      </div>
    </div>
  );
}


