import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FamilyStateProvider } from './context/FamilyStateContext';
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
import { MedicalTimeline } from './pages/MedicalTimeline';
import { Appointments } from './pages/Appointments';
import { MedicationReminders } from './pages/MedicationReminders';
import { EmergencySummary } from './pages/EmergencySummary';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Mock login authorization guard
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
            path="/timeline" 
            element={
              <ProtectedRoute>
                <MedicalTimeline />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reminders" 
            element={
              <ProtectedRoute>
                <MedicationReminders />
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
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
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
