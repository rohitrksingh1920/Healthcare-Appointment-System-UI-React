import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment } from '../store/appointmentSlice';
import { addNotification } from '../store/uiSlice';
import { doctors, appointmentTypes } from '../data/mockData';
import toast from 'react-hot-toast';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

const STEPS = ['Doctor', 'Date & Time', 'Patient Info', 'Confirm'];

const validate = (step, data) => {
  const errors = {};
  if (step === 2) {
    if (!data.date) errors.date = 'Please select a date';
    if (!data.slot) errors.slot = 'Please select a time slot';
    if (!data.appointmentType) errors.appointmentType = 'Please select appointment type';
  }
  if (step === 3) {
    if (!data.patientName?.trim()) errors.patientName = 'Full name is required';
    if (!data.phone?.trim()) errors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(data.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!data.age?.trim()) errors.age = 'Age is required';
    else if (isNaN(data.age) || +data.age < 1 || +data.age > 120) errors.age = 'Enter a valid age';
    if (!data.gender) errors.gender = 'Please select gender';
    if (!data.reason?.trim()) errors.reason = 'Please describe your reason for visit';
    else if (data.reason.trim().length < 10) errors.reason = 'Please provide more detail (at least 10 characters)';
  }
  return errors;
};

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    slot: '',
    appointmentType: '',
    patientName: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    reason: '',
    notes: '',
  });

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-700 mb-3">Doctor not found</h2>
          <button onClick={() => navigate('/doctors')} className="px-6 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium">
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const goNext = () => {
    const errs = validate(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const appointmentType = appointmentTypes.find(t => t.id === formData.appointmentType);
    dispatch(bookAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      date: formData.date,
      slot: formData.slot,
      appointmentType: appointmentType?.label || formData.appointmentType,
      patientName: formData.patientName,
      phone: formData.phone,
      age: formData.age,
      gender: formData.gender,
      reason: formData.reason,
      notes: formData.notes,
      fee: doctor.fee,
    }));
    dispatch(addNotification({
      title: 'Appointment Confirmed!',
      message: `Your appointment with ${doctor.name} on ${formData.date} at ${formData.slot} is confirmed.`,
      type: 'success',
    }));
    setSubmitting(false);
    setBooked(true);
    toast.success('Appointment booked successfully!');
  };

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    const dayName = format(date, 'EEEE');
    const isAvailable = doctor.availableDays.includes(dayName);
    return { date, dayName, isAvailable };
  }).filter(d => d.isAvailable);

  const allSlots = [
    ...doctor.slots.morning.map(s => ({ slot: s, period: 'Morning' })),
    ...doctor.slots.afternoon.map(s => ({ slot: s, period: 'Afternoon' })),
    ...doctor.slots.evening.map(s => ({ slot: s, period: 'Evening' })),
  ];

  if (booked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4 page-enter">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Appointment Confirmed!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Your appointment with <strong>{doctor.name}</strong> on{' '}
            <strong>{formData.date}</strong> at <strong>{formData.slot}</strong> is confirmed.
          </p>
          <div className="bg-sky-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Doctor</span>
              <span className="font-medium text-slate-800">{doctor.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="font-medium text-slate-800">{formData.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Time</span>
              <span className="font-medium text-slate-800">{formData.slot}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fee</span>
              <span className="font-bold text-sky-600">₹{doctor.fee}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors text-sm">
              View Dashboard
            </button>
            <button onClick={() => navigate('/doctors')} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
              Browse Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step > 1 ? 'Previous Step' : 'Back'}
        </button>

        {/* Progress */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i + 1 < step ? 'bg-sky-600 text-white' :
                  i + 1 === step ? 'bg-sky-600 text-white ring-4 ring-sky-100' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-1 text-slate-500 hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? 'bg-sky-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-sky-400 to-teal-400" style={{ width: `${(step / STEPS.length) * 100}%` }} />

          <div className="p-6 sm:p-8">
            {/* Step 1: Doctor summary */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Book with {doctor.name}
                </h2>
                <p className="text-slate-500 text-sm mb-6">Review doctor details and proceed to select time</p>

                <div className="flex gap-4 items-start bg-sky-50 rounded-2xl p-5 mb-5">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white border border-sky-100"
                    onError={e => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}`}
                  />
                  <div>
                    <h3 className="font-bold text-slate-800">{doctor.name}</h3>
                    <p className="text-sky-600 text-sm">{doctor.specialty}</p>
                    <p className="text-slate-500 text-sm">{doctor.hospital}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-sm font-semibold text-slate-700">{doctor.rating}</span>
                      <span className="text-slate-400 text-xs">({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center bg-slate-50 rounded-xl p-3">
                    <div className="text-xl font-bold text-sky-600">{doctor.experience}</div>
                    <div className="text-xs text-slate-500">Years Exp.</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl p-3">
                    <div className="text-xl font-bold text-sky-600">₹{doctor.fee}</div>
                    <div className="text-xs text-slate-500">Consult Fee</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl p-3">
                    <div className="text-xl font-bold text-sky-600">{doctor.availableDays.length}</div>
                    <div className="text-xs text-slate-500">Days/Week</div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mb-6">
                  <strong>💡 Tip:</strong> Free cancellation up to 2 hours before your appointment.
                </div>

                <button onClick={goNext} className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors">
                  Proceed to Select Date & Time →
                </button>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Select Date & Time
                </h2>
                <p className="text-slate-500 text-sm mb-6">Choose a convenient slot from available options</p>

                {/* Appointment type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Appointment Type *</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {appointmentTypes.map(type => (
                      <label key={type.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.appointmentType === type.id}
                          onChange={e => update('appointmentType', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                          formData.appointmentType === type.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-slate-100 hover:border-sky-200'
                        }`}>
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-slate-800">{type.label}</div>
                            <div className="text-xs text-slate-400">{type.duration}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.appointmentType && <p className="text-red-500 text-xs mt-1">{errors.appointmentType}</p>}
                </div>

                {/* Date picker */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Select Date *</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {availableDates.slice(0, 10).map(({ date, dayName }) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const isSelected = formData.date === dateStr;
                      return (
                        <button
                          key={dateStr}
                          onClick={() => { update('date', dateStr); update('slot', ''); }}
                          className={`shrink-0 flex flex-col items-center p-3 rounded-xl border-2 min-w-[64px] transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-100 hover:border-sky-200 text-slate-600'
                          }`}
                        >
                          <span className="text-xs font-medium">{dayName.slice(0, 3)}</span>
                          <span className="text-lg font-bold mt-0.5">{format(date, 'd')}</span>
                          <span className="text-xs">{format(date, 'MMM')}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                {/* Time slots */}
                {formData.date && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Select Time Slot *</label>
                    {[['🌅 Morning', 'Morning'], ['☀️ Afternoon', 'Afternoon'], ['🌆 Evening', 'Evening']].map(([label, period]) => {
                      const slots = allSlots.filter(s => s.period === period);
                      return (
                        <div key={period} className="mb-4">
                          <p className="text-xs text-slate-500 mb-2">{label}</p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(({ slot }) => {
                              const isBooked = doctor.slots.booked.includes(slot);
                              const isSelected = formData.slot === slot;
                              return (
                                <button
                                  key={slot}
                                  disabled={isBooked}
                                  onClick={() => update('slot', slot)}
                                  className={`time-slot text-xs px-3 py-2 rounded-lg border ${
                                    isBooked ? 'disabled' :
                                    isSelected ? 'selected' : 'border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {errors.slot && <p className="text-red-500 text-xs mt-1">{errors.slot}</p>}
                  </div>
                )}

                <button onClick={goNext} className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors">
                  Continue to Patient Details →
                </button>
              </div>
            )}

            {/* Step 3: Patient Info */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Patient Information
                </h2>
                <p className="text-slate-500 text-sm mb-6">Please fill in the patient's details accurately</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={e => update('patientName', e.target.value)}
                      placeholder="Enter patient's full name"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all ${
                        errors.patientName ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    />
                    {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age *</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => update('age', e.target.value)}
                      placeholder="Patient's age"
                      min={1}
                      max={120}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all ${
                        errors.age ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={e => update('gender', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all bg-white ${
                        errors.gender ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for Visit *</label>
                    <textarea
                      value={formData.reason}
                      onChange={e => update('reason', e.target.value)}
                      placeholder="Describe your symptoms or reason for this appointment..."
                      rows={3}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all resize-none ${
                        errors.reason ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400'
                      }`}
                    />
                    <div className="flex justify-between">
                      {errors.reason ? <p className="text-red-500 text-xs mt-1">{errors.reason}</p> : <span />}
                      <span className="text-xs text-slate-400 mt-1">{formData.reason.length} chars</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => update('notes', e.target.value)}
                      placeholder="Any allergies, current medications, or additional information..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-sky-400 transition-all resize-none"
                    />
                  </div>
                </div>

                <button onClick={goNext} className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors mt-6">
                  Review & Confirm →
                </button>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Confirm Appointment
                </h2>
                <p className="text-slate-500 text-sm mb-6">Please review all details before confirming</p>

                <div className="space-y-4 mb-6">
                  <div className="bg-sky-50 rounded-2xl p-5">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Doctor Details</h4>
                    <div className="flex gap-3">
                      <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover" onError={e => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}`} />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{doctor.name}</p>
                        <p className="text-sky-600 text-xs">{doctor.specialty}</p>
                        <p className="text-slate-500 text-xs">{doctor.hospital}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Appointment Details</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        ['Date', formData.date],
                        ['Time', formData.slot],
                        ['Type', appointmentTypes.find(t => t.id === formData.appointmentType)?.label],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500">{k}</span>
                          <span className="font-medium text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Patient Details</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        ['Name', formData.patientName],
                        ['Phone', formData.phone],
                        ['Age', formData.age + ' years'],
                        ['Gender', formData.gender],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500">{k}</span>
                          <span className="font-medium text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Reason</p>
                      <p className="text-sm text-slate-700">{formData.reason}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Total Fee</span>
                    <span className="text-2xl font-bold text-green-700">₹{doctor.fee}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 mb-5">
                  ⚠️ By confirming, you agree to our cancellation policy. Appointments can be cancelled up to 2 hours before the scheduled time.
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Confirming...
                    </>
                  ) : (
                    '✅ Confirm Appointment'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
