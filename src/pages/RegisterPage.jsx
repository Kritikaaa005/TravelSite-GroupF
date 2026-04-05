import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = { name: form.name, email: form.email, role: "user" };
      localStorage.setItem("token", "demo-token-123");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0F172A" }}>

      {/* Glass card - Adjusted max-width to 'sm' and padding to '8' */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>

        <p className="text-white/60 text-xs mb-4 text-center tracking-widest uppercase">WanderNepal</p>
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Create Account</h1>
        <p className="text-white/50 text-xs text-center mb-6">Join WanderNepal today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {error && (
            <div className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 border border-red-400/20">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/60 text-[10px] uppercase tracking-wider ml-1">Confirm</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              className="rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-95 text-sm"
            style={{ backgroundColor: "#10B981" }}
          >
            {loading ? "Creating account..." : "Register →"}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Already have an account?{" "}
          <Link to="/login?role=user" className="font-medium" style={{ color: "#10B981" }}>
            Login
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link to="/" className="text-white/30 text-[10px] hover:text-white/50 transition-colors uppercase tracking-widest">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;