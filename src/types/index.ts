export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Founder & CEO' | 'Lead Engineer' | 'Product Designer' | 'Operations Manager';
  avatar: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  joinedDate: string;
}

export type ProjectStatus = 'in_progress' | 'in_review' | 'completed' | 'backlog';
export type ProjectPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Project {
  id: string;
  title: string;
  key: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  lead: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  tasksCount: {
    total: number;
    done: number;
  };
  tags: string[];
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  category: 'deploy' | 'project' | 'team' | 'security';
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  chartData: number[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'alert' | 'update' | 'mention';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}

export type ActiveTab = 'overview' | 'projects' | 'team' | 'analytics' | 'activity' | 'settings';
