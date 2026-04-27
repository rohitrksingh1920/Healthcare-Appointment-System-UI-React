import React from 'react';
import { useNavigate } from 'react-router-dom';

const team = [
  { name: 'Dr. Kavita Rao', role: 'Chief Medical Officer', emoji: '👩‍⚕️' },
  { name: 'Arun Sharma', role: 'CEO & Co-founder', emoji: '👨‍💼' },
  { name: 'Neha Pillai', role: 'Head of Product', emoji: '👩‍💻' },
  { name: 'Vikash Gupta', role: 'CTO & Co-founder', emoji: '👨‍💻' },
];

const values = [
  { icon: '❤️', title: 'Patient First', desc: 'Every decision we make starts with patient wellbeing and experience.' },
  { icon: '🔒', title: 'Trust & Privacy', desc: 'Your health data is sacred. We protect it with enterprise-grade security.' },
  { icon: '🌐', title: 'Accessibility', desc: 'Quality healthcare should be accessible to everyone, everywhere.' },
  { icon: '💡', title: 'Innovation', desc: 'We constantly evolve our platform with the latest healthcare technology.' },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero-pattern bg-gradient-to-br from-sky-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            About <span className="gradient-text">MediCare+</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            We're on a mission to make quality healthcare accessible to every Indian. 
            Our platform connects patients with the right doctors at the right time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Mission
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                MediCare+ was founded in 2022 with a simple but powerful vision: to eliminate the friction between patients and quality healthcare in India.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                We believe that finding the right doctor shouldn't be a stressful experience. Whether you need a specialist, a general checkup, or mental health support — MediCare+ is here to guide you every step of the way.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, we serve over 50,000 patients across 30+ cities, with a growing network of 500+ verified healthcare professionals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Verified Doctors', icon: '👨‍⚕️' },
                { value: '50K+', label: 'Happy Patients', icon: '😊' },
                { value: '30+', label: 'Cities Covered', icon: '🏙️' },
                { value: '4.8★', label: 'Average Rating', icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl p-5 text-center border border-sky-100">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-sky-700" style={{ fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            Meet the Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map(t => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
                  {t.emoji}
                </div>
                <h3 className="font-bold text-slate-800">{t.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-teal-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-sky-100 mb-6">
            Join thousands of patients who trust MediCare+ for their health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors">
              Get Started Free
            </button>
            <button onClick={() => navigate('/doctors')} className="px-6 py-3 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Browse Doctors
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
