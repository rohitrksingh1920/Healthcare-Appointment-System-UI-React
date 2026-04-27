import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy loaded pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const DoctorDetailPage = lazy(() => import('./pages/DoctorDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Pages that need footer
const WithFooter = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<WithFooter><HomePage /></WithFooter>} />
                <Route path="/doctors" element={<WithFooter><DoctorsPage /></WithFooter>} />
                <Route path="/doctors/:id" element={<WithFooter><DoctorDetailPage /></WithFooter>} />
                <Route path="/about" element={<WithFooter><AboutPage /></WithFooter>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route path="/book/:doctorId" element={
                  <ProtectedRoute><BookingPage /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><WithFooter><ProfilePage /></WithFooter></ProtectedRoute>
                } />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
