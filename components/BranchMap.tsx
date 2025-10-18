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
    id: "geneva",
    name: "Geneva Headquarters",
    address: "Rue du Rhône 10",
    city: "Geneva",
    country: "Switzerland",
    phone: "+41 22 123 4567",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM CET",
    mapUrl: "https://maps.app.goo.gl/nnUpwPYdi3ZZ2RuA6",
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
    mapUrl: "https://maps.app.goo.gl/JrSt5811urXdGH4t9",
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
    mapUrl: "https://maps.app.goo.gl/DYr3je4YcSdvkEZbA",
    image: "/images/bulach-branch.jpg",
    description: "Regional office serving Zurich area clients."
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29301818.50165862!2d-119.27036339999994!3d26.297920500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d91ac26f28a3d5%3A0xb07cd60133f2ce2a!2sFinancial%20Concierge%20Solutions!5e0!3m2!1sen!2sng!4v1760810266777!5m2!1sen!2sng"
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
              Global Presence
            </h3>
            <p className="text-gray-700 text-sm">
              Serving clients across Switzerland and North America
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