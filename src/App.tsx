import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth, JournalEntriesProvider } from './context/AuthContext';
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
import Chatbot from './components/Chatbot';
import ChatButton from './components/ChatButton';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isSidebarOpen, toggleSidebar, isCollapsed } = useSidebar();
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [showChatbotIntro, setShowChatbotIntro] = React.useState(() => {
    // Only show once per session
    return sessionStorage.getItem('briLowIntroShown') !== 'true';
  });
  const [introStep, setIntroStep] = React.useState(0);

  const introSteps = [
    {
      title: 'Meet BriLow',
      subtitle: 'Your AI assistant is here to help!',
      icon: (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/10 mx-auto mb-4">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="4" fill="#6366F1"/><rect x="8" y="3" width="8" height="4" rx="2" fill="#6366F1"/><circle cx="8.5" cy="12" r="1.5" fill="#fff"/><circle cx="15.5" cy="12" r="1.5" fill="#fff"/></svg>
        </div>
      ),
      content: 'Smart Assistance',
      description: 'Get help with any feature or question about Equilibria',
    },
    {
      title: 'Instant Answers',
      subtitle: 'Ask BriLow about your dashboard, analytics, or how to use features.',
      icon: (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/10 mx-auto mb-4">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="4" fill="#6366F1"/><rect x="8" y="3" width="8" height="4" rx="2" fill="#6366F1"/><circle cx="8.5" cy="12" r="1.5" fill="#fff"/><circle cx="15.5" cy="12" r="1.5" fill="#fff"/></svg>
        </div>
      ),
      content: 'Just click the chat button at the bottom right!',
      description: 'BriLow is always available to assist you.',
    },
    {
      title: 'Pro Tip',
      subtitle: 'Press Ctrl+K anytime to open BriLow instantly.',
      icon: (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/10 mx-auto mb-4">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="4" fill="#6366F1"/><rect x="8" y="3" width="8" height="4" rx="2" fill="#6366F1"/><circle cx="8.5" cy="12" r="1.5" fill="#fff"/><circle cx="15.5" cy="12" r="1.5" fill="#fff"/></svg>
        </div>
      ),
      content: 'Keyboard Shortcut',
      description: 'Open BriLow from anywhere in Equilibria.',
    },
  ];

  const handleCloseIntro = () => {
    setShowChatbotIntro(false);
    sessionStorage.setItem('briLowIntroShown', 'true');
  };
  const handleNextIntro = () => {
    if (introStep < introSteps.length - 1) {
      setIntroStep(introStep + 1);
    } else {
      handleCloseIntro();
    }
  };

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
          {/* Chatbot Intro Popup */}
          {showChatbotIntro && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
              <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl rounded-2xl p-8 max-w-sm w-full relative animate-fade-in-up">
                <button onClick={handleCloseIntro} className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <span className="sr-only">Close</span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" /></svg>
                </button>
                {introSteps[introStep].icon}
                <h2 className="text-2xl font-bold text-center mb-1 text-surface-900 dark:text-surface-100">{introSteps[introStep].title}</h2>
                <p className="text-center text-surface-600 dark:text-surface-300 mb-2">{introSteps[introStep].subtitle}</p>
                <div className="flex flex-col items-center mb-4">
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-base">{introSteps[introStep].content}</span>
                  <span className="text-xs text-surface-500 dark:text-surface-400 mt-1">{introSteps[introStep].description}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  {introSteps.map((_, idx) => (
                    <span key={idx} className={`w-2 h-2 rounded-full ${idx === introStep ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-700'}`}></span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={handleCloseIntro} className="text-surface-500 hover:text-primary-600 text-sm font-medium px-3 py-2">Skip</button>
                  <button onClick={handleNextIntro} className="btn btn-primary px-6 py-2 text-sm font-semibold">{introStep === introSteps.length - 1 ? 'Finish' : 'Next'}</button>
                </div>
              </div>
            </div>
          )}
          {/* Global Chatbot Components */}
          <ChatButton onClick={() => setIsChatbotOpen(true)} />
          <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
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
            <JournalEntriesProvider>
              <AppContent />
            </JournalEntriesProvider>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;