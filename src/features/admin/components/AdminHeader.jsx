import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold text-white">
            Wander<span className="text-[#10B981]">Nepal</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 px-2.5 py-1 text-xs font-semibold text-[#10B981]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-3.5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all duration-150 hover:brightness-110 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
