import { useState, useEffect } from "react";
import { getPackages, createPackage, updatePackage, deletePackage } from "@/features/traveler/services/packageService";
import { getDestinations } from "@/features/traveler/services/destinationService";

const DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Hard"];
const diffColor = (d) => ({ Easy: "#10B981", Moderate: "#F59E0B", Challenging: "#EF4444", Hard: "#7C3AED" }[d] || "#6B7280");

const emptyForm = {
  destination_id: "", title: "", duration: "", max_people: "10",
  price: "", difficulty: "Moderate", image_url: "", description: "",
};

export default function PackagesTable() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getPackages(), getDestinations()])
      .then(([pkgs, dests]) => { setPackages(pkgs); setDestinations(dests); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setForm({
      destination_id: String(pkg.destinationId),
      title: pkg.title,
      duration: String(pkg.duration),
      max_people: String(pkg.maxPeople),
      price: String(pkg.price),
      difficulty: pkg.difficulty,
      image_url: pkg.image,
      description: pkg.description,
    });
    setError("");
    setModal(true);
  };

  const handleSave = async () => {
    const { destination_id, title, duration, max_people, price, difficulty, image_url, description } = form;
    if (!destination_id || !title || !duration || !price || !difficulty || !image_url || !description) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      destination_id: parseInt(destination_id),
      title, difficulty, image_url, description,
      duration: parseInt(duration),
      max_people: parseInt(max_people),
      price: parseFloat(price),
    };
    try {
      if (editing) {
        await updatePackage(editing.id, payload);
      } else {
        await createPackage(payload);
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
      await deletePackage(id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          Tour Packages ({packages.length})
        </h2>
        <button onClick={openAdd}
          className="inline-flex items-center rounded-lg bg-[#10B981] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity">
          Add Package
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 text-left">Package</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Max People</th>
                <th className="px-4 py-3 text-left">Price/Person</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Loading...</td></tr>
              ) : packages.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No packages yet. Add one!</td></tr>
              ) : packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={pkg.image} alt={pkg.title}
                        className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-900 max-w-xs truncate">{pkg.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{pkg.duration} days</td>
                  <td className="px-4 py-3.5 text-gray-600">{pkg.maxPeople}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">${pkg.price?.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: diffColor(pkg.difficulty) }}>
                      {pkg.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(pkg)}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(pkg)}
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
              {editing ? "Edit Package" : "Add New Package"}
            </h3>

            {error && <p className="text-red-500 text-xs mb-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Destination *</label>
                <select value={form.destination_id} onChange={set("destination_id")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400">
                  <option value="">Select a destination...</option>
                  {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Title *</label>
                <input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Everest Base Camp Trek"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Duration (days) *</label>
                  <input type="number" min={1} value={form.duration} onChange={set("duration")} placeholder="14"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Max People *</label>
                  <input type="number" min={1} value={form.max_people} onChange={set("max_people")} placeholder="10"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Price (USD) *</label>
                  <input type="number" min={0} step={0.01} value={form.price} onChange={set("price")} placeholder="1499"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Difficulty *</label>
                  <select value={form.difficulty} onChange={set("difficulty")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400">
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Image URL *</label>
                <input type="url" value={form.image_url} onChange={set("image_url")} placeholder="https://images.pexels.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description *</label>
                <textarea value={form.description} onChange={set("description")} rows={3}
                  placeholder="Describe this package..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none" />
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
                {saving ? "Saving..." : editing ? "Update" : "Add Package"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Package?</h3>
            <p className="text-gray-500 text-sm mb-6">"{deleteConfirm.title}" will be permanently deleted.</p>
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
