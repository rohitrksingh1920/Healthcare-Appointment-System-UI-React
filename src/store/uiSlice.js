import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  activeModal: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({ id: Date.now(), ...action.payload, read: false });
    },
    markNotificationRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, openModal, closeModal, addNotification, markNotificationRead, markAllRead } = uiSlice.actions;
export default uiSlice.reducer;
