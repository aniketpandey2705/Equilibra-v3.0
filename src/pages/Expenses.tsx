import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Filter, Calendar, Tag, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import ManageBudgetModal from '../components/expenses/ManageBudgetModal';

// Sample data for expenses by day
const expenseData = [
  { date: 'Mon', amount: 45 },
  { date: 'Tue', amount: 30 },
  { date: 'Wed', amount: 65 },
  { date: 'Thu', amount: 25 },
  { date: 'Fri', amount: 55 },
  { date: 'Sat', amount: 40 },
  { date: 'Sun', amount: 35 },
];

// Enhanced category data with budget allocations
const categoryData = [
  { name: 'Food', value: 35, color: '#4F46E5', budget: 200, spent: 175 },
  { name: 'Transport', value: 25, color: '#0D9488', budget: 150, spent: 125 },
  { name: 'Entertainment', value: 20, color: '#F59E0B', budget: 100, spent: 100 },
  { name: 'Shopping', value: 15, color: '#EF4444', budget: 120, spent: 75 },
  { name: 'Utilities', value: 5, color: '#6B7280', budget: 80, spent: 25 },
];

// Savings data
const savingsData = [
  { month: 'Jan', amount: 100 },
  { month: 'Feb', amount: 150 },
  { month: 'Mar', amount: 120 },
  { month: 'Apr', amount: 200 },
  { month: 'May', amount: 180 },
  { month: 'Jun', amount: 250 },
];

// Add these interfaces
interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

interface BudgetData {
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
  savingsGoal: number;
}

interface CategoryBudget {
  categoryId: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const Expenses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Convert category data to proper format for modals
  const categories: Category[] = categoryData.map((cat) => ({
    id: cat.name.toLowerCase(),
    name: cat.name,
    color: cat.color,
    budget: cat.budget,
    spent: cat.spent
  }));

  // Current budget data
  const currentBudget: BudgetData = {
    totalBudget: categoryData.reduce((sum, cat) => sum + cat.budget, 0),
    categoryBudgets: categories.map(cat => ({
      categoryId: cat.id,
      amount: categoryData.find(c => c.name === cat.name)?.budget || 0
    })),
    savingsGoal: 1000 // Default savings goal
  };

  const handleSaveExpense = (expenseData: ExpenseData) => {
    console.log('Saving expense:', expenseData);
    // Here you would integrate with your backend
    // For now, we'll just close the modal
    setShowAddExpenseModal(false);
  };

  const handleSaveBudget = (budgetData: BudgetData) => {
    console.log('Saving budget:', budgetData);
    // Here you would integrate with your backend
    // For now, we'll just close the modal
    setShowBudgetModal(false);
  };

  // Calculate total budget and spent
  const totalBudget = categoryData.reduce((sum, category) => sum + category.budget, 0);
  const totalSpent = categoryData.reduce((sum, category) => sum + category.spent, 0);
  const budgetPercentage = Math.round((totalSpent / totalBudget) * 100);
  
  // Calculate savings
  const potentialSavings = totalBudget - totalSpent;
  const currentSavings = 450; // This would come from actual data in a real app

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Expense Tracker</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Track, budget, and optimize your spending
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBudgetModal(true)}
              className="btn btn-outline flex items-center gap-2"
            >
              <Settings size={18} />
              Manage Budget
            </button>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Spent</p>
                <h3 className="text-2xl font-bold">${totalSpent.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <DollarSign className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="text-error-500 mr-1" size={16} />
              <span className="text-error-500 font-medium">12%</span>
              <span className="text-surface-600 dark:text-surface-400 ml-1">vs last week</span>
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
                <p className="text-sm text-surface-600 dark:text-surface-400">Monthly Budget</p>
                <h3 className="text-2xl font-bold">${totalBudget.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                <Wallet className="text-secondary-600 dark:text-secondary-400" size={24} />
              </div>
            </div>
            <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${budgetPercentage > 80 ? 'bg-error-500' : budgetPercentage > 60 ? 'bg-warning-500' : 'bg-success-500'}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-surface-600 dark:text-surface-400">
              <span>${totalSpent.toFixed(2)} spent</span>
              <span>${(totalBudget - totalSpent).toFixed(2)} remaining</span>
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
                <p className="text-sm text-surface-600 dark:text-surface-400">Current Savings</p>
                <h3 className="text-2xl font-bold">${currentSavings.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <PiggyBank className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success-500 font-medium mr-1">+${potentialSavings.toFixed(2)}</span>
              <span className="text-surface-600 dark:text-surface-400">potential savings this month</span>
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
                <p className="text-sm text-surface-600 dark:text-surface-400">Budget Status</p>
                <h3 className="text-2xl font-bold">{budgetPercentage}%</h3>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <DollarSign className="text-success-600 dark:text-success-400" size={24} />
              </div>
            </div>
            <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full">
              <div 
                className={`h-full rounded-full ${budgetPercentage > 80 ? 'bg-error-500' : budgetPercentage > 60 ? 'bg-warning-500' : 'bg-success-500'}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              ></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div 
            className="lg:col-span-2 card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Expense Trend</h2>
              <select 
                className="text-sm px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseData}>
                  <defs>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4F46E5" 
                    fillOpacity={1}
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
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
              <h2 className="text-lg font-semibold">Expense by Category</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">${category.spent} / ${category.budget}</span>
                    <div className="h-1 w-16 bg-surface-200 dark:bg-surface-700 rounded-full mt-1">
                      <div 
                        className={`h-full rounded-full ${(category.spent/category.budget) > 0.8 ? 'bg-error-500' : (category.spent/category.budget) > 0.6 ? 'bg-warning-500' : 'bg-success-500'}`}
                        style={{ width: `${Math.min((category.spent/category.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Savings Tracker</h2>
            <select className="text-sm px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#22C55E" 
                  fillOpacity={1}
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Saved</p>
              <h3 className="text-xl font-bold mt-1">${currentSavings.toFixed(2)}</h3>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-sm text-surface-600 dark:text-surface-400">Potential Savings</p>
              <h3 className="text-xl font-bold mt-1">${potentialSavings.toFixed(2)}</h3>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-sm text-surface-600 dark:text-surface-400">Savings Goal</p>
              <h3 className="text-xl font-bold mt-1">$1,000.00</h3>
              <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full mt-2">
                <div 
                  className="h-full bg-success-500 rounded-full"
                  style={{ width: `${Math.min((currentSavings/1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Expense Modal */}
        <AddExpenseModal 
          isOpen={showAddExpenseModal}
          onClose={() => setShowAddExpenseModal(false)}
          onSave={handleSaveExpense}
          categories={categories}
        />

        {/* Manage Budget Modal */}
        <ManageBudgetModal 
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
          categories={categories}
          currentBudget={currentBudget}
        />
      </div>
    </div>
  );
};

export default Expenses;