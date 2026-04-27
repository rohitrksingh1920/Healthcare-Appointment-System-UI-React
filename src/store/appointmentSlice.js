import { createSlice } from '@reduxjs/toolkit';

const storedAppointments = localStorage.getItem('medicare_appointments');

const initialState = {
  appointments: storedAppointments ? JSON.parse(storedAppointments) : [],
  selectedDoctor: null,
  selectedDate: null,
  selectedSlot: null,
  bookingStep: 1,
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    setBookingStep: (state, action) => {
      state.bookingStep = action.payload;
    },
    bookAppointment: (state, action) => {
      const newAppointment = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      state.appointments.unshift(newAppointment);
      localStorage.setItem('medicare_appointments', JSON.stringify(state.appointments));
      state.selectedDoctor = null;
      state.selectedDate = null;
      state.selectedSlot = null;
      state.bookingStep = 1;
    },
    cancelAppointment: (state, action) => {
      const idx = state.appointments.findIndex(a => a.id === action.payload);
      if (idx !== -1) {
        state.appointments[idx].status = 'cancelled';
        localStorage.setItem('medicare_appointments', JSON.stringify(state.appointments));
      }
    },
    rescheduleAppointment: (state, action) => {
      const { id, date, slot } = action.payload;
      const idx = state.appointments.findIndex(a => a.id === id);
      if (idx !== -1) {
        state.appointments[idx].date = date;
        state.appointments[idx].slot = slot;
        state.appointments[idx].status = 'rescheduled';
        localStorage.setItem('medicare_appointments', JSON.stringify(state.appointments));
      }
    },
    resetBooking: (state) => {
      state.selectedDoctor = null;
      state.selectedDate = null;
      state.selectedSlot = null;
      state.bookingStep = 1;
    },
  },
});

export const {
  setSelectedDoctor,
  setSelectedDate,
  setSelectedSlot,
  setBookingStep,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  resetBooking,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
