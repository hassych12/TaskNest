import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';

interface TaskEditFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    assignee: task.assignee || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    tags: task.tags.join(', '),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedTask: Task = {
      ...task,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority as 'low' | 'medium' | 'high',
      assignee: formData.assignee.trim() || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      updatedAt: new Date(),
    };

    onSave(updatedTask);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          タイトル *
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="タスクのタイトルを入力"
          className={`${errors.title ? 'border-destructive focus:ring-destructive' : ''}`}
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.title}
          </p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          説明
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="タスクの詳細を入力"
          rows={4}
          className="resize-none"
        />
      </div>

      {/* 優先度と担当者を横並びに */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 優先度 */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
            優先度
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        {/* 担当者 */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-foreground mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            担当者
          </label>
          <Input
            id="assignee"
            value={formData.assignee}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            placeholder="担当者名を入力"
          />
        </div>
      </div>

      {/* 期限 */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          期限
        </label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleInputChange('dueDate', e.target.value)}
          className="w-full"
        />
      </div>

      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2 flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          タグ
        </label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="タグをカンマ区切りで入力（例: 開発, バグ修正）"
        />
        <p className="text-xs text-muted-foreground mt-1">
          カンマ区切りで複数のタグを入力できます
        </p>
      </div>

      {/* ボタン */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="min-w-[80px]">
          キャンセル
        </Button>
        <Button type="submit" className="min-w-[80px]">
          保存
        </Button>
      </div>
    </form>
  );
}; 