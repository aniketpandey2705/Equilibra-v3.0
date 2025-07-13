import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, ChevronDown, Brain, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { getJournalEntries } from '../../lib/api';
import { useAuth, useJournalEntries } from '../../context/AuthContext';
import axios from 'axios';

const SETTINGS_KEY = 'analyticsPanelSettings';

// Helper to get/set settings in localStorage
function loadLocalSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch {
    return {};
  }
}
function saveLocalSettings(settings: any) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Helper to get/set settings in backend
async function fetchBackendSettings(token: string) {
  const res = await axios.get('/api/user/settings', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
async function updateBackendSettings(token: string, updates: any) {
  await axios.put('/api/user/settings', updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  date: string;
  aiAnalysis?: {
    moodRating: number;
    moodLabel: string;
    sentiment: number;
    keyThemes: string[];
    insights: string;
    wordCount: number;
  };
  moodScore?: number; // Added for the new logic
}

type ChartType = 'line' | 'bar' | 'area';
type MetricType = 'moodRating' | 'sentiment' | 'wordCount' | 'themes';

const AnalyticsPanel: React.FC = () => {
  const { user } = useAuth();
  const { refreshToken } = useJournalEntries();
  // Load initial from localStorage
  const localSettings = loadLocalSettings();
  const [chartType, setChartTypeState] = useState<ChartType>(localSettings.chartType || 'area');
  const [metric, setMetricState] = useState<MetricType>(localSettings.metric || 'moodRating');
  const [timeframe, setTimeframeState] = useState(localSettings.timeframe || 'week');
  const [journalData, setJournalData] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync with backend on mount
  useEffect(() => {
    async function syncSettings() {
      if (user) {
        try {
          const token = await user.getIdToken();
          const backendSettings = await fetchBackendSettings(token);
          if (backendSettings) {
            if (backendSettings.chartType) setChartTypeState(backendSettings.chartType);
            if (backendSettings.metric) setMetricState(backendSettings.metric);
            if (backendSettings.timeframe) setTimeframeState(backendSettings.timeframe);
            saveLocalSettings(backendSettings);
          }
        } catch (err) {
          // Ignore backend errors, fallback to local
        }
      }
    }
    syncSettings();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchJournalData();
    }
  }, [user, timeframe, refreshToken]);

  const fetchJournalData = async () => {
    try {
      setLoading(true);
      const response = await getJournalEntries();
      const entries = response.data || [];
      
      // Filter entries based on timeframe
      const now = new Date();
      const filteredEntries = entries.filter((entry: JournalEntry) => {
        const entryDate = new Date(entry.date);
        const diffTime = Math.abs(now.getTime() - entryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (timeframe) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          default:
            return true;
        }
      });
      
      setJournalData(filteredEntries);
    } catch (error) {
      console.error('Error fetching journal data:', error);
      // Use sample data as fallback
      setJournalData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demonstration
  const sampleData: JournalEntry[] = [
    {
      _id: '1',
      title: 'Productive Day',
      content: 'Had a great day at work...',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 8.5,
        moodLabel: 'Happy',
        sentiment: 0.8,
        keyThemes: ['productivity', 'work', 'success'],
        insights: 'Positive outlook on work achievements',
        wordCount: 350
      }
    },
    {
      _id: '2',
      title: 'Challenging Moments',
      content: 'Faced some difficulties today...',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 6.0,
        moodLabel: 'Neutral',
        sentiment: 0.2,
        keyThemes: ['challenge', 'growth', 'learning'],
        insights: 'Showing resilience in face of challenges',
        wordCount: 420
      }
    },
    {
      _id: '3',
      title: 'Creative Inspiration',
      content: 'Found new ideas for my project...',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 9.0,
        moodLabel: 'Excited',
        sentiment: 0.9,
        keyThemes: ['creativity', 'inspiration', 'projects'],
        insights: 'High creative energy and motivation',
        wordCount: 510
      }
    },
    {
      _id: '4',
      title: 'Reflection Time',
      content: 'Taking time to reflect on my journey...',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 7.5,
        moodLabel: 'Contemplative',
        sentiment: 0.6,
        keyThemes: ['reflection', 'growth', 'self-awareness'],
        insights: 'Deep introspection and personal growth',
        wordCount: 390
      }
    },
    {
      _id: '5',
      title: 'Social Connections',
      content: 'Spent time with friends and family...',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 8.8,
        moodLabel: 'Grateful',
        sentiment: 0.85,
        keyThemes: ['relationships', 'gratitude', 'connection'],
        insights: 'Strong social bonds and appreciation',
        wordCount: 450
      }
    },
    {
      _id: '6',
      title: 'Learning New Skills',
      content: 'Started learning a new programming language...',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      aiAnalysis: {
        moodRating: 7.2,
        moodLabel: 'Focused',
        sentiment: 0.7,
        keyThemes: ['learning', 'skills', 'development'],
        insights: 'Growth mindset and skill development',
        wordCount: 380
      }
    },
    {
      _id: '7',
      title: 'Today\'s Achievements',
      content: 'Completed several important tasks...',
      date: new Date().toISOString(),
      aiAnalysis: {
        moodRating: 8.9,
        moodLabel: 'Accomplished',
        sentiment: 0.9,
        keyThemes: ['achievement', 'productivity', 'success'],
        insights: 'High sense of accomplishment and satisfaction',
        wordCount: 520
      }
    }
  ];

  // Process data for charts
  const chartData = journalData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      moodRating: entry.moodScore ?? entry.aiAnalysis?.moodRating ?? 5,
      sentiment: entry.aiAnalysis?.sentiment || 0,
      wordCount: entry.aiAnalysis?.wordCount || 0,
      themes: entry.aiAnalysis?.keyThemes?.length || 0,
      label: entry.aiAnalysis?.moodLabel || 'Neutral'
    }));

  // Calculate metrics
  const averageMoodRating = journalData.length > 0 
    ? journalData.reduce((sum, entry) => sum + (entry.moodScore ?? entry.aiAnalysis?.moodRating ?? 5), 0) / journalData.length 
    : 7.0;
  
  const averageSentiment = journalData.length > 0 
    ? journalData.reduce((sum, entry) => sum + (entry.aiAnalysis?.sentiment || 0), 0) / journalData.length 
    : 0.5;
  
  const totalWords = journalData.reduce((sum, entry) => sum + (entry.aiAnalysis?.wordCount || 0), 0);
  
  const allThemes = journalData.flatMap(entry => entry.aiAnalysis?.keyThemes || []);
  const themeCounts = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topThemes = Object.entries(themeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([theme, count]) => ({ name: theme, value: count }));

  const metrics = {
    moodRating: {
      label: 'Mood Rating',
      value: averageMoodRating.toFixed(1),
      change: 12.5,
      color: 'primary',
      icon: Heart,
      description: 'Average AI mood score'
    },
    sentiment: {
      label: 'Sentiment',
      value: (averageSentiment * 100).toFixed(0) + '%',
      change: 8.2,
      color: 'secondary',
      icon: TrendingUp,
      description: 'Overall emotional tone'
    },
    wordCount: {
      label: 'Total Words',
      value: totalWords.toString(),
      change: 15.7,
      color: 'accent',
      icon: Brain,
      description: 'Words written this period'
    },
    themes: {
      label: 'Key Themes',
      value: Object.keys(themeCounts).length.toString(),
      change: 5.3,
      color: 'success',
      icon: Lightbulb,
      description: 'Unique themes identified'
    },
  };
  
  const selectedMetric = metrics[metric];
  
  const getColorClass = () => {
    const colorMap = {
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-secondary-600 dark:text-secondary-400',
      accent: 'text-accent-600 dark:text-accent-400',
      success: 'text-success-600 dark:text-success-400',
    };
    
    return colorMap[selectedMetric.color as keyof typeof colorMap] || colorMap.primary;
  };
  
  const getAreaFill = () => {
    const colorMap = {
      primary: '#4F46E5',
      secondary: '#0D9488',
      accent: '#F59E0B',
      success: '#10B981',
    };
    
    return colorMap[selectedMetric.color as keyof typeof colorMap] || colorMap.primary;
  };

  const COLORS = ['#4F46E5', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Remedies/suggestions based on mood
  let remedyTitle = '';
  let remedies: string[] = [];
  if (averageMoodRating < 5) {
    remedyTitle = 'Feeling Low? Here are some remedies:';
    remedies = [
      'Take a short walk outside and get some fresh air.',
      'Listen to your favorite uplifting music.',
      'Reach out to a friend or loved one for a chat.',
      'Try a short guided meditation or breathing exercise.',
      'Write down three things you are grateful for today.',
      'Treat yourself to something small you enjoy.'
    ];
  } else if (averageMoodRating < 7) {
    remedyTitle = 'Keep Going!';
    remedies = [
      'You are doing well—keep up the good work!',
      'Take a moment to acknowledge your progress.',
      'Try a creative activity or hobby you enjoy.',
      'Reflect on a positive moment from today.',
      'Stay hydrated and take care of your body.'
    ];
  } else {
    remedyTitle = 'Great Mood!';
    remedies = [
      'Celebrate your good day—share your joy with others!',
      'Keep doing what makes you feel good.',
      'Reflect on what contributed to your positive mood.',
      'Plan something fun for tomorrow.',
      'Spread positivity to someone else today!'
    ];
  }

  if (loading) {
    return (
      <div className="card h-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 text-surface-900 dark:text-surface-100">
            <Brain size={20} className="text-primary-500" />
            AI Journal Insights
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">{selectedMetric.value}</span>
            <div className={`flex items-center text-sm font-medium ${
              selectedMetric.change >= 0 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-error-600 dark:text-error-400'
            }`}>
              {selectedMetric.change >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              {Math.abs(selectedMetric.change)}%
            </div>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {selectedMetric.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select 
            className="text-xs px-2 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
            value={timeframe}
            onChange={(e) => setTimeframeState(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 text-xs font-medium">
            <button 
              className={`px-3 py-1.5 ${chartType === 'area' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}
              onClick={() => setChartTypeState('area')}
            >
              Area
            </button>
            <button 
              className={`px-3 py-1.5 ${chartType === 'line' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}
              onClick={() => setChartTypeState('line')}
            >
              Line
            </button>
            <button 
              className={`px-3 py-1.5 ${chartType === 'bar' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}
              onClick={() => setChartTypeState('bar')}
            >
              Bar
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-64 bg-surface-50 dark:bg-surface-800 rounded-xl p-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getAreaFill()} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getAreaFill()} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke={getAreaFill()} 
                fillOpacity={1}
                fill={`url(#color${metric})`} 
              />
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey={metric} 
                stroke={getAreaFill()} 
                strokeWidth={3}
                dot={{ fill: getAreaFill(), strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Bar 
                dataKey={metric} 
                fill={getAreaFill()} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {Object.entries(metrics).map(([key, item]) => (
          <button 
            key={key} 
            className={`p-3 rounded-lg border text-left transition-all 
              ${metric === key 
                ? 'border-primary-200 dark:border-primary-800 bg-surface-100 dark:bg-surface-800 shadow-md' 
                : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-600'} 
              text-surface-900 dark:text-surface-100`}
            onClick={() => setMetricState(key as MetricType)}
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon size={16} className={`text-${item.color}-500`} />
              <span className="text-xs text-surface-600 dark:text-surface-400">{item.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{item.value}</span>
              <div className={`flex items-center text-xs font-medium ${
                item.change >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'
              }`}>
                {item.change >= 0 ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {Math.abs(item.change)}%
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Remedies Section */}
      <div className="mt-8 p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-700">
        <h4 className="font-semibold text-accent-700 dark:text-accent-300 mb-2">{remedyTitle}</h4>
        <ul className="list-disc pl-5 space-y-1 text-surface-700 dark:text-surface-200 text-sm">
          {remedies.map((remedy, idx) => (
            <li key={idx}>{remedy}</li>
          ))}
        </ul>
      </div>

      {/* Key Themes Pie Chart */}
      {topThemes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-surface-900 dark:text-surface-100">Key Themes</h3>
          <div className="h-48 bg-surface-50 dark:bg-surface-800 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topThemes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topThemes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {topThemes.map((theme, index) => (
              <div key={theme.name} className="flex items-center gap-2 text-xs text-surface-900 dark:text-surface-100">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="truncate">{theme.name}</span>
                <span className="font-medium">{theme.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;