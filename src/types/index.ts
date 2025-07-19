export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  tags: string[];
  assignee?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  backgroundColor: string;
  columns: Column[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  id: string;
  type: 'task' | 'column';
  columnId?: string;
} 