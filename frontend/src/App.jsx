import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfileManager } from './pages/admin/ProfileManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { SkillsManager } from './pages/admin/SkillsManager';
import { EducationManager } from './pages/admin/EducationManager';
import { CertificatesManager } from './pages/admin/CertificatesManager';
import { MessagesManager } from './pages/admin/MessagesManager';

// Auto scroll to top on every route transition
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Protected Route Guard for Admin views
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('harish_portfolio_theme', 'dark');
  }, []);

  return (
    <>
      <ScrollToTopOnNavigate />
      <Routes>
      {/* Public Facing Portfolio */}
      <Route path="/" element={<PublicPortfolio />} />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Private Admin Dashboard (Protected Routes) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<ProfileManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="education" element={<EducationManager />} />
        <Route path="certificates" element={<CertificatesManager />} />
        <Route path="messages" element={<MessagesManager />} />
      </Route>

      {/* Fallback to Public Portfolio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};

export default App;
