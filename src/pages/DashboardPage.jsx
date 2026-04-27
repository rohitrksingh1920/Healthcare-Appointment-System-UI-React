import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelAppointment } from '../store/appointmentSlice';
import { chartData, healthMetrics } from '../data/mockData';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const statusColors = {
  confirmed: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
  rescheduled: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-slate-50 text-slate-600 border-slate-100',
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { appointments } = useSelector(state => state.appointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelId, setCancelId] = useState(null);

  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'rescheduled');
  const past = appointments.filter(a => a.status === 'cancelled' || a.status === 'completed');
  const allDisplay = activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : appointments;

  const handleCancel = (id) => {
    dispatch(cancelAppointment(id));
    setCancelId(null);
    toast.success('Appointment cancelled successfully');
  };

  const quickStats = [
    { label: 'Total Appointments', value: appointments.length, icon: '📅', color: 'bg-sky-50 text-sky-700' },
    { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: 'bg-teal-50 text-teal-700' },
    { label: 'Completed', value: past.filter(a => a.status === 'completed').length, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'Cancelled', value: past.filter(a => a.status === 'cancelled').length, icon: '❌', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Here's your health overview</p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
            >
              + Book Appointment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointments */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100">
                {[
                  { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
                  { key: 'past', label: 'Past' },
                  { key: 'all', label: 'All' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === t.key
                        ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {allDisplay.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-slate-500 text-sm">No appointments found</p>
                    <button
                      onClick={() => navigate('/doctors')}
                      className="mt-3 text-sky-600 text-sm font-medium hover:text-sky-700"
                    >
                      Book your first appointment →
                    </button>
                  </div>
                ) : (
                  allDisplay.map(apt => (
                    <div key={apt.id} className="border border-slate-100 rounded-xl p-4 hover:border-sky-100 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{apt.doctorName}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${statusColors[apt.status] || statusColors.confirmed}`}>
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-sky-600 text-xs">{apt.specialty}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{apt.hospital}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <span>📅</span> {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>🕐</span> {apt.slot}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>💊</span> {apt.appointmentType}
                            </span>
                          </div>
                          {apt.reason && (
                            <p className="text-xs text-slate-400 mt-1.5 italic">
                              Reason: {apt.reason.slice(0, 60)}{apt.reason.length > 60 ? '...' : ''}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <div className="text-right hidden sm:block">
                            <span className="text-sm font-bold text-sky-600">₹{apt.fee}</span>
                          </div>
                          {(apt.status === 'confirmed' || apt.status === 'rescheduled') && (
                            <button
                              onClick={() => setCancelId(apt.id)}
                              className="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/doctors/${apt.doctorId}`)}
                            className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Health Metrics */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Health Metrics</h3>
              <div className="space-y-3">
                {healthMetrics.map(m => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-sm text-slate-600">{m.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{m.value}</span>
                      <span className="text-xs text-slate-400 ml-1">{m.unit}</span>
                      <div className={`text-[10px] font-medium text-right mt-0.5 ${m.status === 'normal' ? 'text-green-600' : 'text-amber-600'}`}>
                        {m.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile card */}
            <div className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-sky-100 text-xs">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Appointment History</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="appointments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-slide-up">
            <div className="text-3xl mb-3 text-center">⚠️</div>
            <h3 className="font-bold text-slate-800 text-center mb-2">Cancel Appointment?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">This action cannot be undone. Are you sure you want to cancel this appointment?</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Keep It
              </button>
              <button onClick={() => handleCancel(cancelId)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
