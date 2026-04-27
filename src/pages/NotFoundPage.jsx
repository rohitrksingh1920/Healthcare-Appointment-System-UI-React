import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50 p-4 page-enter">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🏥</div>
        <h1 className="text-6xl font-bold text-sky-600 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to good health.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
