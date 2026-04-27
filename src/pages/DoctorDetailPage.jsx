import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doctors } from '../data/mockData';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="font-bold text-slate-800">{rating}</span>
    <span className="text-slate-400 text-sm">({count} reviews)</span>
  </div>
);

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const doctor = doctors.find(d => d.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('about');

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-700 mb-3">Doctor not found</h2>
          <button onClick={() => navigate('/doctors')} className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700">
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${doctor.id}`);
  };

  const tabs = ['about', 'schedule', 'reviews'];

  const sampleReviews = [
    { name: 'Rahul K.', rating: 5, date: '2 days ago', text: 'Excellent doctor! Very thorough and caring. Explained everything clearly.' },
    { name: 'Priya M.', rating: 5, date: '1 week ago', text: 'Highly professional and knowledgeable. The appointment was on time.' },
    { name: 'Amit S.', rating: 4, date: '2 weeks ago', text: 'Good experience overall. The doctor was patient and listened carefully.' },
  ];

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      {/* Back */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Doctors
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-sky-400 to-teal-400" />
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-2xl object-cover bg-slate-50 border border-slate-100"
                      onError={e => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}&backgroundColor=e0f2fe`}
                    />
                    {doctor.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {doctor.name}
                        </h1>
                        <p className="text-sky-600 font-medium">{doctor.specialty}</p>
                        <p className="text-slate-500 text-sm mt-1">{doctor.hospital}</p>
                      </div>
                      {doctor.isOnline && (
                        <span className="badge-pulse text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-medium flex items-center">
                          Available Now
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <StarRating rating={doctor.rating} count={doctor.reviews} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {doctor.tags.map(tag => (
                        <span key={tag} className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-600" style={{ fontFamily: 'Playfair Display, serif' }}>{doctor.experience}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Years Exp.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-600" style={{ fontFamily: 'Playfair Display, serif' }}>{doctor.reviews}+</div>
                    <div className="text-xs text-slate-500 mt-0.5">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-600" style={{ fontFamily: 'Playfair Display, serif' }}>₹{doctor.fee}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Consult Fee</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-sky-600 border-b-2 border-sky-500'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">About</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{doctor.about}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Education</h3>
                      <p className="text-slate-600 text-sm">{doctor.education}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Languages Spoken</h3>
                      <div className="flex gap-2">
                        {doctor.languages.map(l => (
                          <span key={l} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Available Days</h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <span
                          key={day}
                          className={`text-sm px-3 py-1.5 rounded-lg border ${
                            doctor.availableDays.includes(day)
                              ? 'bg-sky-50 text-sky-700 border-sky-200 font-medium'
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[['Morning', doctor.slots.morning], ['Afternoon', doctor.slots.afternoon], ['Evening', doctor.slots.evening]].map(([period, slots]) => (
                        <div key={period}>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{period}</p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(slot => (
                              <span
                                key={slot}
                                className={`text-xs px-3 py-1.5 rounded-lg border ${
                                  doctor.slots.booked.includes(slot)
                                    ? 'bg-slate-50 text-slate-300 border-slate-100 line-through'
                                    : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {sampleReviews.map((r, i) => (
                      <div key={i} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-sm">
                              {r.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{r.name}</p>
                              <div className="flex">
                                {[...Array(r.rating)].map((_, i) => (
                                  <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{r.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 ml-10">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-slate-800 mb-1">Book Appointment</h3>
              <p className="text-slate-500 text-sm mb-5">Select your preferred date and time</p>

              <div className="space-y-4">
                <div className="bg-sky-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Consultation Fee</span>
                  <span className="font-bold text-sky-700 text-lg">₹{doctor.fee}</span>
                </div>

                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-xs text-teal-700 font-medium mb-1">Next Available</p>
                  <p className="text-sm font-semibold text-slate-800">Tomorrow, 10:00 AM</p>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 active:scale-95 transition-all shadow-sm text-sm"
                >
                  📅 Book Appointment
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-slate-400">
                    You'll be redirected to login first
                  </p>
                )}

                <div className="text-center">
                  <p className="text-xs text-slate-400">🔒 Secure booking · Free cancellation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
