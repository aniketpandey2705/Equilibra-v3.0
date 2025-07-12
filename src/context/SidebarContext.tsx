import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  expandSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Auto-collapse sidebar when navigating to content pages (only on mobile)
  useEffect(() => {
    const contentPages = ['/write', '/entries', '/expenses', '/academic', '/goals'];
    const isContentPage = contentPages.includes(location.pathname);
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    
    if (isContentPage && !isCollapsed && isMobile) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const expandSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const value: SidebarContextType = {
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    isCollapsed,
    toggleCollapsed,
    expandSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}; 