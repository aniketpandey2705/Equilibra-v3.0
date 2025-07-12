import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Book, Clock, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { subject: 'Math', score: 85, average: 75 },
  { subject: 'Science', score: 92, average: 78 },
  { subject: 'English', score: 88, average: 80 },
  { subject: 'History', score: 78, average: 72 },
  { subject: 'Geography', score: 90, average: 76 },
];

const progressData = [
  { month: 'Jan', performance: 75 },
  { month: 'Feb', performance: 82 },
  { month: 'Mar', performance: 78 },
  { month: 'Apr', performance: 85 },
  { month: 'May', performance: 90 },
  { month: 'Jun', performance: 88 },
];

const Academic: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Academic Performance</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track your academic progress and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Overall GPA</p>
                <h3 className="text-2xl font-bold">3.8</h3>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <GraduationCap className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="text-success-500 mr-1" size={16} />
              <span className="text-success-500 font-medium">0.2</span>
              <span className="text-surface-600 dark:text-surface-400 ml-1">vs last semester</span>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Study Hours</p>
                <h3 className="text-2xl font-bold">24.5</h3>
              </div>
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                <Clock className="text-secondary-600 dark:text-secondary-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="text-success-500 mr-1" size={16} />
              <span className="text-success-500 font-medium">2.5</span>
              <span className="text-surface-600 dark:text-surface-400 ml-1">hours this week</span>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Courses</p>
                <h3 className="text-2xl font-bold">6</h3>
              </div>
              <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <Book className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-surface-600 dark:text-surface-400">Current semester</span>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Achievements</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <Award className="text-success-600 dark:text-success-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-surface-600 dark:text-surface-400">3 new this month</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Performance Trend</h2>
              <select className="text-sm px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
                <option>This Semester</option>
                <option>Last Semester</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    dot={{ fill: '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Subject Performance</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="average" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Academic;