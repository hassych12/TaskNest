import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Task, Comment } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { CommentSection } from './CommentSection';

interface TaskEditFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
  onAddComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string, updates: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
`;

const RequiredLabel = styled(Label)`
  &::after {
    content: ' *';
    color: hsl(var(--destructive));
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--destructive));
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0 0.75rem;
  height: 2.5rem;
  border: 1px solid hsl(var(--input));
  border-radius: 0.5rem;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid hsl(var(--border));
  margin-top: 1.5rem;
`;

const StyledButton = styled(Button)`
  min-width: 5rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid hsl(var(--border));
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => $active ? 'hsl(var(--primary))' : 'transparent'};
  color: ${({ $active }) => $active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'};
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: hsl(var(--primary));
  }
`;

const TabContent = styled.div`
  display: ${({ $active }: { $active: boolean }) => $active ? 'block' : 'none'};
`;

export const TaskEditForm = ({ 
  task, 
  onSave, 
  onCancel, 
  onAddComment, 
  onUpdateComment, 
  onDeleteComment 
}: TaskEditFormProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
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
    <div>
      <TabContainer>
        <Tab 
          $active={activeTab === 'details'} 
          onClick={() => setActiveTab('details')}
        >
          詳細
        </Tab>
        <Tab 
          $active={activeTab === 'comments'} 
          onClick={() => setActiveTab('comments')}
        >
          コメント ({task.comments?.length || 0})
        </Tab>
      </TabContainer>

      <TabContent $active={activeTab === 'details'}>
        <FormContainer onSubmit={handleSubmit}>
          {/* タイトル */}
          <FormField>
            <RequiredLabel htmlFor="title">
              タイトル
            </RequiredLabel>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="タスクのタイトルを入力"
              className={errors.title ? 'border-destructive focus:ring-destructive' : ''}
            />
            {errors.title && (
              <ErrorMessage>
                <AlertCircle style={{ height: '1rem', width: '1rem' }} />
                {errors.title}
              </ErrorMessage>
            )}
          </FormField>

          {/* 説明 */}
          <FormField>
            <Label htmlFor="description">
              説明
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="タスクの詳細を入力"
              rows={4}
            />
          </FormField>

          {/* 優先度と担当者を横並びに */}
          <GridContainer>
            {/* 優先度 */}
            <FormField>
              <Label htmlFor="priority">
                優先度
              </Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </Select>
            </FormField>

            {/* 担当者 */}
            <FormField>
              <Label htmlFor="assignee">
                <User style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', display: 'inline' }} />
                担当者
              </Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                placeholder="担当者名を入力"
              />
            </FormField>
          </GridContainer>

          {/* 期限 */}
          <FormField>
            <Label htmlFor="dueDate">
              <Calendar style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', display: 'inline' }} />
              期限
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
          </FormField>

          {/* タグ */}
          <FormField>
            <Label htmlFor="tags">
              <Tag style={{ height: '1rem', width: '1rem', marginRight: '0.5rem', display: 'inline' }} />
              タグ
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="タグをカンマ区切りで入力（例: 開発, バグ修正）"
            />
            <HelpText>
              カンマ区切りで複数のタグを入力できます
            </HelpText>
          </FormField>

          {/* ボタン */}
          <ButtonContainer>
            <StyledButton type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </StyledButton>
            <StyledButton type="submit">
              保存
            </StyledButton>
          </ButtonContainer>
        </FormContainer>
      </TabContent>

      <TabContent $active={activeTab === 'comments'}>
        <CommentSection
          taskId={task.id}
          comments={task.comments || []}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      </TabContent>
    </div>
  );
}; 