export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export interface DataPoint {
  name: string;
  value: number;
}

export interface ChartData {
  name: string;
  data: DataPoint[];
}

export interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'planned';
  team: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'document';
  link: string;
  date: string;
  thumbnail?: string;
}