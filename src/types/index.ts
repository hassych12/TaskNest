export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  tags: string[];
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  author: string;
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
  backgroundColor?: string;
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