import { createSlice } from '@reduxjs/toolkit';
import { doctors } from '../data/mockData';

const initialState = {
  doctors: doctors,
  filteredDoctors: doctors,
  searchQuery: '',
  selectedSpecialty: 'All Specialties',
  sortBy: 'rating',
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredDoctors = filterDoctors(state);
    },
    setSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
      state.filteredDoctors = filterDoctors(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredDoctors = filterDoctors(state);
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedSpecialty = 'All Specialties';
      state.sortBy = 'rating';
      state.filteredDoctors = state.doctors;
    },
  },
});

function filterDoctors(state) {
  let result = [...state.doctors];

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (state.selectedSpecialty !== 'All Specialties') {
    result = result.filter(d => d.specialty === state.selectedSpecialty);
  }

  if (state.sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'fee_asc') {
    result.sort((a, b) => a.fee - b.fee);
  } else if (state.sortBy === 'fee_desc') {
    result.sort((a, b) => b.fee - a.fee);
  } else if (state.sortBy === 'experience') {
    result.sort((a, b) => b.experience - a.experience);
  }

  return result;
}

export const { setSearchQuery, setSpecialty, setSortBy, resetFilters } = doctorSlice.actions;
export default doctorSlice.reducer;
