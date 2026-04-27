import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleBook = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${doctor.id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-sm card-hover cursor-pointer overflow-hidden"
      onClick={() => navigate(`/doctors/${doctor.id}`)}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-sky-400 to-teal-400" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100"
              onError={e => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}&backgroundColor=e0f2fe`;
              }}
            />
            {doctor.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" title="Available online" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{doctor.name}</h3>
                <p className="text-sky-600 text-xs font-medium mt-0.5">{doctor.specialty}</p>
              </div>
              {doctor.isOnline && (
                <span className="shrink-0 text-[10px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-medium">
                  Online
                </span>
              )}
            </div>

            <p className="text-slate-500 text-xs mt-1 truncate">{doctor.hospital}</p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <StarRating rating={doctor.rating} />
                <span className="text-xs font-semibold text-slate-700">{doctor.rating}</span>
                <span className="text-xs text-slate-400">({doctor.reviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {doctor.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-400">Experience</p>
              <p className="text-sm font-bold text-slate-700">{doctor.experience} yrs</p>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="text-center">
              <p className="text-xs text-slate-400">Fee</p>
              <p className="text-sm font-bold text-slate-700">₹{doctor.fee}</p>
            </div>
          </div>

          <button
            onClick={handleBook}
            className="px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 active:scale-95 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
