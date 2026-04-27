import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchQuery, setSpecialty } from '../store/doctorSlice';
import DoctorCard from '../components/doctor/DoctorCard';
import { doctors, specialties, faqs } from '../data/mockData';

const stats = [
  { label: 'Verified Doctors', value: '500+', icon: '👨‍⚕️' },
  { label: 'Happy Patients', value: '50K+', icon: '😊' },
  { label: 'Specialties', value: '20+', icon: '🏥' },
  { label: 'Cities', value: '30+', icon: '🏙️' },
];

const features = [
  { icon: '🔍', title: 'Find the Right Doctor', desc: 'Search by specialty, location, or symptom and find verified doctors near you.' },
  { icon: '📅', title: 'Book Instantly', desc: 'Choose your time slot and book appointments in under 2 minutes, no waiting.' },
  { icon: '💻', title: 'Video Consultations', desc: 'Connect with doctors from the comfort of your home via secure video calls.' },
  { icon: '📋', title: 'Digital Records', desc: 'Access your medical history, prescriptions, and reports anytime, anywhere.' },
];

const specialtyIcons = {
  'Cardiologist': '❤️',
  'Neurologist': '🧠',
  'Dermatologist': '🌿',
  'Orthopedic': '🦴',
  'Pediatrician': '👶',
  'Psychiatrist': '💆',
  'Gynecologist': '🌸',
  'Ophthalmologist': '👁️',
  'Dentist': '🦷',
  'General Physician': '🩺',
};

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const topDoctors = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
    navigate('/doctors');
  };

  const handleSpecialtyClick = (s) => {
    dispatch(setSpecialty(s));
    navigate('/doctors');
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero-pattern bg-gradient-to-br from-sky-50 via-white to-teal-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                500+ Doctors Available Now
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Health,{' '}
                <span className="gradient-text">Our Priority</span>
              </h1>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Book appointments with top-rated doctors across India. Fast, easy, and 100% secure. Your care starts here.
              </p>

              {/* Search form */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by doctor, specialty, hospital..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 active:scale-95 transition-all shadow-sm"
                >
                  Find Doctors
                </button>
              </form>

              <p className="text-slate-400 text-xs mt-3">
                Popular: <span className="text-sky-600 cursor-pointer hover:underline" onClick={() => handleSpecialtyClick('Cardiologist')}>Cardiologist</span>,{' '}
                <span className="text-sky-600 cursor-pointer hover:underline" onClick={() => handleSpecialtyClick('Dermatologist')}>Dermatologist</span>,{' '}
                <span className="text-sky-600 cursor-pointer hover:underline" onClick={() => handleSpecialtyClick('Pediatrician')}>Pediatrician</span>
              </p>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="w-72 h-72 bg-gradient-to-br from-sky-100 to-teal-100 rounded-full flex items-center justify-center text-8xl shadow-inner">
                  🏥
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-lg px-4 py-3 text-sm animate-slide-up">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="font-medium text-slate-700">Appointment Confirmed</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-8 bg-white rounded-2xl shadow-lg px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="font-medium text-slate-700">4.9 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-sky-600" style={{ fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Browse by Specialty
            </h2>
            <p className="text-slate-500">Find the right specialist for your health needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {specialties.slice(1).map(s => (
              <button
                key={s}
                onClick={() => handleSpecialtyClick(s)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 border border-slate-100 hover:border-sky-200 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-sky-100 transition-colors">
                  {specialtyIcons[s] || '🏥'}
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{s}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                Top Rated Doctors
              </h2>
              <p className="text-slate-500 mt-1">Verified experts, trusted by thousands</p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="hidden sm:flex items-center gap-1 text-sm text-sky-600 font-medium hover:text-sky-700"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topDoctors.map(d => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/doctors')}
              className="px-6 py-3 border-2 border-sky-200 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-colors"
            >
              Explore All Doctors →
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-sky-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why MediCare+?
            </h2>
            <p className="text-sky-100">Everything you need for seamless healthcare</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sky-100 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-slate-800 text-sm">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-3xl p-10 border border-sky-100">
            <div className="text-5xl mb-4">🩺</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Take Charge of Your Health?
            </h2>
            <p className="text-slate-600 mb-6">
              Join 50,000+ patients who trust MediCare+ for their healthcare needs.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
              Get Started — It's Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
