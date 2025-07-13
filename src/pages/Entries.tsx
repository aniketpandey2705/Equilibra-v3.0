import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Tag, Edit, Trash2, Eye, Brain, Sparkles } from 'lucide-react';
import { useAuth, useJournalEntries } from '../context/AuthContext';
import { journalAPI } from '../lib/api';
import { geminiService } from '../lib/geminiService';
import EntryDetailModal from '../components/EntryDetailModal';

interface JournalEntry {
  id: string;
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
  createdAt: Date;
}

const Entries: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { triggerRefresh } = useJournalEntries();

  const categories = ['all', 'Personal', 'Work', 'Goals', 'Reflection', 'Gratitude', 'Dreams'];

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, page]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await journalAPI.getEntries(user.uid, page, 10);
      setEntries(result.entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt || Date.now()),
      })));
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await journalAPI.deleteEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
      triggerRefresh(); // Notify analytics/dashboard
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'neutral': return '😐';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Journal Entries</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Browse and search through your past journal entries
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 input"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredEntries.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {entries.length === 0 ? 'No journal entries yet.' : 'No entries match your search.'}
              </p>
              <button 
                onClick={() => window.location.href = '/write'}
                className="btn btn-primary"
              >
                Write Your First Entry
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                className="card hover:shadow-lg transition-shadow"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {entry.title}
                    {entry.aiAnalysis ? (
                      <span className="text-lg">{geminiService.getMoodEmoji(entry.aiAnalysis.moodLabel)}</span>
                    ) : entry.mood && (
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    )}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewEntry(entry)}
                      className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700 text-error-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* AI Analysis Section */}
                {entry.aiAnalysis && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={16} className="text-primary-500" />
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">AI Analysis</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <span className={`text-sm font-medium ${geminiService.getMoodColor(entry.aiAnalysis.moodRating)}`}>
                          {entry.aiAnalysis.moodRating}/10
                        </span>
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {entry.aiAnalysis.moodLabel}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-surface-700 dark:text-surface-300 mb-2">
                      <strong>Summary:</strong> {entry.aiAnalysis.summary}
                    </p>
                    
                    {entry.aiAnalysis.keyThemes.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Key Themes: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.aiAnalysis.keyThemes.map((theme, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-surface-200 dark:bg-surface-700 rounded-full text-surface-700 dark:text-surface-300"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      <strong>Insight:</strong> {entry.aiAnalysis.insights}
                    </p>
                  </div>
                )}
                
                <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-3">
                  {entry.content.substring(0, 200)}
                  {entry.content.length > 200 && '...'}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-surface-500">
                    <Calendar size={14} />
                    <span>{formatDate(entry.createdAt)}</span>
                  </div>
                  {entry.category && (
                    <div className="flex items-center gap-1 text-surface-500">
                      <Tag size={14} />
                      <span>{entry.category}</span>
                    </div>
                  )}
                  <span className="text-surface-500">{entry.wordCount} words</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-surface-200 dark:border-surface-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-surface-200 dark:border-surface-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Entries;