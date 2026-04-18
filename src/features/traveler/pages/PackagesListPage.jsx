/**
 * PackagesListPage.jsx
 * Shows all tour packages with a keyword search bar.
 *
 * Search filters by title, description, and difficulty level.
 * Full filtering (price range, duration, difficulty buttons) planned for Sprint 2.
 * Data fetched from the backend via packageService.
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPackages } from "../services/packageService";

// maps difficulty label to a color — gray fallback if something unexpected comes in
const difficultyColor = (d) => {
  const map = { Easy: "#10B981", Moderate: "#F59E0B", Challenging: "#EF4444", Hard: "#7C3AED" };
  return map[d] || "#6B7280";
};

const PackagesListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);   // raw data from backend
  const [filtered, setFiltered] = useState([]);   // what actually shows on screen
  const [search, setSearch] = useState(searchParams.get("search") || ""); // pre-fill from URL if coming from homepage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch all packages once on mount
  useEffect(() => {
    getPackages()
      .then(data => { setPackages(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // re-filter whenever search text or the raw data changes
  useEffect(() => {
    // no search = show everything
    if (!search.trim()) {
      setFiltered(packages);
      return;
    }
    const q = search.toLowerCase();
    // searches title, description, and difficulty so "easy" or "trekking" both work
    setFiltered(packages.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.difficulty || "").toLowerCase().includes(q)
    ));
  }, [packages, search]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* dark header banner */}
      <div style={{ backgroundColor: "#0F172A" }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-1">Tour Packages</h1>
          <p className="text-white/50 text-sm">Find the perfect trip to suit your budget and pace</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">

        {/* search bar — filters title, description, difficulty */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-8 max-w-2xl">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search packages, difficulty, or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
          />
          {/* clear button only appears when there's something to clear */}
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">✕</button>
          )}
        </div>

        {/* backend error — usually XAMPP not running */}
        {error && (
          <div className="text-center py-10 text-red-500 text-sm">
            ⚠️ {error} — make sure XAMPP is running.
          </div>
        )}

        {/* live result count */}
        <p className="text-sm text-gray-500 mb-6">
          {loading ? "Loading..." : `${filtered.length} package${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* skeleton rows while loading */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm flex animate-pulse">
                <div className="w-56 h-44 bg-gray-200 shrink-0" />
                <div className="p-5 flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>

        ) : filtered.length === 0 ? (
          // empty state — lets them clear without retyping
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎒</p>
            <p className="text-gray-500">No packages match your search.</p>
            <button onClick={() => setSearch("")}
              className="mt-4 text-sm text-emerald-600 underline">Clear search</button>
          </div>

        ) : (
          // horizontal card layout — image on left, details on right
          <div className="space-y-4">
            {filtered.map(pkg => (
              // whole card is clickable — goes to package detail
              <div key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex cursor-pointer group"
                onClick={() => navigate(`/packages/${pkg.id}`)}>

                {/* package thumbnail — zooms on hover */}
                <div className="w-56 h-auto shrink-0 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* quick stats row */}
                    <div className="flex items-center gap-3 mb-2">
                      {/* difficulty badge — color from difficultyColor() */}
                      <span className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: difficultyColor(pkg.difficulty) }}>
                        {pkg.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">📅 {pkg.duration} days</span>
                      <span className="text-xs text-gray-400">👥 Max {pkg.maxPeople}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2">{pkg.title}</h3>
                    {/* line-clamp-2 keeps all cards the same height */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{pkg.description}</p>

                    {/* first 4 inclusions as little tags — "+X more" if there are extra */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(pkg.inclusions || []).slice(0, 4).map((inc, i) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-lg border border-gray-100">
                          ✓ {inc}
                        </span>
                      ))}
                      {(pkg.inclusions?.length || 0) > 4 && (
                        <span className="text-xs text-gray-400 px-2 py-1">+{pkg.inclusions.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* price + View Details button */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div>
                      <span className="text-2xl font-extrabold text-gray-900">${pkg.price?.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm"> / person</span>
                    </div>
                    {/* stopPropagation so the button click doesn't also fire the card's onClick */}
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/packages/${pkg.id}`); }}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#10B981" }}>
                      View Details
                    </button>
                  </div>
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

export default PackagesListPage;