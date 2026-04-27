import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setSearchQuery, setSpecialty, setSortBy, resetFilters } from '../store/doctorSlice';
import DoctorCard from '../components/doctor/DoctorCard';
import { specialties } from '../data/mockData';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 overflow-hidden">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-2xl skeleton" />
      <div className="flex-1">
        <div className="h-4 w-32 skeleton rounded mb-2" />
        <div className="h-3 w-24 skeleton rounded mb-2" />
        <div className="h-3 w-40 skeleton rounded" />
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      <div className="h-5 w-16 skeleton rounded-full" />
      <div className="h-5 w-16 skeleton rounded-full" />
    </div>
    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
      <div className="h-8 w-24 skeleton rounded" />
      <div className="h-8 w-20 skeleton rounded-xl" />
    </div>
  </div>
);

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { filteredDoctors, searchQuery, selectedSpecialty, sortBy } = useSelector(state => state.doctors);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const DOCTORS_PER_PAGE = 6;

  // Handle URL params
  useEffect(() => {
    const sp = searchParams.get('specialty');
    if (sp) dispatch(setSpecialty(sp));
    setTimeout(() => setLoading(false), 600);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSpecialtyChange = (s) => {
    dispatch(setSpecialty(s));
    setCurrentPage(1);
  };

  const handleSortChange = (s) => {
    dispatch(setSortBy(s));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setLocalQuery('');
    dispatch(resetFilters());
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * DOCTORS_PER_PAGE,
    currentPage * DOCTORS_PER_PAGE
  );

  const hasActiveFilters = localQuery || selectedSpecialty !== 'All Specialties' || sortBy !== 'rating';

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Find Your Doctor
          </h1>
          <p className="text-slate-500 text-sm">
            {loading ? 'Loading...' : `${filteredDoctors.length} doctors available`}
          </p>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search doctors, specialties, hospitals..."
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              />
              {localQuery && (
                <button
                  onClick={() => setLocalQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="experience">Sort: Most Experienced</option>
              <option value="fee_asc">Sort: Fee (Low → High)</option>
              <option value="fee_desc">Sort: Fee (High → Low)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-20">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Specialty</h3>
              <ul className="space-y-1">
                {specialties.map(s => (
                  <li key={s}>
                    <button
                      onClick={() => handleSpecialtyChange(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedSpecialty === s
                          ? 'bg-sky-50 text-sky-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Online only filter */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-sky-600" />
                  <span className="text-sm text-slate-600">Online consultation</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Doctors grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginatedDoctors.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  No doctors found
                </h3>
                <p className="text-slate-500 mb-5">Try adjusting your search or filters</p>
                <button onClick={handleReset} className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedDoctors.map(d => (
                    <DoctorCard key={d.id} doctor={d} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-sky-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
