import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDestinations } from "../services/destinationService";

const CATEGORIES = ["All", "Trekking", "Cultural", "Wildlife", "Scenic"];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}>★</span>
    ))}
    <span className="text-xs text-gray-500 ml-1">{Number(rating).toFixed(1)}</span>
  </div>
);

const DestinationsListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDestinations()
      .then(data => { setDestinations(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = destinations;
    if (category !== "All") result = result.filter(d => d.category === category);
    if (search.trim()) result = result.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.region.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [destinations, search, category]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div style={{ backgroundColor: "#0F172A" }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-1">Explore Destinations</h1>
          <p className="text-white/50 text-sm">Discover Nepal's most breathtaking places</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 shadow-sm">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search destinations or regions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
            />
            {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">✕</button>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  category === cat ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                }`}
                style={category === cat ? { backgroundColor: "#10B981", borderColor: "#10B981" } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">
            ⚠️ {error} — make sure XAMPP is running.
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          {loading ? "Loading..." : `${filtered.length} destination${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🏔️</p>
            <p className="text-gray-500">No destinations match your search.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-4 text-sm text-emerald-600 underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dest => (
              <div key={dest.id}
                onClick={() => navigate(`/destinations/${dest.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#10B981" }}>
                    {dest.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{dest.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">📍 {dest.region}</p>
                  <StarRating rating={dest.avgRating} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DestinationsListPage;
