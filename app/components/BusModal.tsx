"use client";

import { X } from 'lucide-react';

interface BusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: {
    id: number;
    name: string;
    status: string;
    capacity: number;
    currentPassengers: number;
    nextStop: string;
  } | null;
}

export default function BusModal({ isOpen, onClose, bus }: BusModalProps) {
  if (!isOpen || !bus) return null;

  // Calculate capacity percentage
  const capacityPercentage = Math.round((bus.currentPassengers / bus.capacity) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{bus.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              bus.status === 'In Service' ? 'bg-green-500' : 
              bus.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-700">Status: <span className="font-medium">{bus.status}</span></span>
          </div>
          
          {/* Capacity */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Capacity</span>
              <span className="text-sm text-gray-500">{bus.currentPassengers}/{bus.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-blue-600" 
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Next Stop */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Stop</p>
                <p className="font-medium">{bus.nextStop}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
