import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Image, List, Bold, Italic, Link as LinkIcon, Smile, Frown, Meh, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { journalAPI } from '../lib/api';
import { geminiService } from '../lib/geminiService';
import { useNavigate } from 'react-router-dom';

const Write: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string;
    moodRating: number;
    moodLabel: string;
    keyThemes: string[];
    insights: string;
  } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const moods = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-500' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-red-500' },
  ];

  const categories = ['Personal', 'Work', 'Goals', 'Reflection', 'Gratitude', 'Dreams'];

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setIsLoading(true);
    setIsAnalyzing(true);
    setError('');

    try {
      // Analyze the content with AI
      let analysis = null;
      try {
        analysis = await geminiService.analyzeJournalEntry(content.trim());
        setAiAnalysis(analysis);
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        // Continue without AI analysis if it fails
      }

      await journalAPI.createEntry({
        userId: user.uid,
        title: title.trim(),
        content: content.trim(),
        mood,
        category,
        aiAnalysis: analysis,
      });

      // Reset form
      setTitle('');
      setContent('');
      setMood('');
      setCategory('Personal');
      setAiAnalysis(null);

      // Navigate to entries page
      navigate('/entries');
    } catch (error) {
      console.error('Error saving entry:', error);
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">New Entry</h1>
          <button 
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !content.trim()}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Brain size={18} className="animate-pulse" /> : <Save size={18} />}
            {isAnalyzing ? 'Analyzing...' : isLoading ? 'Saving...' : 'Save Entry'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg text-error-800 dark:text-error-300">
            {error}
          </div>
        )}
        
        <div className="card">
          <input
            type="text"
            placeholder="Entry Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-0 focus:outline-none mb-4 placeholder-surface-400"
          />

          <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-surface-600 dark:text-surface-400">Mood:</label>
              <div className="flex gap-2">
                {moods.map(moodOption => (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(mood === moodOption.value ? '' : moodOption.value)}
                    className={`p-2 rounded-lg border transition-colors ${
                      mood === moodOption.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                    title={moodOption.label}
                  >
                    <moodOption.icon size={18} className={moodOption.color} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-y border-surface-200 dark:border-surface-700 py-2 mb-4">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                <Bold size={18} />
              </button>
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                <Italic size={18} />
              </button>
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                <LinkIcon size={18} />
              </button>
              <div className="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-2" />
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                <List size={18} />
              </button>
              <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                <Image size={18} />
              </button>
              <div className="ml-auto text-sm text-surface-500">
                {wordCount} words
              </div>
            </div>
          </div>
          
          <textarea
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100vh-400px)] bg-transparent border-0 focus:outline-none resize-none placeholder-surface-400"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Write;