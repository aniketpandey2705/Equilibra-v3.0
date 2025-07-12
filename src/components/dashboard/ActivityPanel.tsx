import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../../types';
import { Clock, User } from 'lucide-react';

const activities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Emma Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    action: 'completed task',
    target: 'Website redesign',
    time: '2 hours ago'
  },
  {
    id: '2',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    action: 'commented on',
    target: 'Mobile app development',
    time: '3 hours ago'
  },
  {
    id: '3',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    action: 'created project',
    target: 'New marketing campaign',
    time: '5 hours ago'
  },
  {
    id: '4',
    user: {
      name: 'Michael Brown',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    action: 'uploaded document',
    target: 'Q2 Financial Report',
    time: '6 hours ago'
  },
  {
    id: '5',
    user: {
      name: 'Jessica Lee',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    action: 'assigned task to',
    target: 'John Doe',
    time: '8 hours ago'
  }
];

const ActivityPanel: React.FC = () => {
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="flex items-center text-sm text-surface-500">
          <Clock size={14} className="mr-1" />
          <span>Today</span>
        </div>
      </div>
      
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {activities.map((activity) => (
          <motion.div 
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-surface-200 dark:border-surface-700 last:border-0"
            variants={item}
          >
            <div className="flex-shrink-0 w-8 h-8">
              <img 
                src={activity.user.avatar} 
                alt={activity.user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-surface-600 dark:text-surface-400"> {activity.action} </span>
                <span className="font-medium">{activity.target}</span>
              </p>
              <div className="flex items-center mt-1 text-xs text-surface-500">
                <Clock size={12} className="mr-1" />
                <span>{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityPanel;