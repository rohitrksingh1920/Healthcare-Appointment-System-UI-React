import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                MediCare+
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your trusted healthcare partner. Book appointments with top doctors and manage your health journey.
            </p>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#" className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors text-xs">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/doctors', label: 'Find Doctors' },
                { to: '/dashboard', label: 'Patient Dashboard' },
                { to: '/about', label: 'About Us' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-white font-semibold mb-4">Specialties</h4>
            <ul className="space-y-2.5">
              {['Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic', 'Pediatrician', 'Gynecologist'].map(s => (
                <li key={s}>
                  <Link to={`/doctors?specialty=${s}`} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <span className="mt-0.5">📍</span>
                <span>123 Health Street, Medical District, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <span>📞</span>
                <span>+91 1800-MEDICARE</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <span>✉️</span>
                <span>support@medicare.in</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <span>🕐</span>
                <span>24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MediCare+. All rights reserved. | Built with React + Vite
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
