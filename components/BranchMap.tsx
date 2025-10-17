import { useState, useEffect, useRef } from "react";
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
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapsLoadedRef = useRef(false);

  // Use a demo API key - users should replace with their own
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    // Prevent multiple loads
    if (googleMapsLoadedRef.current) return;

    if (!googleMapsApiKey || googleMapsApiKey === "") {
      setError("Please add your Google Maps API key");
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          createMap();
          return;
        }

        // Load Google Maps script dynamically
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          googleMapsLoadedRef.current = true;
          createMap();
        };
        
        script.onerror = () => {
          setError("Failed to load Google Maps. Please check your API key and internet connection.");
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
        setError("Failed to initialize Google Maps");
        setIsLoading(false);
      }
    };

    const createMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        // Map options
        const mapOptions = {
          center: { lat: 40.0, lng: -20.0 },
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
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        };

        // Create map
        const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
        setMap(googleMap);

        // Add markers
        const newMarkers: any[] = [];
        const bounds = new window.google.maps.LatLngBounds();

        branches.forEach((branch) => {
          const marker = new window.google.maps.Marker({
            position: branch.coordinates,
            map: googleMap,
            title: branch.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: branch.id === 'geneva' ? '#dc2626' : branch.id === 'coral-springs' ? '#2563eb' : '#16a34a',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            animation: window.google.maps.Animation.DROP
          });

          // Add click listener
          marker.addListener("click", () => {
            setSelectedBranch(branch);
            googleMap.panTo(branch.coordinates);
            googleMap.setZoom(12);
          });

          newMarkers.push(marker);
          bounds.extend(branch.coordinates);
        });

        setMarkers(newMarkers);
        googleMap.fitBounds(bounds);

        // Adjust zoom if too close
        const listener = window.google.maps.event.addListenerOnce(googleMap, "idle", () => {
          const currentZoom = googleMap.getZoom();
          if (currentZoom && currentZoom > 12) {
            googleMap.setZoom(12);
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error creating map:", err);
        setError("Failed to create map");
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update marker styling when branch is selected
  useEffect(() => {
    if (!map || markers.length === 0 || !window.google) return;

    markers.forEach((marker: any, index: number) => {
      const branch = branches[index];
      const isSelected = selectedBranch?.id === branch.id;

      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 12 : 10,
        fillColor: branch.id === 'geneva' ? '#dc2626' : branch.id === 'coral-springs' ? '#2563eb' : '#16a34a',
        fillOpacity: isSelected ? 1 : 0.9,
        strokeColor: '#ffffff',
        strokeWeight: isSelected ? 3 : 2
      });

      if (isSelected) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 2000);
      }
    });
  }, [selectedBranch, map, markers]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="relative h-96">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <span className="text-gray-600 font-medium">Loading map...</span>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Map Configuration Required
                </h3>
                <p className="text-gray-600 max-w-md">
                  {error}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Add your API key to the <code className="bg-gray-200 px-2 py-1 rounded">googleMapsApiKey</code> variable
                </p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}

          {/* Map Title Overlay */}
          {!error && (
            <div className="absolute top-6 left-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Global Presence
              </h3>
              <p className="text-gray-700 text-sm">
                Serving clients across Switzerland and North America
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Branch Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={`bg-white/80 backdrop-blur border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedBranch?.id === branch.id
                ? 'border-blue-400 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedBranch(branch)}
          >
            {/* Branch Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {branch.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {branch.city}, {branch.country}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                branch.id === 'geneva' ? 'bg-red-500' :
                branch.id === 'coral-springs' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
            </div>

            {/* Branch Details */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {branch.address}<br />
                  {branch.city}, {branch.country}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {branch.phone}
                </span>
              </div>

              <div className="flex items-start space-x-2">
                <Clock size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  {branch.hours}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              {branch.description}
            </p>

            {/* Visit Button */}
            <button
              onClick={() => window.open(`https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}`, '_blank')}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
            >
              <span>Visit Branch</span>
              <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Selected Branch Detail */}
      {selectedBranch && (
        <div className="mt-8 p-6 bg-white/80 backdrop-blur border-2 border-blue-400 rounded-xl shadow-lg">
          <div className="flex items-start space-x-6">
            {/* Icon Placeholder */}
            <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <MapPin size={48} className="text-blue-600" />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedBranch.name}
                  </h3>
                  <p className="text-gray-700">
                    {selectedBranch.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBranch(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl px-2"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {selectedBranch.address}, {selectedBranch.city}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {selectedBranch.phone}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Clock size={16} className="text-blue-600 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {selectedBranch.hours}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-700">
                      Coordinates:
                    </span>
                    <span className="text-sm text-gray-600">
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