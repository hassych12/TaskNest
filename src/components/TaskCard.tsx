import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Edit, Trash2, Calendar, User, MessageCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { TaskEditForm } from './TaskEditForm';
import { formatDate, getRelativeTime } from '../utils';
import type { Task, Comment } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string, updates: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
}

const StyledCard = styled(Card)`
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid hsl(var(--border));
  background: linear-gradient(135deg, hsl(var(--card)) 0%, rgba(var(--card), 0.98) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%);
    opacity: 0.8;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: hsl(var(--primary));
    transform: translateY(-2px) scale(1.02);
  }

  &:active {
    transform: translateY(0) scale(1.01);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const TaskTitle = styled.h3`
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  margin: 0;
  color: hsl(var(--card-foreground));
  flex: 1;
`;

const TaskDescription = styled.p`
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: rgba(var(--muted), 0.1);
  border-radius: 0.5rem;
  border-left: 3px solid hsl(var(--primary));
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid hsl(var(--border));
`;

const TaskMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const TaskMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: rgba(var(--muted), 0.2);
  border-radius: 0.375rem;
  font-weight: 500;
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(var(--primary), 0.1);
  color: hsl(var(--primary));
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.7rem;
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.75rem;
`;

const TaskTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%);
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--primary));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${({ priority }) => {
    switch (priority) {
      case 'high':
        return `
          background: linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(185, 28, 28) 100%);
          color: white;
          border-color: rgb(185, 28, 28);
          @media (prefers-color-scheme: dark) {
            background: linear-gradient(135deg, rgb(252, 165, 165) 0%, rgb(239, 68, 68) 100%);
            color: rgb(185, 28, 28);
            border-color: rgb(239, 68, 68);
          }
        `;
      case 'medium':
        return `
          background: linear-gradient(135deg, rgb(234, 179, 8) 0%, rgb(161, 98, 7) 100%);
          color: white;
          border-color: rgb(161, 98, 7);
          @media (prefers-color-scheme: dark) {
            background: linear-gradient(135deg, rgb(253, 224, 71) 0%, rgb(234, 179, 8) 100%);
            color: rgb(161, 98, 7);
            border-color: rgb(234, 179, 8);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(21, 128, 61) 100%);
          color: white;
          border-color: rgb(21, 128, 61);
          @media (prefers-color-scheme: dark) {
            background: linear-gradient(135deg, rgb(134, 239, 172) 0%, rgb(34, 197, 94) 100%);
            color: rgb(21, 128, 61);
            border-color: rgb(34, 197, 94);
          }
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const StyledCardWrapper = styled.div`
  &:hover ${ActionButtons} {
    opacity: 1;
  }
`;

const StyledButton = styled(Button)`
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--primary), 0.1);
    color: hsl(var(--primary));
    transform: scale(1.1);
  }
`;

const DeleteButton = styled(StyledButton)`
  color: hsl(var(--destructive));
  &:hover {
    color: hsl(var(--destructive));
    background: rgba(var(--destructive), 0.1);
  }
`;

export const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onAddComment, 
  onUpdateComment, 
  onDeleteComment 
}: TaskCardProps) => {
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

  const commentCount = task.comments?.length || 0;

  return (
    <>
      <StyledCardWrapper>
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
                    <Edit style={{ height: '0.875rem', width: '0.875rem' }} />
                  </StyledButton>
                  <DeleteButton
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                  >
                    <Trash2 style={{ height: '0.875rem', width: '0.875rem' }} />
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
                  {commentCount > 0 && (
                    <CommentCount>
                      <MessageCircle style={{ height: '0.75rem', width: '0.75rem' }} />
                      <span>{commentCount}</span>
                    </CommentCount>
                  )}
                </TaskMetaLeft>
                <span style={{ fontStyle: 'italic' }}>{getRelativeTime(task.createdAt)}</span>
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
      </StyledCardWrapper>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="タスクを編集"
      >
        <TaskEditForm
          task={task}
          onSave={handleSaveTask}
          onCancel={handleCancelEdit}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      </Modal>
    </>
  );
}; 