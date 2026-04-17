import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDestinationById } from "../services/destinationService";

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDestinationById(id)
      .then(data => { setDest(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (error || !dest) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-3">
        <p className="text-5xl">🏔️</p>
        <p className="text-gray-500">{error || "Destination not found."}</p>
        <button onClick={() => navigate("/destinations")} className="text-emerald-600 underline text-sm">Back to Destinations</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <button onClick={() => navigate("/destinations")}
            className="text-white/70 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
            ← Back to Destinations
          </button>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-semibold text-white px-2 py-1 rounded-full mr-3"
                style={{ backgroundColor: "#10B981" }}>{dest.category}</span>
              <h1 className="text-4xl font-extrabold text-white mt-2">{dest.name}</h1>
              <p className="text-white/70 mt-1">📍 {dest.region}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-white font-bold">{Number(dest.avgRating).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this Destination</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{dest.description}</p>
          </div>

          {/* Map */}
          {dest.mapLat && dest.mapLng && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>
              <iframe
                title="map"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${dest.mapLat},${dest.mapLng}&z=10&output=embed`}
              />
            </div>
          )}

          {/* Reviews — Sprint 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Traveler Reviews</h2>
            <p className="text-gray-400 text-sm">Reviews coming in Sprint 2.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Available Packages</h2>
            <p className="text-gray-400 text-sm mb-4">Packages coming soon.</p>
            <button onClick={() => navigate("/packages")}
              className="w-full text-center text-sm font-semibold py-2 rounded-xl border-2 transition-colors"
              style={{ borderColor: "#10B981", color: "#10B981" }}>
              View All Packages
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
