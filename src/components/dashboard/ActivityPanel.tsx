import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../../types';
import { Clock, User } from 'lucide-react';

// Replace activities array with expenses
const expenses = [
  {
    id: '1',
    amount: 1200,
    category: 'Food',
    description: 'Lunch at restaurant',
    date: '2 hours ago',
    paymentMethod: 'Card',
  },
  {
    id: '2',
    amount: 500,
    category: 'Transport',
    description: 'Taxi ride',
    date: '3 hours ago',
    paymentMethod: 'Cash',
  },
  {
    id: '3',
    amount: 2000,
    category: 'Shopping',
    description: 'Bought new shoes',
    date: '5 hours ago',
    paymentMethod: 'UPI',
  },
  {
    id: '4',
    amount: 350,
    category: 'Groceries',
    description: 'Supermarket',
    date: '6 hours ago',
    paymentMethod: 'Card',
  },
  {
    id: '5',
    amount: 800,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '8 hours ago',
    paymentMethod: 'Wallet',
  },
];

const ExpensesPanel: React.FC = () => {
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
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <div className="flex items-center text-sm text-surface-500">
          <span>Today</span>
        </div>
      </div>
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {expenses.map((expense) => (
          <motion.div 
            key={expense.id}
            className="flex items-start gap-3 pb-4 border-b border-surface-200 dark:border-surface-700 last:border-0"
            variants={item}
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30">
              <span className="font-bold text-accent-600 dark:text-accent-400">₹{expense.amount}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{expense.category}</span>
                <span className="text-surface-600 dark:text-surface-400"> — {expense.description}</span>
              </p>
              <div className="flex items-center mt-1 text-xs text-surface-500">
                <span>{expense.paymentMethod} • {expense.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
          View all expenses
        </button>
      </div>
    </div>
  );
};

export default ExpensesPanel;