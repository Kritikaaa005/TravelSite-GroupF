/**
 * BookingFormPage.jsx
 * Sprint 1 placeholder for the booking form.
 *
 * Shows a visually accurate but fully disabled form so reviewers can
 * see the intended UI layout. All inputs are non-interactive (opacity-50,
 * pointer-events-none). An "Available in Sprint 2" badge makes the status clear.
 *
 * Full booking implementation (POST to backend, confirmation flow) is planned
 * for Sprint 2.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getPackageById } from "../services/packageService";

const BookingFormPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackageById(packageId)
      .then(p => { setPkg(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [packageId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div style={{ backgroundColor: "#0F172A" }} className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(`/packages/${packageId}`)}
            className="text-white/60 hover:text-white text-sm mb-3 flex items-center gap-1">
             Back to Package
          </button>
          <h1 className="text-2xl font-extrabold text-white">Book Your Trip</h1>
          {pkg && <p className="text-white/50 text-sm mt-1">{pkg.title}</p>}

          {/* Step indicator — disabled */}
          <div className="flex items-center gap-3 mt-5">
            {["Trip Details", "Review & Confirm"].map((label, i) => (
              <div key={i} className="flex items-center gap-2 opacity-40">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white/50">
                  {i + 1}
                </div>
                <span className="text-sm text-white/50">{label}</span>
                {i < 1 && <span className="text-white/20 mx-1">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Disabled form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 text-base">Trip Details</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Available in Sprint 2
                </span>
              </div>

              <div className="space-y-5 opacity-50 pointer-events-none select-none">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    Travel Date <span className="text-red-400">*</span>
                  </label>
                  <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-300 bg-gray-50">
                    Pick a date...
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Minimum 3 days from today</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    Number of Persons <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-300 font-bold">−</div>
                    <div className="w-20 text-center border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-300 bg-gray-50">1</div>
                    <div className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-300 font-bold">+</div>
                    {pkg && <span className="text-xs text-gray-300">Max: {pkg.maxPeople}</span>}
                  </div>
                </div>

                <hr className="border-gray-100" />
                <h3 className="font-semibold text-gray-400 text-sm">Emergency Contact</h3>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    Contact Name <span className="text-red-400">*</span>
                  </label>
                  <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-300 bg-gray-50">
                    Full name...
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    Contact Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-300 bg-gray-50">
                    +977-98XXXXXXXX
                  </div>
                </div>

                <div className="w-full py-3 rounded-xl text-white text-sm font-bold text-center bg-emerald-300 cursor-not-allowed">
                  Review Booking →
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-5 border-t border-gray-100 pt-4">
                Full booking implementation in Sprint 2.
              </p>
            </div>
          </div>

          {/* Package summary card */}
          {pkg && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm sticky top-24">
                <img src={pkg.image} alt={pkg.title} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm">{pkg.title}</h3>
                  <p className="text-xs text-gray-400">📅 {pkg.duration} days · 👥 Max {pkg.maxPeople}</p>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">${pkg.price} × 1 person</span>
                      <span className="font-bold text-gray-900">${pkg.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFormPage;
