import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Smile 
} from 'lucide-react';
import { MetricCard } from '../../types';

const metrics: MetricCard[] = [
  {
    id: '1',
    title: 'Journal Entries',
    value: '28',
    change: 12.5,
    icon: 'BookOpen',
    color: 'primary',
  },
  {
    id: '2',
    title: 'Writing Streak',
    value: '7 days',
    change: 4.2,
    icon: 'Calendar',
    color: 'secondary',
  },
  {
    id: '3',
    title: 'Avg. Writing Time',
    value: '15 mins',
    change: 8.1,
    icon: 'Clock',
    color: 'accent',
  },
  {
    id: '4',
    title: 'Mood Score',
    value: '8.5/10',
    change: 2.3,
    icon: 'Smile',
    color: 'success',
  },
];

const iconMap = {
  BookOpen,
  Calendar,
  Clock,
  Smile,
};

const MetricsPanel: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-500 dark:bg-primary-600',
      secondary: 'bg-secondary-500 dark:bg-secondary-600',
      accent: 'bg-accent-500 dark:bg-accent-600',
      success: 'bg-success-500 dark:bg-success-600',
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Journal Insights</h2>
        <div className="flex space-x-2">
          <select className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {metrics.map((metric) => {
          const Icon = iconMap[metric.icon as keyof typeof iconMap];
          
          return (
            <motion.div 
              key={metric.id}
              className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-4 border border-surface-200 dark:border-surface-700"
              variants={item}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${getColorClass(metric.color)} text-white mr-3`}>
                    {Icon && <Icon size={18} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">{metric.title}</h3>
                    <p className="text-xl font-semibold mt-1">{metric.value}</p>
                  </div>
                </div>
                <div className={`flex items-center text-xs font-medium ${
                  metric.change >= 0 
                    ? 'text-success-600 dark:text-success-500' 
                    : 'text-error-600 dark:text-error-500'
                }`}>
                  {metric.change >= 0 ? (
                    <TrendingUp size={14} className="mr-1" />
                  ) : (
                    <TrendingDown size={14} className="mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              
              <div className="mt-3 h-1 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${getColorClass(metric.color)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(metric.change) * 5, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MetricsPanel