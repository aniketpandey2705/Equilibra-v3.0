import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Book, Clock, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getRecords, addRecord } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const performanceData = [
  { subject: 'Math', score: 85, average: 75 },
  { subject: 'Science', score: 92, average: 78 },
  { subject: 'English', score: 88, average: 80 },
  { subject: 'History', score: 78, average: 72 },
  { subject: 'Geography', score: 90, average: 76 },
];

const progressData = [
  { month: 'Jan', performance: 75 },
  { month: 'Feb', performance: 82 },
  { month: 'Mar', performance: 78 },
  { month: 'Apr', performance: 85 },
  { month: 'May', performance: 90 },
  { month: 'Jun', performance: 88 },
];

interface AcademicRecord {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  semester: string;
  year: number;
  grade?: string;
}

const Academic: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ subject: '', score: '', maxScore: '', semester: '', year: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  // Sample academic records
  const sampleRecords = [
    {
      id: '1',
      subject: 'Mathematics',
      score: 85,
      maxScore: 100,
      semester: 'Fall 2023',
      year: 2023,
      grade: 'A'
    },
    {
      id: '2',
      subject: 'Physics',
      score: 92,
      maxScore: 100,
      semester: 'Fall 2023',
      year: 2023,
      grade: 'A+'
    },
    {
      id: '3',
      subject: 'Computer Science',
      score: 88,
      maxScore: 100,
      semester: 'Fall 2023',
      year: 2023,
      grade: 'A'
    },
    {
      id: '4',
      subject: 'English Literature',
      score: 78,
      maxScore: 100,
      semester: 'Fall 2023',
      year: 2023,
      grade: 'B+'
    }
  ];

  const fetchRecords = async () => {
    try {
      const response = await getRecords();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
      // Use sample data as fallback
      setRecords(sampleRecords);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove userId if present
      const { userId, ...recordWithoutUserId } = newRecord as any;
      await addRecord({ ...recordWithoutUserId, score: Number(newRecord.score), maxScore: Number(newRecord.maxScore), year: Number(newRecord.year) });
      setShowAddRecordModal(false);
      setNewRecord({ subject: '', score: '', maxScore: '', semester: '', year: '' });
      fetchRecords();
    } catch (error) {
      alert('Failed to add record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Academic Records</h1>
          <button className="btn btn-primary" onClick={() => setShowAddRecordModal(true)}>Add Record</button>
        </div>
        {/* Add Record Modal */}
        {showAddRecordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4">Add Academic Record</h2>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input type="text" className="input w-full" value={newRecord.subject} onChange={e => setNewRecord({ ...newRecord, subject: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Score</label>
                  <input type="number" className="input w-full" value={newRecord.score} onChange={e => setNewRecord({ ...newRecord, score: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Score</label>
                  <input type="number" className="input w-full" value={newRecord.maxScore} onChange={e => setNewRecord({ ...newRecord, maxScore: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <input type="text" className="input w-full" value={newRecord.semester} onChange={e => setNewRecord({ ...newRecord, semester: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input type="number" className="input w-full" value={newRecord.year} onChange={e => setNewRecord({ ...newRecord, year: e.target.value })} required />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddRecordModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Record'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Display Academic Records */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Academic Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <div key={record.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{record.subject}</h3>
                  <span className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-2 py-1 rounded">
                    {record.grade}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-medium">{record.score}/{record.maxScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Semester:</span>
                    <span>{record.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span>{record.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Academic Performance</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Track your academic progress and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Overall GPA</p>
                  <h3 className="text-2xl font-bold">3.8</h3>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <GraduationCap className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="text-success-500 mr-1" size={16} />
                <span className="text-success-500 font-medium">0.2</span>
                <span className="text-surface-600 dark:text-surface-400 ml-1">vs last semester</span>
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
                  <p className="text-sm text-surface-600 dark:text-surface-400">Study Hours</p>
                  <h3 className="text-2xl font-bold">24.5</h3>
                </div>
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                  <Clock className="text-secondary-600 dark:text-secondary-400" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="text-success-500 mr-1" size={16} />
                <span className="text-success-500 font-medium">2.5</span>
                <span className="text-surface-600 dark:text-surface-400 ml-1">hours this week</span>
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
                  <p className="text-sm text-surface-600 dark:text-surface-400">Courses</p>
                  <h3 className="text-2xl font-bold">6</h3>
                </div>
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <Book className="text-accent-600 dark:text-accent-400" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-surface-600 dark:text-surface-400">Current semester</span>
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
                  <p className="text-sm text-surface-600 dark:text-surface-400">Achievements</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
                <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Award className="text-success-600 dark:text-success-400" size={24} />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-surface-600 dark:text-surface-400">3 new this month</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Performance Trend</h2>
                <select className="text-sm px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
                  <option>This Semester</option>
                  <option>Last Semester</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      dot={{ fill: '#4F46E5' }}
                    />
                  </LineChart>
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
                <h2 className="text-lg font-semibold">Subject Performance</h2>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="average" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academic;