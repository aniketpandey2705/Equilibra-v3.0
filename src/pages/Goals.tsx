import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Plus } from 'lucide-react';
import { goalAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  dueDate?: string;
  progress?: number;
  daysCompleted?: number;
  totalDays?: number;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    description: '', 
    category: 'personal',
    targetValue: 100,
    currentValue: 0,
    dueDate: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  // Sample goals data
  const sampleGoals = [
    {
      id: '1',
      title: 'Complete React Course',
      description: 'Finish the advanced React course on Udemy',
      category: 'education',
      targetValue: 100,
      currentValue: 75,
      isCompleted: false,
      dueDate: '2024-02-15',
      progress: 75,
      daysCompleted: 15,
      totalDays: 20
    },
    {
      id: '2',
      title: 'Save ₹50,000',
      description: 'Save money for emergency fund',
      category: 'finance',
      targetValue: 50000,
      currentValue: 35000,
      isCompleted: false,
      dueDate: '2024-03-31',
      progress: 70,
      daysCompleted: 45,
      totalDays: 90
    },
    {
      id: '3',
      title: 'Run 5km Daily',
      description: 'Build running habit for fitness',
      category: 'health',
      targetValue: 30,
      currentValue: 18,
      isCompleted: false,
      dueDate: '2024-02-28',
      progress: 60,
      daysCompleted: 18,
      totalDays: 30
    }
  ];

  const fetchGoals = async () => {
    try {
      if (!user) return;
      const result = await goalAPI.getGoals(user.uid);
      let goals: Goal[] = [];
      if (Array.isArray(result)) {
        goals = result;
      } else if (result && Array.isArray(result.goals)) {
        goals = result.goals;
      }
      // Ensure all goals have a string id
      setGoals(goals.filter(g => typeof g.id === 'string' && g.id));
    } catch (error) {
      setGoals(sampleGoals);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) return;
      await goalAPI.createGoal({
        id: String(Date.now()), // ensure id is a string
        userId: user.uid,
        ...newGoal,
        dueDate: newGoal.dueDate || undefined
      });
      setShowAddGoalModal(false);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        targetValue: 100,
        currentValue: 0,
        dueDate: ''
      });
      fetchGoals();
    } catch (error) {
      alert('Failed to add goal');
    } finally {
      setLoading(false);
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
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowAddGoalModal(true)}>
            <Plus size={18} />
            New Goal
          </button>
        </div>
        {/* Add Goal Modal */}
        {showAddGoalModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" className="input w-full" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input w-full" value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="input w-full" value={newGoal.category} onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Value</label>
                  <input type="number" className="input w-full" value={newGoal.targetValue} onChange={e => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" className="input w-full" value={newGoal.dueDate} onChange={e => setNewGoal({ ...newGoal, dueDate: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddGoalModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Goal'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
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