import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#0F172A" }} className="text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-lg font-extrabold mb-3">
              Wander<span style={{ color: "#10B981" }}>Nepal</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted partner for unforgettable adventures.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {["Destinations", "Packages", "Bookings"].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(" ", "")}`}
                    className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Support</h4>
            <ul className="flex flex-col gap-2">
              {["FAQ", "Terms & Conditions", "Privacy Policy", "Booking Policy"].map(item => (
                <li key={item}>
                  <span className="text-white/50 text-sm cursor-pointer hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact Us</h4>
            <ul className="flex flex-col gap-2 text-white/50 text-sm">
              <li>Biratnagar, Morang, Nepal</li>
              <li>info@wandernepal.com</li>
              <li>+977-1-4123456</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-white/30 text-xs">
          © 2025 WanderNepal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
