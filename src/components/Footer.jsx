/**
 * Footer.jsx
 *
 * Simple footer for the website.
 *
 * Includes:
 *  - Brand name + short description
 *  - Quick links to main pages
 *  - Some support links (not working yet)
 *  - Contact info
 *
 * Note:
 *  - Uses <Link> for navigation
 * *  - Some sections are just placeholders for now
 */


import { Link } from "react-router-dom";

// Footer shown at the bottom of every page
const Footer = () => {
  return (
    // Dark background to match the overall site theme
    <footer style={{ backgroundColor: "#0F172A" }} className="text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* 4-column grid: brand info, quick links, support, contact */}
        <div className="grid grid-cols-4 gap-10 mb-10">

          {/* Brand blurb */}
          <div>
            <h3 className="text-lg font-extrabold mb-3">
              Wander<span style={{ color: "#10B981" }}>Nepal</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted partner for unforgettable adventures.
            </p>
          </div>

          {/* Quick nav links — auto-generated from array so easy to add more later */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {["Destinations", "Packages", "Bookings"].map(link => (
                <li key={link}>
                  {/* Converts label to lowercase route e.g. "Packages" -> /packages */}
                  <Link to={`/${link.toLowerCase().replace(" ", "")}`}
                    className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links — just static text for now, no routes attached */}
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

          {/* Static contact info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact Us</h4>
            <ul className="flex flex-col gap-2 text-white/50 text-sm">
              <li>Biratnagar, Morang, Nepal</li>
              <li>info@wandernepal.com</li>
              <li>+977-1-4123456</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-white/10 pt-6 text-center text-white/30 text-xs">
          © 2025 WanderNepal. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;