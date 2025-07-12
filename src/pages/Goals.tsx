import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Plus } from 'lucide-react';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await getGoals(user.uid);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Writing Goals</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Track your progress and set new writing goals
            </p>
          </div>
          
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Goal
          </button>
        </div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <span className="text-sm text-surface-500">{goal.category}</span>
                </div>
                <Target size={20} className="text-primary-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                
                <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-surface-500">
                  <span>{goal.daysCompleted} days completed</span>
                  <span>{goal.totalDays} days total</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
                    <CheckCircle2 size={16} />
                    Mark Complete
                  </button>
                  <button className="flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
                    <Circle size={16} />
                    Edit Goal
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Goals;