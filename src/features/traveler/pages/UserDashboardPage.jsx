/**
 * UserDashboardPage.jsx
 * Personal dashboard with tabs for Bookings and Itineraries.
 *
 * My Bookings tab:
 *   Sprint 1 placeholder — shows a disabled preview of the real booking
 *   card UI with skeleton rows and status badges. Full implementation
 *   (fetching real bookings per user from backend) coming in Sprint 2.
 *
 * My Itineraries tab:
 *   Fully functional — links to the ItineraryPlannerPage.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// status badge styles — each booking status gets its own color combo
const STATUS_STYLE = {
  PENDING:   { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
  CONFIRMED: { bg: "#D1FAE5", text: "#065F46", label: "Confirmed" },
  REJECTED:  { bg: "#FEE2E2", text: "#991B1B", label: "Rejected" },
  CANCELLED: { bg: "#F1F5F9", text: "#475569", label: "Cancelled" },
};

// fake booking rows for the Sprint 1 disabled preview
// w1/w2 are just different widths so the skeleton looks more natural
const DUMMY_PREVIEW = [
  { id: 1, bookingId: "WN-2025-XXXX", status: "CONFIRMED", w1: "w-2/3", w2: "w-1/3" },
  { id: 2, bookingId: "WN-2025-XXXX", status: "PENDING",   w1: "w-1/2", w2: "w-2/5" },
  { id: 3, bookingId: "WN-2025-XXXX", status: "CANCELLED", w1: "w-3/4", w2: "w-1/4" },
];

const TABS = ["My Bookings", "My Itineraries"];

const UserDashboardPage = () => {
  const navigate = useNavigate();

  // pull user info from localStorage for the profile header
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tab, setTab] = useState("My Bookings");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* profile header — avatar uses initials from the user's name */}
      <div style={{ backgroundColor: "#0F172A" }} className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          {/* initials avatar — e.g. "John Doe" -> "JD" */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold text-white"
            style={{ backgroundColor: "#10B981" }}>
            {user.name?.split(" ").map(n => n[0]).join("") || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user.name || "Traveler"}</h1>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* tab bar — active tab gets the green underline */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === t ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">

        {/* MY BOOKINGS TAB  */}
        {tab === "My Bookings" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Your Bookings</h2>
              {/* reminder badge so users know this isn't live yet */}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                Available in Sprint 2
              </span>
            </div>

            {/* greyed-out preview of what real booking cards will look like
                pointer-events-none + opacity so it's visible but not interactive */}
            <div className="space-y-4 opacity-50 pointer-events-none select-none mb-6">
              {DUMMY_PREVIEW.map(b => {
                const style = STATUS_STYLE[b.status];
                return (
                  <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {/* placeholder booking ID */}
                        <span className="text-xs font-mono font-bold text-gray-300">{b.bookingId}</span>
                        {/* status badge using the STATUS_STYLE map */}
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: style.bg, color: style.text }}>
                          {style.label}
                        </span>
                      </div>
                      {/* skeleton lines — different widths to look more natural */}
                      <div className={`h-3.5 bg-gray-200 rounded ${b.w1} mb-2`} />
                      <div className="flex gap-3">
                        <div className={`h-3 bg-gray-100 rounded ${b.w2}`} />
                        <div className="h-3 bg-gray-100 rounded w-16" />
                      </div>
                    </div>
                    {/* placeholder action button */}
                    <div className="h-8 w-20 bg-gray-100 rounded-xl" />
                  </div>
                );
              })}
            </div>

            {/* nudge to browse packages while bookings aren't live yet */}
            <div className="text-center">
              <button onClick={() => navigate("/packages")}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10B981" }}>
                Browse Packages
              </button>
            </div>
          </div>
        )}

        {/*  MY ITINERARIES TAB  */}
        {tab === "My Itineraries" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Your Itineraries</h2>
              {/* shortcut to create a new one without going to the planner first */}
              <button onClick={() => navigate("/planner")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10B981" }}>
                + Create New
              </button>
            </div>

            {/* empty state — this tab is fully functional, just no itineraries saved yet */}
            <div className="text-center py-24">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 mb-4">No itineraries yet. Plan your own trip!</p>
              <button onClick={() => navigate("/planner")}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#10B981" }}>
                Open Itinerary Planner
              </button>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default UserDashboardPage;