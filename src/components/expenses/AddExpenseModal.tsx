import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: ExpenseData) => void;
  categories: Category[];
}

interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, categories }) => {
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    amount: 0,
    category: categories[0]?.id || '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof ExpenseData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseData, string>> = {};
    
    if (expenseData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!expenseData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!expenseData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!expenseData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(expenseData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add New Expense</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
              <input
                type="number"
                name="amount"
                value={expenseData.amount || ''}
                onChange={handleChange}
                className="input pl-8 w-full"
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && <p className="text-error-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={expenseData.category}
              onChange={handleChange}
              className="input w-full"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-error-500 text-xs mt-1">{errors.category}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              className="input w-full"
              rows={2}
            />
            {errors.description && <p className="text-error-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="date"
                  name="date"
                  value={expenseData.date}
                  onChange={handleChange}
                  className="input pl-9 w-full"
                />
              </div>
              {errors.date && <p className="text-error-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={expenseData.paymentMethod}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className="btn btn-primary w-full"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;