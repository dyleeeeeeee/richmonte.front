import { useState } from "react";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  hours: string;
  mapUrl: string;
  image: string;
  description: string;
}

const branches: Branch[] = [
  {
    id: "new-york",
    name: "New York Headquarters",
    address: "299 Park Avenue, 22nd Floor",
    city: "New York, NY",
    country: "USA",
    phone: "+1 (212) 555-0100",
    hours: "Mon-Fri: 8:00 AM – 6:00 PM ET",
    mapUrl: "https://maps.google.com/?q=299+Park+Avenue+New+York",
    image: "/images/new-york-branch.jpg",
    description: "Our flagship corporate headquarters in Midtown Manhattan."
  },
  {
    id: "coral-springs",
    name: "Coral Springs Branch",
    address: "5421 N University Dr",
    city: "Coral Springs, FL",
    country: "USA",
    phone: "+1 (954) 555-0100",
    hours: "Mon-Fri: 9:00 AM – 5:00 PM ET",
    mapUrl: "https://maps.app.goo.gl/JrSt5811urXdGH4t9",
    image: "/images/coral-springs-branch.jpg",
    description: "Full-service retail branch serving South Florida clients."
  },
  {
    id: "san-francisco",
    name: "San Francisco Office",
    address: "One Market Plaza, Spear Tower",
    city: "San Francisco, CA",
    country: "USA",
    phone: "+1 (415) 555-0100",
    hours: "Mon-Fri: 8:30 AM – 5:30 PM PT",
    mapUrl: "https://maps.google.com/?q=One+Market+Plaza+San+Francisco",
    image: "/images/san-francisco-branch.jpg",
    description: "West Coast wealth-management and trading desk."
  }
];

export default function BranchMap() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="relative h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d25232987.65!2d-98!3d39.5!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUnited%20States!5e0!3m2!1sen!2sus"
            title="InvBank US branch map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Map Title Overlay */}
          <div className="absolute top-6 left-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Nationwide Presence
            </h3>
            <p className="text-gray-700 text-sm">
              Serving clients across the United States
            </p>
          </div>
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
                branch.id === 'new-york' ? 'bg-navy-700' :
                branch.id === 'coral-springs' ? 'bg-navy-500' : 'bg-navy-400'
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
              onClick={() => window.open(branch.mapUrl, '_blank')}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}