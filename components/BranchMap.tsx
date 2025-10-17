"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // Google Maps API Key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!googleMapsApiKey) {
      console.error("Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file");
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        // Load Google Maps
        const loader = new Loader({
          apiKey: googleMapsApiKey,
          version: "weekly",
          libraries: ["places"]
        });

        const { Map } = await loader.importLibrary("maps");

        // Map options - center on Europe/North America
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 40.0, lng: -20.0 }, // Centered between US and Europe
          zoom: 3,
          styles: [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }, { lightness: 17 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 18 }]
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 16 }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#dedede" }, { lightness: 21 }]
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }]
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }]
            },
            {
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#f2f2f2" }, { lightness: 19 }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#fefefe" }, { lightness: 20 }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        };

        if (mapRef.current) {
          const googleMap = new Map(mapRef.current, mapOptions);
          setMap(googleMap);

          // Add markers for each branch
          const newMarkers: google.maps.Marker[] = [];

          branches.forEach((branch, index) => {
            const marker = new google.maps.Marker({
              position: branch.coordinates,
              map: googleMap,
              title: branch.name,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="${
                      branch.id === 'geneva' ? '#dc2626' :
                      branch.id === 'coral-springs' ? '#2563eb' : '#16a34a'
                    }" opacity="0.9"/>
                    <circle cx="16" cy="16" r="8" fill="${
                      branch.id === 'geneva' ? '#dc2626' :
                      branch.id === 'coral-springs' ? '#2563eb' : '#16a34a'
                    }"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
              },
              animation: google.maps.Animation.DROP
            });

            // Add click listener
            marker.addListener("click", () => {
              setSelectedBranch(branch);
              googleMap.panTo(branch.coordinates);
              googleMap.setZoom(12);
            });

            newMarkers.push(marker);
          });

          setMarkers(newMarkers);

          // Fit map to show all markers
          const bounds = new google.maps.LatLngBounds();
          branches.forEach(branch => bounds.extend(branch.coordinates));
          googleMap.fitBounds(bounds);

          // Adjust zoom if too close
          const listener = google.maps.event.addListener(googleMap, "idle", () => {
            if (googleMap.getZoom() && googleMap.getZoom()! > 12) {
              googleMap.setZoom(12);
            }
            google.maps.event.removeListener(listener);
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, [googleMapsApiKey]);

  // Update selected marker styling
  useEffect(() => {
    if (!map || markers.length === 0) return;

    markers.forEach((marker, index) => {
      const branch = branches[index];
      const isSelected = selectedBranch?.id === branch.id;

      marker.setIcon({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="${
              branch.id === 'geneva' ? '#dc2626' :
              branch.id === 'coral-springs' ? '#2563eb' : '#16a34a'
            }" opacity="${isSelected ? '1' : '0.9'}"/>
            <circle cx="16" cy="16" r="${isSelected ? '10' : '8'}" fill="${
              branch.id === 'geneva' ? '#dc2626' :
              branch.id === 'coral-springs' ? '#2563eb' : '#16a34a'
            }"/>
            <circle cx="16" cy="16" r="${isSelected ? '5' : '4'}" fill="white"/>
            ${isSelected ? '<circle cx="16" cy="16" r="14" fill="none" stroke="white" stroke-width="2"/>' : ''}
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(isSelected ? 36 : 32, isSelected ? 36 : 32),
        anchor: new google.maps.Point(isSelected ? 18 : 16, isSelected ? 36 : 32)
      });
    });
  }, [selectedBranch, map, markers]);

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="relative h-96 bg-gradient-to-br from-gold-100 via-gold-50 to-neutral-100">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-neutral-600 font-gruppo">Loading map...</span>
            </div>
          ) : !googleMapsApiKey ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-work-sans font-semibold text-neutral-900 mb-2">
                  Google Maps Not Configured
                </h3>
                <p className="text-neutral-600 font-gruppo max-w-md">
                  Please add your Google Maps API key to <code className="bg-neutral-100 px-2 py-1 rounded text-sm">.env.local</code> file.
                </p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full rounded-2xl" />
          )}

          {/* Map Title */}
          <div className="absolute top-6 left-6 right-6 z-10">
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
