"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  description: string;
}

const branches: Branch[] = [
  {
    id: "geneva",
    name: "Geneva Headquarters",
    address: "Rue du Rhône 10",
    city: "Geneva",
    country: "Switzerland",
    phone: "+41 22 123 4567",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM CET",
    coordinates: { lat: 46.2044, lng: 6.1432 },
    image: "/images/geneva-branch.jpg",
    description: "Our flagship headquarters in the heart of Geneva's financial district."
  },
  {
    id: "coral-springs",
    name: "Coral Springs Branch",
    address: "5421 N University Dr",
    city: "Coral Springs, FL",
    country: "USA",
    phone: "+1 954 555 0100",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM EST",
    coordinates: { lat: 26.2712, lng: -80.2706 },
    image: "/images/coral-springs-branch.jpg",
    description: "Serving our North American clientele with Swiss banking excellence."
  },
  {
    id: "bulach",
    name: "Bülach Branch",
    address: "Feldstrasse 60",
    city: "Bülach",
    country: "Switzerland",
    phone: "+41 44 123 4567",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM CET",
    coordinates: { lat: 47.5216, lng: 8.5405 },
    image: "/images/bulach-branch.jpg",
    description: "Regional office serving Zurich area clients."
  }
];

export default function BranchMap() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="relative h-96 bg-gradient-to-br from-gold-100 via-gold-50 to-neutral-100">
          {/* Simplified Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-60"></div>

          {/* World Map Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl">
              {/* Geneva Marker */}
              <div
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: '35%', left: '48%' }}
                onClick={() => setSelectedBranch(branches[0])}
              >
                <div className="relative">
                  <MapPin
                    size={32}
                    className="text-red-600 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-red-600/20 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-work-sans font-medium">
                  Geneva HQ
                </div>
              </div>

              {/* Coral Springs Marker */}
              <div
                className="absolute top-1/2 left-1/4 cursor-pointer group"
                style={{ top: '45%', left: '25%' }}
                onClick={() => setSelectedBranch(branches[1])}
              >
                <div className="relative">
                  <MapPin
                    size={32}
                    className="text-blue-600 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-600/20 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-work-sans font-medium">
                  Coral Springs
                </div>
              </div>

              {/* Bülach Marker */}
              <div
                className="absolute top-2/5 left-1/2 cursor-pointer group"
                style={{ top: '42%', left: '52%' }}
                onClick={() => setSelectedBranch(branches[2])}
              >
                <div className="relative">
                  <MapPin
                    size={28}
                    className="text-green-600 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-600/20 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-work-sans font-medium">
                  Bülach
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-gold-400 rounded-full opacity-60"></div>
                <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-gold-500 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-gold-300 rounded-full opacity-50"></div>
                <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 bg-gold-400 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>

          {/* Map Title */}
          <div className="absolute top-6 left-6 right-6">
            <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-2">
              Global Presence
            </h3>
            <p className="text-neutral-700 font-gruppo">
              Serving clients across Switzerland and North America
            </p>
          </div>
        </div>
      </div>

      {/* Branch Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={`glass border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 ${
              selectedBranch?.id === branch.id
                ? 'border-gold-400 shadow-lg shadow-gold-500/20'
                : 'border-gold-200/60 hover:border-gold-300'
            }`}
            onClick={() => setSelectedBranch(branch)}
          >
            {/* Branch Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-work-sans font-bold text-neutral-900 mb-1">
                  {branch.name}
                </h4>
                <p className="text-sm text-neutral-600 font-gruppo">
                  {branch.city}, {branch.country}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                branch.id === 'geneva' ? 'bg-red-500' :
                branch.id === 'coral-springs' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
            </div>

            {/* Branch Address */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 font-gruppo">
                  {branch.address}<br />
                  {branch.city}, {branch.country}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gold-600 flex-shrink-0" />
                <span className="text-sm text-neutral-700 font-gruppo">
                  {branch.phone}
                </span>
              </div>

              <div className="flex items-start space-x-2">
                <Clock size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 font-gruppo">
                  {branch.hours}
                </span>
              </div>
            </div>

            {/* Branch Description */}
            <p className="text-sm text-neutral-600 mt-4 font-gruppo leading-relaxed">
              {branch.description}
            </p>

            {/* Visit Branch Button */}
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-work-sans font-medium hover:from-gold-600 hover:to-gold-700 transition-all duration-300 flex items-center justify-center space-x-2 text-sm">
              <span>Visit Branch</span>
              <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Selected Branch Modal/Expanded View */}
      {selectedBranch && (
        <div className="mt-8 p-6 glass border-2 border-gold-400 rounded-xl">
          <div className="flex items-start space-x-6">
            {/* Branch Image Placeholder */}
            <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg flex items-center justify-center">
              <MapPin size={48} className="text-gold-600" />
            </div>

            {/* Branch Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-1">
                    {selectedBranch.name}
                  </h3>
                  <p className="text-neutral-700 font-gruppo">
                    {selectedBranch.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gold-600" />
                    <span className="text-sm text-neutral-700 font-gruppo">
                      {selectedBranch.address}, {selectedBranch.city}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gold-600" />
                    <span className="text-sm text-neutral-700 font-gruppo">
                      {selectedBranch.phone}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Clock size={16} className="text-gold-600 mt-0.5" />
                    <span className="text-sm text-neutral-700 font-gruppo">
                      {selectedBranch.hours}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-work-sans font-medium text-gold-700">
                      Coordinates:
                    </span>
                    <span className="text-sm text-neutral-600 font-gruppo">
                      {selectedBranch.coordinates.lat.toFixed(4)}, {selectedBranch.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
