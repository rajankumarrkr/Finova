import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { Toast } from './components/ui/Toast';

// Modals
import { InvestModal } from './components/modals/InvestModal';
import { DepositModal } from './components/modals/DepositModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { AddBankModal } from './components/modals/AddBankModal';
import { SupportModal } from './components/modals/SupportModal';

// Pages
import { Home } from './pages/Home';
import { Plans } from './pages/Plans';
import { Team } from './pages/Team';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { BankAccount } from './pages/BankAccount';
import { MyInvestments } from './pages/MyInvestments';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-emerald-400">Connecting to Finova Network...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#031C12] text-slate-100 flex flex-col antialiased relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">
        {/* Ambient Emerald & Gold Backdrops */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#F4D06F]/5 rounded-full blur-3xl pointer-events-none" />
        <main className="flex-1 flex items-center justify-center p-3.5 sm:p-6 lg:p-8 relative z-10 w-full">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Sticky Header */}
        <Header />

        {/* Page Content Container with bottom padding for mobile navigation */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank-account"
              element={
                <ProtectedRoute>
                  <BankAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-investments"
              element={
                <ProtectedRoute>
                  <MyInvestments />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavigation />
      </div>

      {/* Global Modals & Toast System */}
      <InvestModal />
      <DepositModal />
      <WithdrawModal />
      <AddBankModal />
      <SupportModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}
