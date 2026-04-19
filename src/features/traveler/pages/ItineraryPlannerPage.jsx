/**
 * ItineraryPlannerPage.jsx
 * Lets logged-in users create and manage custom trip itineraries.
 *
 * State is persisted to localStorage ("wn_itineraries") so itineraries
 * survive page refreshes without a backend. Real API planned for Sprint 2.
 *
 * Modes:
 *  - "list"   -> shows all saved itineraries as cards
 *  - "create" -> blank form to build a new itinerary
 *  - "edit"   -> pre-filled form for an existing itinerary
 *
 * Each itinerary has: title, start/end dates, and a list of day entries
 * (day number, destination, activities).
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// fresh itinerary template — id uses Date.now() so it's always unique
const emptyItinerary = () => ({
  id: Date.now(),
  title: "",
  startDate: "",
  endDate: "",
  days: [{ dayNumber: 1, destination: "", activities: "" }],
});

const ItineraryPlannerPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [current, setCurrent] = useState(null); // itinerary being created/edited
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id of itinerary pending delete
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false); // brief success state for save button

  // load saved itineraries from localStorage on mount
  // TODO Sprint 2: swap this out for an API call
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wn_itineraries") || "[]");
    setItineraries(stored);
  }, []);

  // updates both state and localStorage together so they never go out of sync
  const persist = (updated) => {
    setItineraries(updated);
    localStorage.setItem("wn_itineraries", JSON.stringify(updated));
  };

  // set up a blank itinerary and switch to create mode
  const openCreate = () => {
    setCurrent(emptyItinerary());
    setErrors({});
    setSaved(false);
    setMode("create");
  };

  // deep copy the itinerary so edits don't mutate the list directly
  const openEdit = (itin) => {
    setCurrent({ ...itin, days: itin.days.map(d => ({ ...d })) });
    setErrors({});
    setSaved(false);
    setMode("edit");
  };

  const handleDelete = (id) => {
    persist(itineraries.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };

  // runs before saving — checks all required fields
  const validate = () => {
    const e = {};
    if (!current.title.trim()) e.title = "Title is required.";
    if (!current.startDate) e.startDate = "Start date is required.";
    if (!current.endDate) e.endDate = "End date is required.";
    // end date can't be before start date
    if (current.startDate && current.endDate && current.endDate < current.startDate)
      e.endDate = "End date must be after start date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (mode === "create") {
      persist([current, ...itineraries]); // newest first
    } else {
      // replace just the edited itinerary, keep the rest
      persist(itineraries.map(i => i.id === current.id ? current : i));
    }

    // brief "Saved!" flash before going back to list
    setSaved(true);
    setTimeout(() => { setMode("list"); setSaved(false); }, 800);
  };

  // updates a single field in a single day without touching the others
  const updateDay = (idx, field, value) => {
    setCurrent(c => ({
      ...c,
      days: c.days.map((d, i) => i === idx ? { ...d, [field]: value } : d),
    }));
  };

  const addDay = () => {
    setCurrent(c => ({
      ...c,
      days: [...c.days, { dayNumber: c.days.length + 1, destination: "", activities: "" }],
    }));
  };

  // removes a day and re-numbers the remaining ones so they stay sequential
  const removeDay = (idx) => {
    setCurrent(c => ({
      ...c,
      days: c.days.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 })),
    }));
  };

  // calculates trip length from dates if available, falls back to number of day entries
  const totalDays = (itin) => {
    if (!itin.startDate || !itin.endDate) return itin.days.length;
    const diff = Math.ceil((new Date(itin.endDate) - new Date(itin.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : itin.days.length;
  };

  // LIST VIEW 
  if (mode === "list") return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* dark header with create button */}
      <div style={{ backgroundColor: "#0F172A" }} className="py-12 px-6">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Itinerary Planner</h1>
            <p className="text-white/50 text-sm">Plan your own custom trip, day by day</p>
          </div>
          <button onClick={openCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#10B981" }}>
            + Create New Itinerary
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">

        {/* empty state — first time user */}
        {itineraries.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="text-gray-600 font-semibold mb-2">No itineraries yet</p>
            <p className="text-gray-400 text-sm mb-6">Create your first custom trip plan — add destinations and activities for each day.</p>
            <button onClick={openCreate}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981" }}>
              Create My First Itinerary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {itineraries.map(itin => (
              <div key={itin.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{itin.title}</h3>
                    {/* only show date range if both dates are set */}
                    {itin.startDate && itin.endDate && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(itin.startDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" → "}
                        {new Date(itin.endDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  {/* trip length badge */}
                  <span className="text-xs font-semibold px-2 py-1 rounded-full text-white shrink-0"
                    style={{ backgroundColor: "#10B981" }}>
                    {totalDays(itin)} days
                  </span>
                </div>

                {/* preview of first 3 days — shows destination name or dash if empty */}
                <div className="space-y-1.5 mb-4">
                  {itin.days.slice(0, 3).map(d => (
                    <div key={d.dayNumber} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                        {d.dayNumber}
                      </span>
                      <span className="truncate">{d.destination || "—"}</span>
                    </div>
                  ))}
                  {/* if more than 3 days, show overflow count */}
                  {itin.days.length > 3 && (
                    <p className="text-xs text-gray-400 pl-7">+{itin.days.length - 3} more days</p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(itin)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-colors"
                    style={{ borderColor: "#10B981", color: "#10B981" }}>
                    Edit
                  </button>
                  {/* sets deleteConfirm to this id, which triggers the modal */}
                  <button onClick={() => setDeleteConfirm(itin.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* delete confirmation modal — only shows when deleteConfirm is set */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Itinerary?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );

  // ---- CREATE / EDIT VIEW ---- (shared form for both modes)
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div style={{ backgroundColor: "#0F172A" }} className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setMode("list")}
            className="text-white/60 hover:text-white text-sm mb-3 flex items-center gap-1">
            Back to My Itineraries
          </button>
          {/* title changes based on mode */}
          <h1 className="text-2xl font-extrabold text-white">
            {mode === "create" ? "Create New Itinerary" : "Edit Itinerary"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 w-full">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

          {/* Trip title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Trip Title <span className="text-red-400">*</span>
            </label>
            <input type="text" placeholder="e.g. Nepal Adventure 2025"
              value={current.title}
              onChange={e => setCurrent(c => ({ ...c, title: e.target.value }))}
              // red border if validation failed
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-emerald-400"}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Start + end date side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={current.startDate}
                onChange={e => setCurrent(c => ({ ...c, startDate: e.target.value }))}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors.startDate ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                End Date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={current.endDate}
                onChange={e => setCurrent(c => ({ ...c, endDate: e.target.value }))}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors.endDate ? "border-red-300" : "border-gray-200 focus:border-emerald-400"}`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Day-by-day plan */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Day-by-Day Plan
              </label>
              <button onClick={addDay} type="button"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#10B981" }}>
                + Add Day
              </button>
            </div>

            <div className="space-y-3">
              {current.days.map((day, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2">
                      {/* day number bubble */}
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: "#10B981" }}>
                        {day.dayNumber}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">Day {day.dayNumber}</span>
                    </span>
                    {/* can't remove if it's the only day left */}
                    {current.days.length > 1 && (
                      <button onClick={() => removeDay(idx)} type="button"
                        className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Destination (e.g. Namche Bazaar)"
                      value={day.destination}
                      onChange={e => updateDay(idx, "destination", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white"
                    />
                    <textarea placeholder="Activities for this day..."
                      value={day.activities}
                      onChange={e => updateDay(idx, "activities", e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancel + Save row */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setMode("list")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            {/* button turns darker green and shows checkmark briefly after saving */}
            <button onClick={handleSave}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: saved ? "#059669" : "#10B981" }}>
              {saved ? "✓ Saved!" : mode === "create" ? "Save Itinerary" : "Update Itinerary"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItineraryPlannerPage;