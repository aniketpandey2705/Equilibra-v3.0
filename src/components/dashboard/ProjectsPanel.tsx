import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { MoreHorizontal } from 'lucide-react';

const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Revamp the company website with modern UI/UX',
    progress: 75,
    status: 'in-progress',
    team: [
      { id: '1', name: 'Emma Smith', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '2', name: 'Alex Johnson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '3', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Build a cross-platform mobile application',
    progress: 35,
    status: 'in-progress',
    team: [
      { id: '2', name: 'Alex Johnson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '4', name: 'Michael Brown', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ]
  },
  {
    id: '3',
    name: 'Q2 Marketing Campaign',
    description: 'Plan and execute marketing strategy for Q2',
    progress: 100,
    status: 'completed',
    team: [
      { id: '3', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { id: '5', name: 'Jessica Lee', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ]
  },
  {
    id: '4',
    name: 'Financial Report',
    description: 'Compile Q2 financial performance report',
    progress: 0,
    status: 'planned',
    team: [
      { id: '4', name: 'Michael Brown', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ]
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

const ProjectsPanel: React.FC = () => {
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
        <h2 className="text-lg font-semibold">Current Projects</h2>
        <div className="flex items-center gap-2">
          <select className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600">
            <option>All Projects</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Planned</option>
          </select>
        </div>
      </div>
      
      <motion.div 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-lg border border-surface-200 dark:border-surface-700"
            variants={item}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusBadge(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{project.description}</p>
              </div>
              
              <div className="relative">
                <button className="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${getStatusColor(project.status)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <img 
                    key={member.id} 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-surface-800"
                    title={member.name}
                  />
                ))}
                {project.team.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-surface-800">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-surface-600 dark:text-surface-400">
                Updated 2d ago
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
          View all projects
        </button>
      </div>
    </div>
  );
};

export default ProjectsPanel;