import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FamilyStateProvider, useFamilyState } from './context/FamilyStateContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MemberProfile } from './pages/MemberProfile';
import { AIChat } from './pages/AIChat';
import { UploadReport } from './pages/UploadReport';
import { FamilyManagement } from './pages/FamilyManagement';
import { EmergencySummary } from './pages/EmergencySummary';
import { Todos } from './pages/Todos';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <FamilyStateProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routing */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Workspace Routing */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/family" 
            element={
              <ProtectedRoute>
                <FamilyManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/family/:id" 
            element={
              <ProtectedRoute>
                <MemberProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadReport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/emergency" 
            element={
              <ProtectedRoute>
                <EmergencySummary />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/todos" 
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            } 
          />

          {/* Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FamilyStateProvider>
  );
}

export default App;
