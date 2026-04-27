import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/authSlice';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Name is required';
  if (!form.phone?.trim()) errors.phone = 'Phone is required';
  else if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit number';
  if (form.age && (isNaN(form.age) || +form.age < 1 || +form.age > 120)) errors.age = 'Enter a valid age';
  return errors;
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { appointments } = useSelector(state => state.appointments);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    allergies: user?.allergies || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    dispatch(updateProfile(form));
    setLoading(false);
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const stats = [
    { label: 'Total Appointments', value: appointments.length },
    { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed').length },
    { label: 'Doctors Visited', value: [...new Set(appointments.map(a => a.doctorId))].length },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm transition-all ${
      editing ? (errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100') : 'border-transparent bg-slate-50 cursor-default'
    }`;

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Profile
          </h1>
          <p className="text-slate-500 text-sm">Manage your personal health information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-sky-400 to-teal-400" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-8">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-sky-600 bg-sky-50">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="pb-1">
                  <h2 className="font-bold text-slate-800 text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {user?.name}
                  </h2>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={loading}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  editing
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {loading ? 'Saving...' : editing ? '✓ Save Changes' : '✏️ Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-5 pt-4 border-t border-slate-50">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-sky-600">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                readOnly={!editing}
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email}
                readOnly
                className="w-full px-4 py-2.5 border border-transparent bg-slate-50 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value.replace(/\D/, ''))}
                readOnly={!editing}
                maxLength={10}
                className={inputClass('phone')}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={e => update('age', e.target.value)}
                readOnly={!editing}
                min={1}
                max={120}
                className={inputClass('age')}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
              {editing ? (
                <select
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white"
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              ) : (
                <input type="text" value={form.gender || 'Not set'} readOnly className="w-full px-4 py-2.5 border border-transparent bg-slate-50 rounded-xl text-sm" />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Blood Group</label>
              {editing ? (
                <select
                  value={form.bloodGroup}
                  onChange={e => update('bloodGroup', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-sky-400 bg-white"
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
                </select>
              ) : (
                <input type="text" value={form.bloodGroup || 'Not set'} readOnly className="w-full px-4 py-2.5 border border-transparent bg-slate-50 rounded-xl text-sm" />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
              <textarea
                value={form.address}
                onChange={e => update('address', e.target.value)}
                readOnly={!editing}
                rows={2}
                placeholder={editing ? "Enter your address" : "Not set"}
                className={`${inputClass('address')} resize-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Emergency Contact</label>
              <input
                type="tel"
                value={form.emergencyContact}
                onChange={e => update('emergencyContact', e.target.value.replace(/\D/, ''))}
                readOnly={!editing}
                maxLength={10}
                placeholder={editing ? "Emergency contact number" : "Not set"}
                className={inputClass('emergencyContact')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Known Allergies</label>
              <input
                type="text"
                value={form.allergies}
                onChange={e => update('allergies', e.target.value)}
                readOnly={!editing}
                placeholder={editing ? "e.g., Penicillin, Peanuts" : "None specified"}
                className={inputClass('allergies')}
              />
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors text-sm disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setErrors({}); }}
                className="px-6 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">Account Information</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Member Since</p>
              <p className="font-medium text-slate-800">
                {user?.joined ? new Date(user.joined).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Account Type</p>
              <p className="font-medium text-slate-800">Patient Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
