import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: replace with real API call
    // Hardcoded demo login
    setTimeout(() => {
      if (form.email && form.password) {
        const user = {
          name: role === "admin" ? "Admin" : "Traveler",
          email: form.email,
          role,
        };
        localStorage.setItem("token", "demo-token-123");
        localStorage.setItem("user", JSON.stringify(user));
        navigate(role === "admin" ? "/admin" : "/home");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-10"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>

        {/* Logo */}
        <p className="text-white/60 text-sm mb-6 text-center">WanderNepal</p>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-1 text-center">Welcome Back</h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Sign in to continue your journey
        </p>

        {/* Role badge */}
        <div className="flex justify-center mb-6">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>
            {role === "admin" ? "Admin Login" : "Traveler Login"}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-xs">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-lg px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-xs">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="rounded-lg px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#10B981" }}
          >
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        {/* Register link — only for user role */}
        {role !== "admin" && (
          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium" style={{ color: "#10B981" }}>
              Register here
            </Link>
          </p>
        )}

        {/* Back link */}
        <p className="text-center mt-4">
          <Link to="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;