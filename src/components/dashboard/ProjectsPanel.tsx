import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { MoreHorizontal } from 'lucide-react';

// Replace projects array with academic records
const academicRecords = [
  {
    id: '1',
    subject: 'Mathematics',
    description: 'Algebra, Calculus, Geometry',
    progress: 90,
    grade: 'A',
    semester: 'Spring 2024',
    updated: '2d ago',
  },
  {
    id: '2',
    subject: 'Physics',
    description: 'Mechanics, Optics, Thermodynamics',
    progress: 85,
    grade: 'A-',
    semester: 'Spring 2024',
    updated: '3d ago',
  },
  {
    id: '3',
    subject: 'Chemistry',
    description: 'Organic, Inorganic, Physical',
    progress: 78,
    grade: 'B+',
    semester: 'Spring 2024',
    updated: '5d ago',
  },
  {
    id: '4',
    subject: 'English',
    description: 'Literature, Writing, Comprehension',
    progress: 95,
    grade: 'A',
    semester: 'Spring 2024',
    updated: '1d ago',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success-500';
    case 'in-progress':
      return 'bg-accent-500';
    case 'planned':
      return 'bg-primary-500';
    default:
      return 'bg-surface-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300';
    case 'in-progress':
      return 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300';
    case 'planned':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
    default:
      return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'planned':
      return 'Planned';
    default:
      return status;
  }
};

const AcademicPanel: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Academic Overview</h2>
        <div className="flex items-center gap-2">
          <select className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600">
            <option>All Semesters</option>
            <option>Spring 2024</option>
            <option>Fall 2023</option>
          </select>
        </div>
      </div>
      <motion.div 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {academicRecords.map((record) => (
          <motion.div 
            key={record.id}
            className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-lg border border-surface-200 dark:border-surface-700"
            variants={item}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{record.subject}</h3>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                    {record.grade}
                  </span>
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{record.description}</p>
              </div>
              <div className="text-xs text-surface-600 dark:text-surface-400">
                {record.semester}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{record.progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${record.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-surface-600 dark:text-surface-400">
                Updated {record.updated}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
          View all academic records
        </button>
      </div>
    </div>
  );
};

export default AcademicPanel;