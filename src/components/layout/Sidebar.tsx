import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  PenTool,
  BookOpen,
  Calendar,
  Target,
  ChevronLeft,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { isCollapsed, toggleCollapsed, expandSidebar } = useSidebar();
  
  // If sidebar is not open, don't render anything
  if (!isOpen) return null;
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', active: location.pathname === '/' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses', active: location.pathname === '/expenses' },
    { icon: GraduationCap, label: 'Academic', path: '/academic', active: location.pathname === '/academic' },
    { icon: PenTool, label: 'Write', path: '/write', active: location.pathname === '/write' },
    { icon: BookOpen, label: 'Entries', path: '/entries', active: location.pathname === '/entries' },
    { icon: Calendar, label: 'Goals', path: '/goals', active: location.pathname === '/goals', badge: 2 },
  ];

  const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help', active: location.pathname === '/help' },
    { icon: LogOut, label: 'Log out', path: '/logout', active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/50 z-20 lg:hidden"
        onClick={expandSidebar}
      />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? '4rem' : '16rem' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-full bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 z-30 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white font-bold flex-shrink-0">E</div>
            <motion.h1 
              className="text-xl font-semibold tracking-tight truncate"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              Equilibria
            </motion.h1>
          </div>
          
          {/* Toggle button - only show on desktop */}
          <motion.button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors flex-shrink-0"
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </motion.button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 relative group ${
                  item.active 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon size={18} className="flex-shrink-0" />
                  <motion.span
                    className="truncate"
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <motion.span 
                    className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-full flex-shrink-0"
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.badge}
                  </motion.span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-0 border-r-4 border-t-2 border-b-2 border-transparent border-r-surface-900 dark:border-r-surface-100"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
          
          {/* Categories section - only show when expanded */}
          <motion.div 
            className="mt-6"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Categories
            </h3>
            <div className="mt-2 space-y-1">
              <Link to="/category/personal" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700/50">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold mr-3">
                  P
                </div>
                <span>Personal</span>
              </Link>
              <Link to="/category/work" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700/50">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold mr-3">
                  W
                </div>
                <span>Work</span>
              </Link>
              <Link to="/category/goals" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700/50">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold mr-3">
                  G
                </div>
                <span>Goals</span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom navigation */}
        <div className="p-3 border-t border-surface-200 dark:border-surface-700">
          <div className="space-y-1">
            {bottomNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700/50 relative group"
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <motion.span
                  className="ml-3 truncate"
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-0 border-r-4 border-t-2 border-b-2 border-transparent border-r-surface-900 dark:border-r-surface-100"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;