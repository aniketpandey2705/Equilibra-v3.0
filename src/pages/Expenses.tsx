import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Wallet, PiggyBank, Settings, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import ManageBudgetModal from '../components/expenses/ManageBudgetModal';
import { expenseAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

interface CategoryBudget {
  categoryId: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
}

interface BudgetData {
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
  savingsGoal: number;
}

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentBudget, setCurrentBudget] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Sample data for demonstration
  const sampleExpenses = [
    { id: '1', amount: 2500, category: 'food', description: 'Grocery shopping', date: '2024-01-15', paymentMethod: 'card' },
    { id: '2', amount: 1200, category: 'transport', description: 'Fuel for car', date: '2024-01-14', paymentMethod: 'card' },
    { id: '3', amount: 800, category: 'entertainment', description: 'Movie tickets', date: '2024-01-13', paymentMethod: 'cash' },
    { id: '4', amount: 1500, category: 'shopping', description: 'New clothes', date: '2024-01-12', paymentMethod: 'card' },
    { id: '5', amount: 300, category: 'food', description: 'Restaurant dinner', date: '2024-01-11', paymentMethod: 'card' },
  ];

  const sampleCategories = [
    { id: 'food', name: 'Food & Dining', color: '#EF4444', budget: 3000, spent: 2800 },
    { id: 'transport', name: 'Transportation', color: '#3B82F6', budget: 2000, spent: 1200 },
    { id: 'entertainment', name: 'Entertainment', color: '#8B5CF6', budget: 1000, spent: 800 },
    { id: 'shopping', name: 'Shopping', color: '#10B981', budget: 1500, spent: 1500 },
    { id: 'utilities', name: 'Utilities', color: '#F59E0B', budget: 800, spent: 600 },
    { id: 'healthcare', name: 'Healthcare', color: '#EC4899', budget: 500, spent: 300 },
    { id: 'education', name: 'Education', color: '#06B6D4', budget: 1000, spent: 800 },
    { id: 'housing', name: 'Housing', color: '#84CC16', budget: 5000, spent: 5000 },
  ];

  // Fetch expenses and budgets
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        const userId = user?.uid;
        if (!userId) return;
        const { expenses: expensesData } = await expenseAPI.getExpenses(userId);
        setExpenses(expensesData);
        // For categories and budget, use static/sample data for now
        setCategories(sampleCategories);
        setCurrentBudget({
          totalBudget: 8300,
          categoryBudgets: sampleCategories.map(cat => ({
            categoryId: cat.id,
            amount: cat.budget,
          })),
          savingsGoal: 1000,
        });
      } catch (err) {
        setExpenses(sampleExpenses);
        setCategories(sampleCategories);
        setCurrentBudget({
          totalBudget: 8300,
          categoryBudgets: sampleCategories.map(cat => ({
            categoryId: cat.id,
            amount: cat.budget,
          })),
          savingsGoal: 1000,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, showAddExpenseModal, showBudgetModal]);

  const handleSaveExpense = async (expenseData: ExpenseData) => {
    try {
      if (!user) {
        setError('Please log in to add expenses.');
        return;
      }
      await expenseAPI.createExpense({
        userId: user.uid,
        ...expenseData,
        date: new Date(expenseData.date),
      });
      setShowAddExpenseModal(false);
      setSuccess('Expense added successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(true);
      const { expenses: res } = await expenseAPI.getExpenses(user.uid);
      setExpenses(res);
      setLoading(false);
    } catch (err) {
      setError('Failed to add expense.');
    }
  };

  const handleSaveBudget = () => {
    setShowBudgetModal(false);
    // Optionally refetch budgets
  };

  // Calculate totals from localStorage data
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalBudget = currentBudget?.totalBudget || 0;
  const budgetPercentage = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const potentialSavings = totalBudget - totalSpent;
  const currentSavings = 450; // Placeholder, update if you want to calculate from local data

  // Prepare data for charts
  const expenseData = expenses.map((e) => ({
    date: new Date(e.date).toLocaleDateString(),
    amount: e.amount,
  }));
  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
    budget: cat.budget,
    spent: cat.spent,
  }));
  const savingsData = [
    { month: 'Jan', amount: 100 },
    { month: 'Feb', amount: 150 },
    { month: 'Mar', amount: 120 },
    { month: 'Apr', amount: 200 },
    { month: 'May', amount: 180 },
    { month: 'Jun', amount: 250 },
  ]; // Placeholder

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg">Loading expenses...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-6">
      <div className="text-center">
        <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
        <p className="text-surface-600 dark:text-surface-400 mb-4">
          Showing sample data for demonstration. Connect to backend for real data.
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Local Storage Banner */}
        <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600/10">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="4" fill="#6366F1" fillOpacity="0.2"/><rect x="8" y="3" width="8" height="4" rx="2" fill="#6366F1" fillOpacity="0.2"/><circle cx="8.5" cy="12" r="1.5" fill="#6366F1"/><circle cx="15.5" cy="12" r="1.5" fill="#6366F1"/></svg>
          </span>
          <span className="text-primary-700 dark:text-primary-300 font-medium">You are viewing expenses stored locally in your browser (local server mode).</span>
        </div>
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg">
            <div className="flex items-center">
              <div className="text-success-600 dark:text-success-400 text-lg mr-2">✓</div>
              <span className="text-success-800 dark:text-success-200">{success}</span>
            </div>
          </div>
        )}
        
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
        {expenses.length === 0 ? (
          <div className="text-center text-lg text-surface-500 py-12">No expenses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Total Spent</p>
                  <h3 className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</h3>
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
                  <h3 className="text-2xl font-bold">₹{totalBudget.toFixed(2)}</h3>
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
                <span>₹{totalSpent.toFixed(2)} spent</span>
                <span>₹{(totalBudget - totalSpent).toFixed(2)} remaining</span>
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
                  <h3 className="text-2xl font-bold">₹{currentSavings.toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <PiggyBank className="text-accent-600 dark:text-accent-400" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-success-500 font-medium mr-1">+₹{potentialSavings.toFixed(2)}</span>
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
        )}

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
                    <span className="text-sm font-medium">₹{category.spent} / ₹{category.budget}</span>
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
              <h3 className="text-xl font-bold mt-1">₹{currentSavings.toFixed(2)}</h3>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-sm text-surface-600 dark:text-surface-400">Potential Savings</p>
              <h3 className="text-xl font-bold mt-1">₹{potentialSavings.toFixed(2)}</h3>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-sm text-surface-600 dark:text-surface-400">Savings Goal</p>
              <h3 className="text-xl font-bold mt-1">₹1,000.00</h3>
              <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded-full mt-2">
                <div 
                  className="h-full bg-success-500 rounded-full"
                  style={{ width: `${Math.min((currentSavings/1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Expenses List */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="btn btn-outline btn-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              <p>No expenses recorded yet.</p>
              <p className="text-sm mt-2">Start tracking your expenses by adding your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 10).map((expense: any) => (
                <div key={expense._id || expense.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: categories.find(cat => cat.id === expense.category)?.color || '#4F46E5' 
                      }}
                    ></div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {categories.find(cat => cat.id === expense.category)?.name || expense.category} • {expense.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          currentBudget={currentBudget || { totalBudget: 0, categoryBudgets: [], savingsGoal: 0 }}
        />
      </div>
    </div>
  );
};

export default Expenses;