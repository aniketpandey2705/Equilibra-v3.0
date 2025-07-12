import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Write from './pages/Write';
import Entries from './pages/Entries';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Auth from './pages/Auth';
import Expenses from './pages/Expenses';
import Academic from './pages/Academic';
import Landing from './pages/Landing';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isSidebarOpen, toggleSidebar, isCollapsed } = useSidebar();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-100 dark:bg-surface-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 transition-all duration-150 ease-in-out ${isSidebarOpen ? (isCollapsed ? 'lg:ml-16' : 'lg:ml-64') : 'lg:ml-0'}`}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/write" element={<Write />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;