import React, { useState } from 'react';
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
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';

const data = [
  { name: 'Mon', wordCount: 350, time: 15, sentiment: 0.8 },
  { name: 'Tue', wordCount: 420, time: 20, sentiment: 0.7 },
  { name: 'Wed', wordCount: 280, time: 12, sentiment: 0.9 },
  { name: 'Thu', wordCount: 510, time: 25, sentiment: 0.6 },
  { name: 'Fri', wordCount: 390, time: 18, sentiment: 0.8 },
  { name: 'Sat', wordCount: 450, time: 22, sentiment: 0.7 },
  { name: 'Sun', wordCount: 520, time: 28, sentiment: 0.9 },
];

type ChartType = 'line' | 'bar';
type MetricType = 'wordCount' | 'time' | 'sentiment';

const AnalyticsPanel: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [metric, setMetric] = useState<MetricType>('wordCount');
  
  const metrics = {
    wordCount: {
      label: 'Word Count',
      value: '420',
      change: 12.5,
      color: 'primary',
    },
    time: {
      label: 'Writing Time',
      value: '20 mins',
      change: 4.2,
      color: 'secondary',
    },
    sentiment: {
      label: 'Mood Score',
      value: '0.8',
      change: -1.5,
      color: 'accent',
    },
  };
  
  const selectedMetric = metrics[metric];
  
  const getColorClass = () => {
    const colorMap = {
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-secondary-600 dark:text-secondary-400',
      accent: 'text-accent-600 dark:text-accent-400',
    };
    
    return colorMap[selectedMetric.color as keyof typeof colorMap] || colorMap.primary;
  };
  
  const getAreaFill = () => {
    const colorMap = {
      primary: '#4F46E5',
      secondary: '#0D9488',
      accent: '#F59E0B',
    };
    
    return colorMap[selectedMetric.color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="card h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-lg font-semibold">Writing Analytics</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold">{selectedMetric.value}</span>
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
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 text-xs font-medium">
            <button 
              className={`px-3 py-1.5 ${chartType === 'line' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button 
              className={`px-3 py-1.5 ${chartType === 'bar' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 text-xs font-medium cursor-pointer">
              <span>{selectedMetric.label}</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <AreaChart
              data={data}
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
                dataKey="name" 
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
          ) : (
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
              <XAxis 
                dataKey="name" 
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
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Object.entries(metrics).map(([key, item]) => (
          <button 
            key={key} 
            className={`p-2 rounded-lg border ${
              metric === key 
                ? `border-${selectedMetric.color}-200 dark:border-${selectedMetric.color}-800 bg-${selectedMetric.color}-50 dark:bg-${selectedMetric.color}-900/20`
                : 'border-surface-200 dark:border-surface-700'
            } text-left`}
            onClick={() => setMetric(key as MetricType)}
          >
            <span className="text-xs text-surface-600 dark:text-surface-400">{item.label}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold">{item.value}</span>
              <div className={`flex items-center text-xs font-medium ${
                item.change >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'
              }`}>
                {item.change >= 0 ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {Math.abs(item.change)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPanel