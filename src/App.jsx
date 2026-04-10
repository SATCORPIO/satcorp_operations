import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import AdminPortal from './pages/AdminPortal';
import ClientPortal from './pages/ClientPortal';
import GenDashV2 from './pages/projects/GenDashV2';
import Par450k from './pages/projects/450kPar';
import XOIClient from './pages/projects/XOIClient';
import XOIAudit from './pages/projects/XOIAudit';
import DualCore900 from './pages/projects/dualcore-900';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>INITIALIZING SYSTEM...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminPortal />
          </ProtectedRoute>
        } />
        
        <Route path="/portal" element={
          <ProtectedRoute roles={['client']}>
            <ClientPortal />
          </ProtectedRoute>
        } />
        
        {/* Project Routes */}
        <Route path="/gendashv2" element={
          <ProtectedRoute>
            <GenDashV2 />
          </ProtectedRoute>
        } />
        
        <Route path="/450kpar" element={
          <ProtectedRoute>
            <Par450k />
          </ProtectedRoute>
        } />
        
        <Route path="/xoi-client" element={
          <ProtectedRoute>
            <XOIClient />
          </ProtectedRoute>
        } />

        <Route path="/xoi-audit" element={
          <ProtectedRoute>
            <XOIAudit />
          </ProtectedRoute>
        } />

        <Route path="/dualcore-900" element={
          <ProtectedRoute>
            <DualCore900 />
          </ProtectedRoute>
        } />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
