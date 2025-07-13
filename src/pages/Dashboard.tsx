import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';
import ActivityPanel from '../components/dashboard/ActivityPanel';
import ProjectsPanel from '../components/dashboard/ProjectsPanel';
import Chatbot from '../components/Chatbot';
import ChatButton from '../components/ChatButton';
import { Clock, Trophy, Target, TrendingUp, PenTool, DollarSign, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../lib/api';

interface DashboardData {
  journalAnalytics: {
    totalEntries: number;
    totalWords: number;
    averageWords: number;
  };
  expenseAnalytics: {
    totalAmount: number;
    averageDaily: number;
    totalTransactions: number;
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
  };
  academicAnalytics: {
    overallGPA: number;
    totalRecords: number;
  };
  streaks: {
    current: number;
    longest: number;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboardData(user.uid);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      title: 'Write Entry',
      description: 'Start writing today\'s journal entry',
      icon: PenTool,
      color: 'primary',
      action: () => navigate('/write')
    },
    {
      title: 'Track Expenses',
      description: 'Add new expense or view spending',
      icon: DollarSign,
      color: 'secondary',
      action: () => navigate('/expenses')
    },
    {
      title: 'Academic Progress',
      description: 'Check your academic performance',
      icon: GraduationCap,
      color: 'accent',
      action: () => navigate('/academic')
    },
    {
      title: 'Browse Entries',
      description: 'Read your past journal entries',
      icon: BookOpen,
      color: 'success',
      action: () => navigate('/entries')
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50',
      secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-900/50',
      accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 hover:bg-accent-200 dark:hover:bg-accent-900/50',
      success: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 hover:bg-success-200 dark:hover:bg-success-900/50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 min-h-screen">
      {/* BriLow Banner */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-primary-600 text-white rounded-xl px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="4" fill="#fff" fillOpacity="0.2"/><rect x="8" y="3" width="8" height="4" rx="2" fill="#fff" fillOpacity="0.2"/><circle cx="8.5" cy="12" r="1.5" fill="#fff"/><circle cx="15.5" cy="12" r="1.5" fill="#fff"/></svg>
            </span>
            <span className="font-semibold text-lg">Talk to BriLow (chatbot) to navigate all these features</span>
          </div>
          <button
            className="bg-white text-primary-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-primary-50 transition"
            onClick={() => setIsChatbotOpen(true)}
          >
            Chat Now
          </button>
        </div>
      </div>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.displayName || user?.email || 'User'}</h1>
            <p className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
              <Clock size={16} />
              <span>Welcome back to your productivity dashboard</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-surface-800/50 rounded-xl backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/50">
              <Trophy size={20} className="text-primary-500" />
              <div>
                <div className="text-sm font-medium">Current Streak</div>
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {dashboardData?.streaks.current || 0} days
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/write')}
              className="btn btn-primary"
            >
              Write Today's Entry
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="mb-8"
        {...fadeIn}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-xl transition-all duration-200 text-left ${getColorClasses(action.color)}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <action.icon size={24} />
                <h3 className="font-semibold">{action.title}</h3>
              </div>
              <p className="text-sm opacity-80">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <motion.div 
          className="card-glass"
          {...fadeIn}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Journal Entries</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardData?.journalAnalytics.totalEntries || 0}</h3>
            </div>
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <BookOpen size={24} className="text-primary-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-surface-500">
              {dashboardData?.journalAnalytics.totalWords || 0} total words
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-glass"
          {...fadeIn}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1">${dashboardData?.expenseAnalytics.totalAmount.toFixed(2) || '0.00'}</h3>
            </div>
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
              <DollarSign size={24} className="text-secondary-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-surface-500">
              {dashboardData?.expenseAnalytics.totalTransactions || 0} transactions
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-glass"
          {...fadeIn}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Active Goals</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardData?.goals.inProgress || 0}</h3>
            </div>
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <Target size={24} className="text-accent-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-surface-500">
              {dashboardData?.goals.completed || 0} completed
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-glass"
          {...fadeIn}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Academic GPA</p>
              <h3 className="text-2xl font-bold mt-1">{dashboardData?.academicAnalytics.overallGPA.toFixed(1) || '0.0'}</h3>
            </div>
            <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <GraduationCap size={24} className="text-success-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-surface-500">
              {dashboardData?.academicAnalytics.totalRecords || 0} records
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="lg:col-span-2"
          {...fadeIn} 
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnalyticsPanel />
        </motion.div>
        
        <motion.div 
          {...fadeIn} 
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <ProjectsPanel />
        </motion.div>
        
        <motion.div 
          {...fadeIn} 
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <ActivityPanel />
        </motion.div>
      </div>
      
      {/* Chatbot Components */}
      <ChatButton onClick={() => setIsChatbotOpen(true)} />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Dashboard;