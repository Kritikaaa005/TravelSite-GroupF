import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [nameWarning, setNameWarning] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val });

    if (val.length === 0) {
      setNameWarning("");
      return;
    }

    if (/\d/.test(val)) {
      setNameWarning("Name should not contain numbers.");
    } else if (!/^[a-zA-Z\s-]*$/.test(val)) {
      setNameWarning("Only letters, spaces, and hyphens allowed.");
    } else if (val.trim().length < 2) {
      setNameWarning("Name must be at least 2 characters.");
    } else {
      setNameWarning("");
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, email: val });

    if (val.length < 5) {
      setEmailWarning("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailWarning("Enter a valid email (e.g. you@example.com).");
    } else {
      setEmailWarning("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[a-zA-Z\s-]+$/.test(form.name.trim()) || form.name.trim().length < 2) {
      setError("Name must contain only letters and be at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/home");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Make sure XAMPP is running."
          : err.message
      );
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <p className="text-white/60 text-xs mb-4 text-center tracking-widest uppercase">
          WanderNepal
        </p>
        <h1 className="text-2xl font-bold text-white mb-1 text-center">
          Create Account
        </h1>
        <p className="text-white/50 text-xs text-center mb-6">
          Join WanderNepal today
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {error && (
            <div className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 border border-red-400/20">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleNameChange}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={inputStyle}
            />
            {nameWarning && (
              <p className="text-yellow-400 text-[11px] ml-1 mt-0.5">
                {nameWarning}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleEmailChange}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={inputStyle}
            />
            {emailWarning && (
              <p className="text-yellow-400 text-[11px] ml-1 mt-0.5">
                {emailWarning}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={inputStyle}
            />
          </div>

          {/* Confirm */}
          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-95 text-sm"
            style={{ backgroundColor: "#10B981" }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Already have an account?{" "}
          <Link to="/login?role=user" className="font-medium" style={{ color: "#10B981" }}>
            Login
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link
            to="/"
            className="text-white/30 text-[10px] hover:text-white/50 transition-colors uppercase tracking-widest"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;