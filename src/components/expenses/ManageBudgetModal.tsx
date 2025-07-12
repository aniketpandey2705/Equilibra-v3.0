import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { getBudgets, addBudget, updateBudget } from '../../lib/api';

interface ManageBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgetData: BudgetData) => void;
  categories: Category[];
  currentBudget: BudgetData;
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

const ManageBudgetModal: React.FC<ManageBudgetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories, 
  currentBudget 
}) => {
  const [budgetData, setBudgetData] = useState<BudgetData>(currentBudget);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { user } = useAuth();

  // Calculate remaining budget (unallocated)
  const allocatedBudget = budgetData.categoryBudgets.reduce((sum, item) => sum + item.amount, 0);
  const unallocatedBudget = budgetData.totalBudget - allocatedBudget;

  const handleTotalBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = parseFloat(e.target.value) || 0;
    setBudgetData(prev => ({
      ...prev,
      totalBudget: newTotal
    }));
  };

  const handleSavingsGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseFloat(e.target.value) || 0;
    setBudgetData(prev => ({
      ...prev,
      savingsGoal: newGoal
    }));
  };

  const handleCategoryBudgetChange = (categoryId: string, amount: number) => {
    setBudgetData(prev => ({
      ...prev,
      categoryBudgets: prev.categoryBudgets.map(item => 
        item.categoryId === categoryId ? { ...item, amount } : item
      )
    }));
  };

  const addCategoryBudget = () => {
    if (!newCategory) {
      setErrors({...errors, newCategory: 'Please select a category'});
      return;
    }

    if (newCategoryBudget <= 0) {
      setErrors({...errors, newCategoryBudget: 'Amount must be greater than zero'});
      return;
    }

    // Check if category already exists
    if (budgetData.categoryBudgets.some(item => item.categoryId === newCategory)) {
      setErrors({...errors, newCategory: 'This category already has a budget'});
      return;
    }

    setBudgetData(prev => ({
      ...prev,
      categoryBudgets: [
        ...prev.categoryBudgets,
        { categoryId: newCategory, amount: newCategoryBudget }
      ]
    }));

    // Reset form
    setNewCategory('');
    setNewCategoryBudget(0);
    setErrors({});
  };

  const removeCategoryBudget = (categoryId: string) => {
    setBudgetData(prev => ({
      ...prev,
      categoryBudgets: prev.categoryBudgets.filter(item => item.categoryId !== categoryId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (budgetData.totalBudget <= 0) {
      newErrors.totalBudget = 'Total budget must be greater than zero';
    }
    
    if (budgetData.savingsGoal < 0) {
      newErrors.savingsGoal = 'Savings goal cannot be negative';
    }
    
    if (budgetData.categoryBudgets.length === 0) {
      newErrors.categories = 'Please add at least one category budget';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(budgetData);
      onClose();
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  // Get category color by ID
  const getCategoryColor = (categoryId: string): string => {
    return categories.find(cat => cat.id === categoryId)?.color || '#6B7280';
  };

  // Add budget API integration
  useEffect(() => {
    if (isOpen && user) {
      fetchBudget();
    }
  }, [isOpen, user]);

  const fetchBudget = async () => {
    try {
      const response = await getBudgets(user.uid);
      // Process and set current budget
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-lg w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Manage Budget</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                <input
                  type="number"
                  value={budgetData.totalBudget || ''}
                  onChange={handleTotalBudgetChange}
                  className="input pl-8 w-full"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.totalBudget && <p className="text-error-500 text-xs mt-1">{errors.totalBudget}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Savings Goal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                <input
                  type="number"
                  value={budgetData.savingsGoal || ''}
                  onChange={handleSavingsGoalChange}
                  className="input pl-8 w-full"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.savingsGoal && <p className="text-error-500 text-xs mt-1">{errors.savingsGoal}</p>}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold">Category Budgets</h3>
              <div className="text-sm text-surface-600 dark:text-surface-400">
                Unallocated: <span className={unallocatedBudget < 0 ? 'text-error-500' : 'text-success-500'}>
                  ${unallocatedBudget.toFixed(2)}
                </span>
              </div>
            </div>
            
            {budgetData.categoryBudgets.length > 0 ? (
              <div className="space-y-3 mb-4">
                {budgetData.categoryBudgets.map((item) => (
                  <div key={item.categoryId} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryColor(item.categoryId) }}
                      ></div>
                      <span>{getCategoryName(item.categoryId)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-surface-500 text-sm">$</span>
                        <input
                          type="number"
                          value={item.amount || ''}
                          onChange={(e) => handleCategoryBudgetChange(item.categoryId, parseFloat(e.target.value) || 0)}
                          className="w-24 py-1 px-6 rounded-md border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeCategoryBudget(item.categoryId)}
                        className="p-1 text-surface-500 hover:text-error-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-surface-500 bg-surface-50 dark:bg-surface-700 rounded-lg mb-4">
                No category budgets added yet
              </div>
            )}
            
            {errors.categories && <p className="text-error-500 text-xs mb-2">{errors.categories}</p>}
            
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (errors.newCategory) {
                      setErrors({...errors, newCategory: undefined});
                    }
                  }}
                  className="input w-full"
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => !budgetData.categoryBudgets.some(item => item.categoryId === cat.id))
                    .map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                {errors.newCategory && <p className="text-error-500 text-xs mt-1">{errors.newCategory}</p>}
              </div>
              
              <div className="w-24">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-surface-500 text-sm">$</span>
                  <input
                    type="number"
                    value={newCategoryBudget || ''}
                    onChange={(e) => {
                      setNewCategoryBudget(parseFloat(e.target.value) || 0);
                      if (errors.newCategoryBudget) {
                        setErrors({...errors, newCategoryBudget: undefined});
                      }
                    }}
                    className="w-full py-2 px-6 rounded-md border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.newCategoryBudget && <p className="text-error-500 text-xs mt-1">{errors.newCategoryBudget}</p>}
              </div>
              
              <button 
                type="button"
                onClick={addCategoryBudget}
                className="btn btn-outline h-10 px-3 mb-0.5"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
            <button 
              type="submit"
              className="btn btn-primary w-full"
            >
              Save Budget Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBudgetModal;