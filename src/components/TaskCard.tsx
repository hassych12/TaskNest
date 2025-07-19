import React, { useState } from 'react';
import styled from 'styled-components';
import type { Task } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { formatDate, getRelativeTime } from '../utils';
import { Modal } from './ui/Modal';
import { TaskEditForm } from './TaskEditForm';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const StyledCard = styled(Card)`
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid rgba(var(--border), 0.6);
  background: linear-gradient(135deg, hsl(var(--card)) 0%, rgba(var(--card), 0.95) 100%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: rgba(var(--primary), 0.4);
    transform: scale(1.02);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TaskTitle = styled.h3`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.2;
  margin: 0;
`;

const TaskDescription = styled.p`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const TaskMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const TaskTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(var(--primary), 0.1);
  color: hsl(var(--primary));
  border: 1px solid rgba(var(--primary), 0.2);
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  margin-top: 0.25rem;

  ${({ priority }) => {
    switch (priority) {
      case 'high':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: rgb(185, 28, 28);
          border-color: rgba(239, 68, 68, 0.2);
          @media (prefers-color-scheme: dark) {
            background: rgba(239, 68, 68, 0.3);
            color: rgb(252, 165, 165);
            border-color: rgba(239, 68, 68, 0.8);
          }
        `;
      case 'medium':
        return `
          background: rgba(234, 179, 8, 0.1);
          color: rgb(161, 98, 7);
          border-color: rgba(234, 179, 8, 0.2);
          @media (prefers-color-scheme: dark) {
            background: rgba(234, 179, 8, 0.3);
            color: rgb(253, 224, 71);
            border-color: rgba(234, 179, 8, 0.8);
          }
        `;
      default:
        return `
          background: rgba(34, 197, 94, 0.1);
          color: rgb(21, 128, 61);
          border-color: rgba(34, 197, 94, 0.2);
          @media (prefers-color-scheme: dark) {
            background: rgba(34, 197, 94, 0.3);
            color: rgb(134, 239, 172);
            border-color: rgba(34, 197, 94, 0.8);
          }
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

const StyledButton = styled(Button)`
  height: 1.5rem;
  width: 1.5rem;
`;

const DeleteButton = styled(StyledButton)`
  color: hsl(var(--destructive));
  &:hover {
    color: hsl(var(--destructive));
  }
`;

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 編集ボタンや削除ボタンがクリックされた場合はモーダルを開かない
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    onEdit(updatedTask);
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <StyledCard onClick={handleCardClick}>
        <CardContent className="p-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <TaskHeader>
              <div style={{ flex: 1 }}>
                <TaskTitle>{task.title}</TaskTitle>
                {task.priority && (
                  <PriorityBadge priority={task.priority}>
                    {task.priority}
                  </PriorityBadge>
                )}
              </div>
              <ActionButtons>
                <StyledButton
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                >
                  <Edit style={{ height: '0.75rem', width: '0.75rem' }} />
                </StyledButton>
                <DeleteButton
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                >
                  <Trash2 style={{ height: '0.75rem', width: '0.75rem' }} />
                </DeleteButton>
              </ActionButtons>
            </TaskHeader>
            
            {task.description && (
              <TaskDescription>
                {task.description}
              </TaskDescription>
            )}
            
            <TaskMeta>
              <TaskMetaLeft>
                {task.dueDate && (
                  <TaskMetaItem>
                    <Calendar style={{ height: '0.75rem', width: '0.75rem' }} />
                    <span>{formatDate(task.dueDate)}</span>
                  </TaskMetaItem>
                )}
                {task.assignee && (
                  <TaskMetaItem>
                    <User style={{ height: '0.75rem', width: '0.75rem' }} />
                    <span>{task.assignee}</span>
                  </TaskMetaItem>
                )}
              </TaskMetaLeft>
              <span>{getRelativeTime(task.createdAt)}</span>
            </TaskMeta>
            
            {task.tags.length > 0 && (
              <TaskTags>
                {task.tags.map((tag, index) => (
                  <TaskTag key={index}>
                    {tag}
                  </TaskTag>
                ))}
              </TaskTags>
            )}
          </div>
        </CardContent>
      </StyledCard>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="タスクを編集"
      >
        <TaskEditForm
          task={task}
          onSave={handleSaveTask}
          onCancel={handleCancelEdit}
        />
      </Modal>
    </>
  );
}; 