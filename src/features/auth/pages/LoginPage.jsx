/**
 * LoginPage.jsx
 * Handles login for both traveler and admin roles.
 *
 * The ?role= query param (set by LandingPage links) decides which mode shows ("Traveler Login" vs "Admin Login").
 * After successful login, redirects based on role:
 *  - admin -> /admin
 *  - user  -> /home
 */

import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user"; // grabs ?role= from the URL, defaults to "user"

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Sends creds to backend.
   * Also checks that the returned role matches what was expected —
   * so a regular user can't sneak into the admin panel and vice versa.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // role mismatch — wrong login panel for this account type
      if (user.role !== role) {
        setError(role === "admin" ? "This account is not an admin." : "Please use the admin login.");
        setLoading(false);
        return;
      }

      // all good, send them where they belong
      navigate(user.role === "admin" ? "/admin" : "/home");

    } catch (err) {
      // friendly message if the server's just not running
      setError(err.message === "Failed to fetch"
        ? "Cannot connect to server. Make sure XAMPP is running."
        : err.message
      );
      setLoading(false);
    }
  };

  return (
    // full screen dark bg, same as rest of the app
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}>

      {/* frosted glass card */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-10"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>

        <p className="text-white/60 text-sm mb-6 text-center">WanderNepal</p>
        <h1 className="text-3xl font-bold text-white mb-1 text-center">Welcome Back</h1>
        <p className="text-white/50 text-sm text-center mb-8">Sign in to continue your journey</p>

        {/* little badge showing which login mode is active */}
        <div className="flex justify-center mb-6">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>
            {role === "admin" ? "Admin Login" : "Traveler Login"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* shows up if login fails for any reason */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2 border border-red-400/20">
              {error}
            </div>
          )}

          {/* email input */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-xs">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-lg px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>

          {/* password input */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-xs">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="rounded-lg px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>

          {/* button text changes while request is in flight */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#10B981" }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* register link only makes sense for travelers, not admins */}
        {role !== "admin" && (
          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium" style={{ color: "#10B981" }}>
              Register here
            </Link>
          </p>
        )}

        {/* back to landing page */}
        <p className="text-center mt-4">
          <Link to="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;