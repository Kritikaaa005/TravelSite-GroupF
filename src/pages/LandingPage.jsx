import { Link } from "react-router-dom";
import { User, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative px-6"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop)",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0F172A]/70" />

      <div className="relative z-10 text-center text-white w-full max-w-6xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">WanderNepal</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          Explore the beauty of Nepal with us
        </p>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {/* TRAVELER CARD */}
          <Link
            to="/login?role=user"
            className="group flex flex-col items-center justify-center p-8 md:p-10 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 w-full md:w-[450px] min-h-[280px] shadow-2xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#10B981] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Traveler</h2>
            <p className="text-gray-300 text-center text-lg">
              Book your next Himalayan adventure
            </p>
          </Link>

          {/* ADMIN CARD */}
          <Link
            to="/login?role=admin"
            className="group flex flex-col items-center justify-center p-8 md:p-10 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 w-full md:w-[450px] min-h-[280px] shadow-2xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/40">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Admin</h2>
            <p className="text-gray-300 text-center text-lg">
              Manage packages and platform insights
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}