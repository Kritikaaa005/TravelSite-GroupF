import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPackageById, getDestinationById } from "@/api";

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState(1);
  const [numPersons, setNumPersons] = useState(1);

  useEffect(() => {
    getPackageById(id).then(async p => {
      setPkg(p);
      if (p?.destinationId) {
        const d = await getDestinationById(p.destinationId);
        setDest(d);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!pkg) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-3">
        <p className="text-5xl">🎒</p>
        <p className="text-gray-500">Package not found.</p>
        <button onClick={() => navigate("/packages")} className="text-emerald-600 underline text-sm">Back to Packages</button>
      </div>
    </div>
  );

  const difficultyColor = { Easy: "#10B981", Moderate: "#F59E0B", Challenging: "#EF4444", Hard: "#7C3AED" };
  const estimatedTotal = pkg.price * numPersons;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <button onClick={() => navigate("/packages")}
            className="text-white/70 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
             Back to Packages
          </button>
          <div className="flex items-end gap-4 flex-wrap">
            <span className="text-xs font-semibold text-white px-2 py-1 rounded-full"
              style={{ backgroundColor: difficultyColor[pkg.difficulty] || "#6B7280" }}>
              {pkg.difficulty}
            </span>
            <h1 className="text-3xl font-extrabold text-white">{pkg.title}</h1>
          </div>
          <div className="flex gap-6 mt-2">
            <span className="text-white/70 text-sm">📅 {pkg.duration} days</span>
            <span className="text-white/70 text-sm">👥 Max {pkg.maxPeople} people</span>
            {dest && <span className="text-white/70 text-sm">📍 {dest.name}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Overview</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>
          </div>

          {/* Itinerary accordion */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Day-by-Day Itinerary</h2>
            <div className="space-y-2">
              {(pkg.itinerary || []).map(day => (
                <div key={day.day}
                  className={`rounded-xl border transition-all ${openDay === day.day ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenDay(openDay === day.day ? null : day.day)}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: "#10B981" }}>
                        {day.day}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">{day.title}</span>
                    </div>
                    <span className="text-gray-400 text-lg">{openDay === day.day ? "−" : "+"}</span>
                  </button>
                  {openDay === day.day && (
                    <div className="px-5 pb-4">
                      <p className="text-gray-600 text-sm leading-relaxed pl-11">{day.activities}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-2">
                {pkg.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    {inc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="text-center pb-5 border-b border-gray-100 mb-5">
              <span className="text-3xl font-extrabold text-gray-900">${pkg.price.toLocaleString()}</span>
              <span className="text-gray-400 text-sm"> / person</span>
            </div>

            {/* Trip cost estimator */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Trip Cost Estimator
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => setNumPersons(Math.max(1, numPersons - 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold text-lg hover:border-emerald-400 transition-colors flex items-center justify-center">−</button>
                <div className="flex-1 text-center">
                  <span className="font-bold text-gray-900 text-lg">{numPersons}</span>
                  <p className="text-xs text-gray-400">{numPersons === 1 ? "person" : "people"}</p>
                </div>
                <button onClick={() => setNumPersons(Math.min(pkg.maxPeople, numPersons + 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 text-gray-600 font-bold text-lg hover:border-emerald-400 transition-colors flex items-center justify-center">+</button>
              </div>
              <div className="mt-3 bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Estimated Total</p>
                <p className="text-xl font-extrabold" style={{ color: "#10B981" }}>${estimatedTotal.toLocaleString()}</p>
           
              </div>
            </div>

            <button
              onClick={() => navigate(`/book/${pkg.id}`)}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981" }}>
              Book Now
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">No payment required — confirm your trip details first.</p>

            {/* Quick info */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-900">{pkg.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Group size</span>
                <span className="font-semibold text-gray-900">Max {pkg.maxPeople}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Difficulty</span>
                <span className="font-semibold" style={{ color: difficultyColor[pkg.difficulty] }}>
                  {pkg.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetailPage;