import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const BookingConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.booking) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-500">No booking found.</p>
          <button onClick={() => navigate("/packages")} className="text-emerald-600 underline text-sm">Browse Packages</button>
        </div>
      </div>
    );
  }

  const { booking, pkg } = state;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#D1FAE5" }}>
            <svg className="w-10 h-10" style={{ color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Submitted!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your booking is currently <strong className="text-yellow-600">PENDING</strong> review. Our team will confirm within 24 hours.
          </p>

          {/* Booking ID */}
          <div className="bg-gray-50 rounded-xl px-6 py-4 mb-6 border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Booking ID</p>
            <p className="text-2xl font-extrabold tracking-wider" style={{ color: "#10B981" }}>
              {booking.bookingId}
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3 text-sm text-left mb-8">
            {[
              ["Package", pkg?.title],
              ["Travel Date", booking.travelDate ? new Date(booking.travelDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"],
              ["Persons", booking.numPersons],
              ["Total Price", `$${booking.totalPrice?.toLocaleString()}`],
              ["Status", "PENDING"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${label === "Status" ? "text-yellow-600" : "text-gray-900"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981" }}>
              View My Bookings
            </button>
            <button onClick={() => navigate("/packages")}
              className="w-full py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              Browse More Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;