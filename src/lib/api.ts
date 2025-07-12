// Types
interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface JournalEntry {
  id?: string;
  userId: string;
  title: string;
  content: string;
  mood?: string;
  category?: string;
  wordCount: number;
  aiAnalysis?: {
    summary: string;
    moodRating: number;
    moodLabel: string;
    keyThemes: string[];
    insights: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

interface Expense {
  id?: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: any;
  createdAt?: any;
  updatedAt?: any;
}

interface Goal {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  dueDate?: any;
  createdAt?: any;
  updatedAt?: any;
}

interface AcademicRecord {
  id?: string;
  userId: string;
  subject: string;
  score: number;
  maxScore: number;
  grade?: string;
  semester: string;
  year: number;
  createdAt?: any;
  updatedAt?: any;
}

// Helper functions for localStorage
const getStorageKey = (collection: string, userId?: string) => {
  return userId ? `${collection}_${userId}` : collection;
};

const getDataFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return [];
  }
};

const saveDataToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Firebase Auth Setup
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// User API
export const userAPI = {
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
  }) {
    try {
      const newUser: User = {
        id: generateId(),
        ...userData,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      // Store user in localStorage
      const users = getDataFromStorage<User>('users');
      users.push(newUser);
      saveDataToStorage('users', users);
      
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const users = getDataFromStorage<User>('users');
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
  }>) {
    try {
      const users = getDataFromStorage<User>('users');
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updatedAt: getCurrentTimestamp(),
      };
      
      saveDataToStorage('users', users);
      return users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

// Journal Entries API
export const journalAPI = {
  async createEntry(entryData: {
    userId: string;
    title: string;
    content: string;
    mood?: string;
    category?: string;
    aiAnalysis?: {
      summary: string;
      moodRating: number;
      moodLabel: string;
      keyThemes: string[];
      insights: string;
    };
  }) {
    try {
      const wordCount = entryData.content.split(/\s+/).filter(word => word.length > 0).length;
      
      const newEntry: JournalEntry = {
        id: generateId(),
        ...entryData,
        wordCount,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      const key = getStorageKey('journalEntries', entryData.userId);
      const entries = getDataFromStorage<JournalEntry>(key);
      entries.push(newEntry);
      saveDataToStorage(key, entries);
      
      return newEntry;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  },

  async getEntries(userId: string, page = 1, limitCount = 10) {
    try {
      const key = getStorageKey('journalEntries', userId);
      const entries = getDataFromStorage<JournalEntry>(key);
      
      // Sort by createdAt (newest first)
      const sortedEntries = entries.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      
      const startIndex = (page - 1) * limitCount;
      const endIndex = startIndex + limitCount;
      const paginatedEntries = sortedEntries.slice(startIndex, endIndex);
      
      return { 
        entries: paginatedEntries, 
        total: entries.length, 
        page, 
        totalPages: Math.ceil(entries.length / limitCount) 
      };
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  async updateEntry(entryId: string, entryData: Partial<{
    title: string;
    content: string;
    mood: string;
    category: string;
  }>) {
    try {
      const updateData: any = { ...entryData };
      if (entryData.content) {
        updateData.wordCount = entryData.content.split(/\s+/).filter(word => word.length > 0).length;
      }

      // Find the entry in all user collections
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('journalEntries_'));
      
      for (const key of allKeys) {
        const entries = getDataFromStorage<JournalEntry>(key);
        const entryIndex = entries.findIndex(entry => entry.id === entryId);
        
        if (entryIndex !== -1) {
          entries[entryIndex] = {
            ...entries[entryIndex],
            ...updateData,
            updatedAt: getCurrentTimestamp(),
          };
          saveDataToStorage(key, entries);
          return entries[entryIndex];
        }
      }
      
      throw new Error('Entry not found');
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  },

  async deleteEntry(entryId: string) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('journalEntries_'));
      
      for (const key of allKeys) {
        const entries = getDataFromStorage<JournalEntry>(key);
        const entryIndex = entries.findIndex(entry => entry.id === entryId);
        
        if (entryIndex !== -1) {
          entries.splice(entryIndex, 1);
          saveDataToStorage(key, entries);
          return;
        }
      }
      
      throw new Error('Entry not found');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  },

  async getAnalytics(userId: string, days = 30) {
    try {
      const key = getStorageKey('journalEntries', userId);
      const entries = getDataFromStorage<JournalEntry>(key);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.createdAt || 0);
        return entryDate >= startDate;
      });

      // Calculate analytics
      const totalEntries = filteredEntries.length;
      const totalWords = filteredEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
      const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
      
      // Group by day for chart data
      const dailyData = filteredEntries.reduce((acc, entry) => {
        const date = new Date(entry.createdAt || 0).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { wordCount: 0, entries: 0 };
        }
        acc[date].wordCount += entry.wordCount || 0;
        acc[date].entries += 1;
        return acc;
      }, {} as Record<string, { wordCount: number; entries: number }>);

      return {
        totalEntries,
        totalWords,
        averageWords,
        dailyData,
      };
    } catch (error) {
      console.error('Error fetching journal analytics:', error);
      throw error;
    }
  },
};

// Expenses API
export const expenseAPI = {
  async createExpense(expenseData: {
    userId: string;
    amount: number;
    description: string;
    category: string;
    date?: Date;
  }) {
    try {
      const newExpense: Expense = {
        id: generateId(),
        ...expenseData,
        date: expenseData.date ? expenseData.date.toISOString() : getCurrentTimestamp(),
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      const key = getStorageKey('expenses', expenseData.userId);
      const expenses = getDataFromStorage<Expense>(key);
      expenses.push(newExpense);
      saveDataToStorage(key, expenses);
      
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  async getExpenses(userId: string, page = 1, limitCount = 10) {
    try {
      const key = getStorageKey('expenses', userId);
      const expenses = getDataFromStorage<Expense>(key);
      
      // Sort by date (newest first)
      const sortedExpenses = expenses.sort((a, b) => 
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
      
      const startIndex = (page - 1) * limitCount;
      const endIndex = startIndex + limitCount;
      const paginatedExpenses = sortedExpenses.slice(startIndex, endIndex);
      
      return { 
        expenses: paginatedExpenses, 
        total: expenses.length, 
        page, 
        totalPages: Math.ceil(expenses.length / limitCount) 
      };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  async updateExpense(expenseId: string, expenseData: Partial<{
    amount: number;
    description: string;
    category: string;
    date: Date;
  }>) {
    try {
      const updateData: any = { ...expenseData };
      if (expenseData.date) {
        updateData.date = expenseData.date.toISOString();
      }

      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('expenses_'));
      
      for (const key of allKeys) {
        const expenses = getDataFromStorage<Expense>(key);
        const expenseIndex = expenses.findIndex(expense => expense.id === expenseId);
        
        if (expenseIndex !== -1) {
          expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            ...updateData,
            updatedAt: getCurrentTimestamp(),
          };
          saveDataToStorage(key, expenses);
          return expenses[expenseIndex];
        }
      }
      
      throw new Error('Expense not found');
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  async deleteExpense(expenseId: string) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('expenses_'));
      
      for (const key of allKeys) {
        const expenses = getDataFromStorage<Expense>(key);
        const expenseIndex = expenses.findIndex(expense => expense.id === expenseId);
        
        if (expenseIndex !== -1) {
          expenses.splice(expenseIndex, 1);
          saveDataToStorage(key, expenses);
          return;
        }
      }
      
      throw new Error('Expense not found');
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  async getExpenseAnalytics(userId: string, days = 30) {
    try {
      const key = getStorageKey('expenses', userId);
      const expenses = getDataFromStorage<Expense>(key);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date || 0);
        return expenseDate >= startDate;
      });

      // Calculate analytics
      const totalAmount = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const averageDaily = days > 0 ? Math.round((totalAmount / days) * 100) / 100 : 0;
      const totalTransactions = filteredExpenses.length;
      
      // Group by day for chart data
      const dailyData = filteredExpenses.reduce((acc, expense) => {
        const date = new Date(expense.date || 0).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { amount: 0, transactions: 0 };
        }
        acc[date].amount += expense.amount || 0;
        acc[date].transactions += 1;
        return acc;
      }, {} as Record<string, { amount: number; transactions: number }>);

      // Group by category
      const categoryData = filteredExpenses.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        if (!acc[category]) {
          acc[category] = { amount: 0, transactions: 0 };
        }
        acc[category].amount += expense.amount || 0;
        acc[category].transactions += 1;
        return acc;
      }, {} as Record<string, { amount: number; transactions: number }>);

      return {
        totalAmount,
        averageDaily,
        totalTransactions,
        dailyData,
        categoryData,
      };
    } catch (error) {
      console.error('Error fetching expense analytics:', error);
      throw error;
    }
  },
};

// Goals API
export const goalAPI = {
  async createGoal(goalData: {
    userId: string;
    title: string;
    description?: string;
    category: string;
    targetValue: number;
    dueDate?: Date;
  }) {
    try {
      const newGoal: Goal = {
        id: generateId(),
        ...goalData,
        currentValue: 0,
        isCompleted: false,
        dueDate: goalData.dueDate ? goalData.dueDate.toISOString() : null,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      const key = getStorageKey('goals', goalData.userId);
      const goals = getDataFromStorage<Goal>(key);
      goals.push(newGoal);
      saveDataToStorage(key, goals);
      
      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  async getGoals(userId: string) {
    try {
      const key = getStorageKey('goals', userId);
      const goals = getDataFromStorage<Goal>(key);
      
      // Sort by createdAt (newest first)
      const sortedGoals = goals.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      
      const total = goals.length;
      const completed = goals.filter(goal => goal.isCompleted).length;
      const inProgress = total - completed;
      
      return { goals: sortedGoals, total, completed, inProgress };
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  async updateGoal(goalId: string, goalData: Partial<{
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    isCompleted: boolean;
    dueDate: Date;
  }>) {
    try {
      const updateData: any = { ...goalData };
      if (goalData.dueDate) {
        updateData.dueDate = goalData.dueDate.toISOString();
      }

      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('goals_'));
      
      for (const key of allKeys) {
        const goals = getDataFromStorage<Goal>(key);
        const goalIndex = goals.findIndex(goal => goal.id === goalId);
        
        if (goalIndex !== -1) {
          goals[goalIndex] = {
            ...goals[goalIndex],
            ...updateData,
            updatedAt: getCurrentTimestamp(),
          };
          saveDataToStorage(key, goals);
          return goals[goalIndex];
        }
      }
      
      throw new Error('Goal not found');
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  async deleteGoal(goalId: string) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('goals_'));
      
      for (const key of allKeys) {
        const goals = getDataFromStorage<Goal>(key);
        const goalIndex = goals.findIndex(goal => goal.id === goalId);
        
        if (goalIndex !== -1) {
          goals.splice(goalIndex, 1);
          saveDataToStorage(key, goals);
          return;
        }
      }
      
      throw new Error('Goal not found');
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  async updateProgress(goalId: string, progress: number) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('goals_'));
      
      for (const key of allKeys) {
        const goals = getDataFromStorage<Goal>(key);
        const goalIndex = goals.findIndex(goal => goal.id === goalId);
        
        if (goalIndex !== -1) {
          const goal = goals[goalIndex];
          const newCurrentValue = Math.min(progress, goal.targetValue);
          const isCompleted = newCurrentValue >= goal.targetValue;
          
          goals[goalIndex] = {
            ...goal,
            currentValue: newCurrentValue,
            isCompleted,
            updatedAt: getCurrentTimestamp(),
          };
          
          saveDataToStorage(key, goals);
          return goals[goalIndex];
        }
      }
      
      throw new Error('Goal not found');
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  },
};

// Academic Records API
export const academicAPI = {
  async createRecord(recordData: {
    userId: string;
    subject: string;
    score: number;
    maxScore?: number;
    grade?: string;
    semester: string;
    year: number;
  }) {
    try {
      const newRecord: AcademicRecord = {
        id: generateId(),
        ...recordData,
        maxScore: recordData.maxScore || 100,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      
      const key = getStorageKey('academicRecords', recordData.userId);
      const records = getDataFromStorage<AcademicRecord>(key);
      records.push(newRecord);
      saveDataToStorage(key, records);
      
      return newRecord;
    } catch (error) {
      console.error('Error creating academic record:', error);
      throw error;
    }
  },

  async getRecords(userId: string, year?: number, semester?: string) {
    try {
      const key = getStorageKey('academicRecords', userId);
      let records = getDataFromStorage<AcademicRecord>(key);
      
      if (year) {
        records = records.filter(record => record.year === year);
      }
      
      if (semester) {
        records = records.filter(record => record.semester === semester);
      }
      
      // Sort by createdAt (newest first)
      const sortedRecords = records.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      
      return { records: sortedRecords };
    } catch (error) {
      console.error('Error fetching academic records:', error);
      throw error;
    }
  },

  async updateRecord(recordId: string, recordData: Partial<{
    subject: string;
    score: number;
    maxScore: number;
    grade: string;
    semester: string;
    year: number;
  }>) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('academicRecords_'));
      
      for (const key of allKeys) {
        const records = getDataFromStorage<AcademicRecord>(key);
        const recordIndex = records.findIndex(record => record.id === recordId);
        
        if (recordIndex !== -1) {
          records[recordIndex] = {
            ...records[recordIndex],
            ...recordData,
            updatedAt: getCurrentTimestamp(),
          };
          saveDataToStorage(key, records);
          return records[recordIndex];
        }
      }
      
      throw new Error('Record not found');
    } catch (error) {
      console.error('Error updating academic record:', error);
      throw error;
    }
  },

  async deleteRecord(recordId: string) {
    try {
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('academicRecords_'));
      
      for (const key of allKeys) {
        const records = getDataFromStorage<AcademicRecord>(key);
        const recordIndex = records.findIndex(record => record.id === recordId);
        
        if (recordIndex !== -1) {
          records.splice(recordIndex, 1);
          saveDataToStorage(key, records);
          return;
        }
      }
      
      throw new Error('Record not found');
    } catch (error) {
      console.error('Error deleting academic record:', error);
      throw error;
    }
  },

  async getAnalytics(userId: string) {
    try {
      const key = getStorageKey('academicRecords', userId);
      const records = getDataFromStorage<AcademicRecord>(key);

      // Calculate overall GPA
      const totalScore = records.reduce((sum, record) => sum + (record.score || 0), 0);
      const totalMaxScore = records.reduce((sum, record) => sum + (record.maxScore || 100), 0);
      const overallGPA = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 4 * 100) / 100 : 0;
      
      return {
        overallGPA,
        totalRecords: records.length,
      };
    } catch (error) {
      console.error('Error fetching academic analytics:', error);
      throw error;
    }
  },
};

// Dashboard Analytics API
export const dashboardAPI = {
  async getDashboardData(userId: string) {
    try {
      const [
        journalAnalytics,
        expenseAnalytics,
        goals,
        academicAnalytics,
      ] = await Promise.all([
        journalAPI.getAnalytics(userId, 7), // Last 7 days
        expenseAPI.getExpenseAnalytics(userId, 7), // Last 7 days
        goalAPI.getGoals(userId),
        academicAPI.getAnalytics(userId),
      ]);

      // Calculate streaks for journal entries
      const key = getStorageKey('journalEntries', userId);
      const entries = getDataFromStorage<JournalEntry>(key);
      
      // Sort by date (newest first)
      const sortedEntries = entries.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date();
      const entryDates = sortedEntries.slice(0, 30).map(entry => 
        new Date(entry.createdAt || 0).toISOString().split('T')[0]
      );
      
      // Calculate current streak
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (entryDates.includes(dateStr)) {
          if (i === 0 || currentStreak > 0) {
            currentStreak++;
          }
        } else if (i === 0) {
          break;
        } else {
          break;
        }
      }

      // Calculate longest streak
      for (let i = 0; i < entryDates.length; i++) {
        const currentDate = new Date(entryDates[i]);
        const nextDate = i < entryDates.length - 1 ? new Date(entryDates[i + 1]) : null;
        
        tempStreak++;
        
        if (!nextDate || (currentDate.getTime() - nextDate.getTime()) > 86400000) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      }

      return {
        journalAnalytics,
        expenseAnalytics,
        goals,
        academicAnalytics,
        streaks: {
          current: currentStreak,
          longest: longestStreak,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};

import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Updated to match backend port

async function getIdToken() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    throw new Error('Failed to get authentication token');
  }
}

// EXPENSES
export const getExpenses = async () => {
  try {
    const token = await getIdToken();
    return axios.get(`${API_BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const addExpense = async (expense: any) => {
  try {
    const token = await getIdToken();
    return axios.post(`${API_BASE_URL}/expenses`, expense, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (id: string, expense: any) => {
  const token = await getIdToken();
  return axios.put(`${API_BASE_URL}/expenses/${id}`, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteExpense = async (id: string) => {
  const token = await getIdToken();
  return axios.delete(`${API_BASE_URL}/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// BUDGETS
export const getBudgets = async () => {
  const token = await getIdToken();
  return axios.get(`${API_BASE_URL}/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addBudget = async (budget: any) => {
  const token = await getIdToken();
  return axios.post(`${API_BASE_URL}/budgets`, budget, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateBudget = async (id: string, budget: any) => {
  const token = await getIdToken();
  return axios.put(`${API_BASE_URL}/budgets/${id}`, budget, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteBudget = async (id: string) => {
  const token = await getIdToken();
  return axios.delete(`${API_BASE_URL}/budgets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// JOURNAL ENTRIES
export const getJournalEntries = async () => {
  const token = await getIdToken();
  return axios.get(`${API_BASE_URL}/journal-entries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addJournalEntry = async (entry: any) => {
  const token = await getIdToken();
  return axios.post(`${API_BASE_URL}/journal-entries`, entry, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateJournalEntry = async (id: string, entry: any) => {
  const token = await getIdToken();
  return axios.put(`${API_BASE_URL}/journal-entries/${id}`, entry, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteJournalEntry = async (id: string) => {
  const token = await getIdToken();
  return axios.delete(`${API_BASE_URL}/journal-entries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GOALS
export const getGoals = async () => {
  const token = await getIdToken();
  return axios.get(`${API_BASE_URL}/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addGoal = async (goal: any) => {
  const token = await getIdToken();
  return axios.post(`${API_BASE_URL}/goals`, goal, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateGoal = async (id: string, goal: any) => {
  const token = await getIdToken();
  return axios.put(`${API_BASE_URL}/goals/${id}`, goal, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteGoal = async (id: string) => {
  const token = await getIdToken();
  return axios.delete(`${API_BASE_URL}/goals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getRecords = async () => {
  const token = await getIdToken();
  return axios.get(`${API_BASE_URL}/academic`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addRecord = async (record: any) => {
  const token = await getIdToken();
  return axios.post(`${API_BASE_URL}/academic`, record, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createOrFetchUserInBackend = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const idToken = await user.getIdToken();
  const res = await axios.post(`${API_BASE_URL}/users`, { idToken });
  return res.data;
};