import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Brain, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { geminiService } from '../lib/geminiService';

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

interface EntryDetailModalProps {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ entry, isOpen, onClose }) => {
  if (!entry) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Sparkles size={20} className="text-primary-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    {entry.title}
                  </h2>
                  <p className="text-sm text-surface-500">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-surface-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* AI Analysis Section */}
              {entry.aiAnalysis && (
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={20} className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">
                      AI Analysis
                    </h3>
                    <div className="ml-auto flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${geminiService.getMoodColor(entry.aiAnalysis.moodRating)}`}>
                          {entry.aiAnalysis.moodRating}/10
                        </span>
                        <span className="text-2xl">{geminiService.getMoodEmoji(entry.aiAnalysis.moodLabel)}</span>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300">
                        {entry.aiAnalysis.moodLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Summary
                      </h4>
                      <p className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
                        {entry.aiAnalysis.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2 flex items-center gap-2">
                        <Lightbulb size={16} />
                        Insights
                      </h4>
                      <p className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">
                        {entry.aiAnalysis.insights}
                      </p>
                    </div>
                  </div>

                  {entry.aiAnalysis.keyThemes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        Key Themes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.aiAnalysis.keyThemes.map((theme, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-full text-sm text-surface-700 dark:text-surface-300"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Entry Metadata */}
              <div className="flex items-center gap-4 mb-6 text-sm text-surface-500">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
                {entry.category && (
                  <div className="flex items-center gap-1">
                    <Tag size={16} />
                    <span>{entry.category}</span>
                  </div>
                )}
                <span>{entry.wordCount} words</span>
                {entry.mood && !entry.aiAnalysis && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <span>{entry.mood}</span>
                  </div>
                )}
              </div>

              {/* Entry Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-surface-700 dark:text-surface-300 leading-relaxed">
                  {entry.content}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryDetailModal; 