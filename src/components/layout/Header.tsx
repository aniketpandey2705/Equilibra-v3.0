import React, { useState } from 'react';
import { Bell, Search, Menu, X, Moon, Sun, Settings, HelpCircle, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed } = useSidebar();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { signOut } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: '1', title: 'New update available', message: 'Equilibria v1.2 is now available with new features', time: '2 min ago', read: false, type: 'info' },
    { id: '2', title: 'Server maintenance', message: 'Scheduled maintenance in 24 hours', time: '1 hour ago', read: false, type: 'warning' },
    { id: '3', title: 'Project milestone reached', message: 'Alpha phase completed successfully', time: '3 hours ago', read: true, type: 'success' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700 sticky top-0 z-30 transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white font-bold">E</div>
            <h1 className="text-xl font-semibold tracking-tight ml-2">Equilibria</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center px-3 py-1.5 gap-2 bg-surface-100 dark:bg-surface-700 rounded-lg w-72 lg:w-96">
          <Search size={18} className="text-surface-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-0 focus:outline-none text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
            
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-surface-200 dark:border-surface-700 ${
                          notification.read ? 'opacity-60' : ''
                        } hover:bg-surface-50 dark:hover:bg-surface-700/50`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${
                            notification.type === 'info' ? 'bg-primary-500' :
                            notification.type === 'warning' ? 'bg-warning-500' :
                            notification.type === 'error' ? 'bg-error-500' : 'bg-success-500'
                          }`}></div>
                          <div>
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">{notification.message}</p>
                            <span className="text-xs text-surface-500 dark:text-surface-500 mt-2 block">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3">
                    <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium py-2">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hidden sm:block">
            <HelpCircle size={20} />
          </button>
          
          <button className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hidden sm:block">
            <Settings size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 ml-1 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <img 
                src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || user?.email || 'User') + '&background=random'}
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-sm hidden lg:block">{user?.displayName || user?.email || 'User'}</span>
            </button>
            
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || user?.email || 'User') + '&background=random'}
                        alt="User profile" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{user?.displayName || user?.email || 'User'}</h3>
                        <p className="text-xs text-surface-600 dark:text-surface-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-700/50">
                      <User size={16} />
                      <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-700/50">
                      <Settings size={16} />
                      <span>Settings</span>
                    </a>
                  </div>
                  
                  <div className="p-2 border-t border-surface-200 dark:border-surface-700">
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 p-2 text-sm bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;