import { useState, useEffect } from "react";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "@/features/traveler/services/destinationService";

const CATEGORIES = ["Trekking", "Cultural", "Wildlife", "Scenic"];
const emptyForm = { name: "", region: "", category: "Trekking", description: "", image_url: "", map_lat: "", map_lng: "" };

export default function DestinationsTable() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);        // add/edit modal
  const [editing, setEditing] = useState(null);     // null = add, object = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getDestinations()
      .then(data => { setDestinations(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  };

  const openEdit = (dest) => {
    setEditing(dest);
    setForm({
      name: dest.name,
      region: dest.region,
      category: dest.category,
      description: dest.description,
      image_url: dest.image,
      map_lat: dest.mapLat ?? "",
      map_lng: dest.mapLng ?? "",
    });
    setError("");
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.region || !form.category || !form.description || !form.image_url) {
      setError("All fields except coordinates are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateDestination(editing.id, form);
      } else {
        await createDestination(form);
      }
      setModal(false);
      load();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDestination(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Destinations</h2>
        <button onClick={openAdd}
          className="inline-flex items-center rounded-lg bg-[#10B981] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity">
           Add Destination
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left">Destination</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">Loading...</td></tr>
              ) : destinations.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">No destinations yet. Add one!</td></tr>
              ) : destinations.map(dest => (
                <tr key={dest.id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={dest.image} alt={dest.name}
                        className="h-10 w-10 rounded-lg object-cover grayscale-[0.35] hover:grayscale-0 transition duration-300" />
                      <span className="font-medium text-slate-900">{dest.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{dest.region}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {dest.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">⭐ {Number(dest.avgRating).toFixed(1)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(dest)}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(dest)}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-900 text-lg mb-5">
              {editing ? "Edit Destination" : "Add New Destination"}
            </h3>

            {error && <p className="text-red-500 text-xs mb-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Name *</label>
                <input type="text" value={form.name} onChange={set("name")} placeholder="e.g. Everest Base Camp"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Region *</label>
                <input type="text" value={form.region} onChange={set("region")} placeholder="e.g. Koshi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Category *</label>
                <select value={form.category} onChange={set("category")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description *</label>
                <textarea value={form.description} onChange={set("description")} rows={3}
                  placeholder="Describe this destination..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Image URL *</label>
                <input type="url" value={form.image_url} onChange={set("image_url")} placeholder="https://images.pexels.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Latitude</label>
                  <input type="number" step="any" value={form.map_lat} onChange={set("map_lat")} placeholder="28.0027"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Longitude</label>
                  <input type="number" step="any" value={form.map_lng} onChange={set("map_lng")} placeholder="86.8528"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#10B981" }}>
                {saving ? "Saving..." : editing ? "Update" : "Add Destination"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Destination?</h3>
            <p className="text-gray-500 text-sm mb-6">
              "{deleteConfirm.name}" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
