import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDestinations, getPackages, reviews } from "../api";

const HomePage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDestinations().then(d => setDestinations(d.slice(0, 4)));
    getPackages().then(p => setPackages(p.slice(0, 3)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/destinations?search=${search}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[560px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80')` }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 w-full">
          <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
            Discover the Heart of the<br />Himalayas
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Experience Nepal's breathtaking landscapes and rich culture
          </p>
          
          {/* Kept: Refined Search Bar with Backdrop Blur */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700"
              />
            </div>
            <button type="submit"
              className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-transform active:scale-95 shadow-lg"
              style={{ backgroundColor: "#10B981" }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Destinations - Original Card Style + Gradient BG */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Destinations</h2>
          <p className="text-gray-500 mt-2">Explore Nepal's most iconic locations</p>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {destinations.map(dest => (
            <div key={dest.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group h-64"
              onClick={() => navigate(`/destinations/${dest.id}`)}>
              <img src={dest.image} alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/70 text-xs">{dest.category}</span>
                  <button className="text-xs text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate("/destinations")}
            className="px-6 py-3 rounded-lg border-2 font-semibold text-sm transition-colors hover:text-white"
            style={{ borderColor: "#10B981", color: "#10B981" }}
            onMouseEnter={e => { e.target.style.backgroundColor = "#10B981"; e.target.style.color = "white"; }}
            onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#10B981"; }}>
            Explore All Destinations →
          </button>
        </div>
      </section>

      {/* Tour Packages - Original Card Style + Gray BG */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Popular Tour Packages</h2>
            <p className="text-gray-500 mt-2">Carefully curated experiences for every adventurer</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                    <span>📅 {pkg.duration} Days</span>
                    <span>👥 Max {pkg.maxPeople} People</span>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{pkg.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{pkg.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${pkg.price}</span>
                      <span className="text-gray-400 text-sm"> / person</span>
                    </div>
                    <button
                      onClick={() => navigate(`/packages/${pkg.id}`)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: "#10B981" }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => navigate("/packages")}
              className="px-6 py-3 rounded-lg border-2 font-semibold text-sm transition-colors"
              style={{ borderColor: "#10B981", color: "#10B981" }}
              onMouseEnter={e => { e.target.style.backgroundColor = "#10B981"; e.target.style.color = "white"; }}
              onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#10B981"; }}>
              View All Packages →
            </button>
          </div>
        </div>
      </section>

      {/* Reviews - Kept: Italics + Gradient back to white */}
      <section id="reviews" className="py-16 px-6 max-w-7xl mx-auto w-full bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">What Our Travelers Say</h2>
          <p className="text-gray-500 mt-2">Real experiences from real adventurers</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: "#10B981" }}>
                  {review.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.user}</p>
                  <p className="text-gray-400 text-xs">{review.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;