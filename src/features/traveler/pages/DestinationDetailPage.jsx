/**
 * DestinationDetailPage.jsx
 * Full detail view for a single destination.
 *
 * Fetches the destination by ID from the backend.
 * Also fetches all packages and filters client-side to only show
 * ones linked to this destination (matched by destinationId).
 *
 * Sidebar: clickable package cards -> PackageDetailPage
 * Map: embedded Google Maps iframe using lat/lng from the destination data
 * Reviews: placeholder -> coming in Sprint 2
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDestinationById } from "../services/destinationService";
import { getPackages } from "../services/packageService";

// maps difficulty label to a color — defaults to gray if something unexpected comes in
const difficultyColor = (d) => ({
  Easy: "#10B981", Moderate: "#F59E0B", Challenging: "#EF4444", Hard: "#7C3AED"
}[d] || "#6B7280");

const DestinationDetailPage = () => {
  const { id } = useParams(); // destination ID from the URL
  const navigate = useNavigate();

  const [dest, setDest] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);     // for the main destination fetch
  const [pkgLoading, setPkgLoading] = useState(true); // separate loader for packages sidebar
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch the destination details
    getDestinationById(id)
      .then(data => { setDest(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });

    // fetch all packages, then filter to only this destination's packages
    getPackages()
      .then(all => {
        setPackages(all.filter(p => p.destinationId === parseInt(id)));
        setPkgLoading(false);
      })
      .catch(() => setPkgLoading(false)); // sidebar just stays empty on fail, no hard error
  }, [id]);

  // spinner while destination data is loading
  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  // something went wrong or ID doesn't exist
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

      {/* Hero image with gradient overlay and destination info on top */}
      <div className="relative h-80 overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        {/* dark gradient so text is readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <button onClick={() => navigate("/destinations")}
            className="text-white/70 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
            Back to Destinations
          </button>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              {/* category badge + name + region */}
              <span className="text-xs font-semibold text-white px-2 py-1 rounded-full mr-3"
                style={{ backgroundColor: "#10B981" }}>{dest.category}</span>
              <h1 className="text-4xl font-extrabold text-white mt-2">{dest.name}</h1>
              <p className="text-white/70 mt-1">📍 {dest.region}</p>
            </div>
            {/* average rating pill — toFixed(1) so it's always e.g. "4.5" not "4.521..." */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-white font-bold">{Number(dest.avgRating).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2/3 main content + 1/3 sidebar layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: description, map, reviews */}
        <div className="lg:col-span-2 space-y-8">

          {/* About section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this Destination</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{dest.description}</p>
          </div>

          {/* Google Maps embed — only renders if lat/lng exist in the data */}
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

          {/* Reviews placeholder — Sprint 2 TODO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Traveler Reviews</h2>
            <p className="text-gray-400 text-sm">Reviews coming in Sprint 2.</p>
          </div>
        </div>

        {/* Right sidebar: packages for this destination */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Available Packages</h2>

            {/* skeleton loading state for packages */}
            {pkgLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-20" />
                ))}
              </div>
            ) : packages.length === 0 ? (
              <p className="text-gray-400 text-sm mb-4">No packages available for this destination yet.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {packages.map(pkg => (
                  // clicking any package card goes to its detail page
                  <div key={pkg.id}
                    onClick={() => navigate(`/packages/${pkg.id}`)}
                    className="group cursor-pointer rounded-xl border border-gray-100 p-3 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all">
                    <div className="flex items-center gap-3">
                      <img src={pkg.image} alt={pkg.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                          {pkg.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">📅 {pkg.duration}d</span>
                          {/* difficulty badge color comes from difficultyColor() up top */}
                          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: difficultyColor(pkg.difficulty), fontSize: "10px" }}>
                            {pkg.difficulty}
                          </span>
                        </div>
                        {/* toLocaleString adds commas e.g. 1,200 instead of 1200 */}
                        <p className="text-xs font-bold mt-0.5" style={{ color: "#10B981" }}>
                          ${pkg.price?.toLocaleString()} <span className="font-normal text-gray-400">/ person</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* hover effect done inline since Tailwind can't handle dynamic color swaps easily */}
            <button onClick={() => navigate("/packages")}
              className="w-full text-center text-sm font-semibold py-2.5 rounded-xl border-2 transition-all hover:text-white"
              style={{ borderColor: "#10B981", color: "#10B981" }}
              onMouseEnter={e => { e.target.style.backgroundColor = "#10B981"; e.target.style.color = "white"; }}
              onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#10B981"; }}>
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