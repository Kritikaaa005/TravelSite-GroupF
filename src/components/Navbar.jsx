/**
 * Navbar.jsx
 * Sticky top nav shown on all pages after login.
 *
 * Grabs the logged-in user's name from localStorage to show a greeting.
 * Logout wipes localStorage (token + user) and kicks the user back to the landing page.
 */

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Pull user info from localStorage — falls back to empty obj if nothing's stored
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Clears both token and user data, then sends them back to "/"
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    // Sticky so it stays at the top while scrolling
    <nav className="sticky top-0 z-50 border-b border-white/10 shadow-lg"
         style={{ backgroundColor: "#0F172A" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo — clicking it takes you back to /home */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-white">
            Wander<span style={{ color: "#10B981" }}>Nepal</span>
          </span>
        </Link>

        {/* Main nav links */}
        <div className="flex items-center gap-8">
          <Link to="/destinations" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Destinations
          </Link>
          <Link to="/packages" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Packages
          </Link>
          {/* "My Bookings" lives at /dashboard */}
          <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            My Bookings
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {/* Personalized greeting — shows "Traveler" if name isn't found */}
          <span className="text-sm text-white/60">
            Hi, <span className="font-semibold text-white">{user.name || "Traveler"}</span>
          </span>

          {/* Logout button — triggers handleLogout on click */}
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-white px-5 py-2 rounded-lg transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20"
            style={{ backgroundColor: "#10B981" }}
          >
            Log-out
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;