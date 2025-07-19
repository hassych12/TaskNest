import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Column, Task, Comment } from '../types';
import { SortableTaskCard } from './SortableTaskCard';
import { Button } from './ui/Button';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnEditModal } from './ColumnEditModal';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string, updates: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
}

const ColumnContainer = styled.div<{ $isDragging: boolean }>`
  flex-shrink: 0;
  width: 20rem;
  height: 100%;
  opacity: ${({ $isDragging }) => $isDragging ? 0.5 : 1};
`;

const ColumnContent = styled.div`
  background: linear-gradient(135deg, hsl(var(--card)) 0%, rgba(var(--card), 0.95) 100%);
  border: 2px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%);
    opacity: 0.8;
  }

  &:hover {
    border-color: hsl(var(--primary));
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid hsl(var(--border));
`;

const ColumnTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: move;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: rgba(var(--muted), 0.3);

  &:hover {
    background: rgba(var(--primary), 0.1);
    transform: scale(1.02);
  }
`;

const ColumnTitle = styled.h3`
  font-weight: 700;
  font-size: 1rem;
  color: hsl(var(--card-foreground));
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TaskCount = styled.span`
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColumnActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const ActionButton = styled(Button)`
  height: 2rem;
  width: 2rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--primary), 0.1);
    color: hsl(var(--primary));
    transform: scale(1.1);
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 8rem;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
  
  &:only-child {
    border-radius: 0.5rem;
  }
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
  min-height: 12.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px dashed transparent;
  transition: all 0.3s ease;
  background: rgba(var(--muted), 0.1);

  &:hover {
    border-color: hsl(var(--primary));
    background: rgba(var(--primary), 0.05);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(var(--muted), 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--primary));
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary-foreground));
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-style: italic;
  background: rgba(var(--muted), 0.2);
  border-radius: 0.5rem;
  border: 2px dashed hsl(var(--border));
`;

export const ColumnComponent = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onEditColumn, 
  onDeleteColumn,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}: ColumnProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sortedTasks = tasks
    .filter(task => task.columnId === column.id)
    .sort((a, b) => a.order - b.order);

  // ドロップダウンの外側をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    if (window.confirm('このカラムを削除しますか？\n\nカラム内のすべてのタスクも削除されます。')) {
      onDeleteColumn(column.id);
    }
  };

  const handleUpdateColumn = (columnId: string, updates: Partial<Column>) => {
    onEditColumn({ ...column, ...updates });
  };

  return (
    <>
      <ColumnContainer ref={setNodeRef} style={style} $isDragging={isDragging}>
        <ColumnContent>
          <ColumnHeader>
            <ColumnTitleContainer {...attributes} {...listeners}>
              <ColumnTitle>
                {column.title}
              </ColumnTitle>
              <TaskCount>
                {sortedTasks.length}
              </TaskCount>
            </ColumnTitleContainer>
            <ColumnActions ref={dropdownRef}>
              <ActionButton
                variant="ghost"
                size="icon"
                onClick={() => onAddTask(column.id)}
              >
                <Plus style={{ height: '1rem', width: '1rem' }} />
              </ActionButton>
              <div style={{ position: 'relative' }}>
                <ActionButton
                  variant="ghost"
                  size="icon"
                  onClick={handleDropdownToggle}
                >
                  <MoreHorizontal style={{ height: '1rem', width: '1rem' }} />
                </ActionButton>
                <DropdownMenu $isOpen={isDropdownOpen}>
                  <DropdownItem onClick={handleEditClick}>
                    <Edit style={{ height: '0.875rem', width: '0.875rem' }} />
                    編集
                  </DropdownItem>
                  <DropdownItem onClick={handleDeleteClick}>
                    <Trash2 style={{ height: '0.875rem', width: '0.875rem' }} />
                    削除
                  </DropdownItem>
                </DropdownMenu>
              </div>
            </ColumnActions>
          </ColumnHeader>
          
          <SortableContext items={sortedTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <TasksContainer>
              {sortedTasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onAddComment={onAddComment}
                  onUpdateComment={onUpdateComment}
                  onDeleteComment={onDeleteComment}
                />
              ))}
              {sortedTasks.length === 0 && (
                <EmptyState>
                  タスクをドロップしてください
                </EmptyState>
              )}
            </TasksContainer>
          </SortableContext>
        </ColumnContent>
      </ColumnContainer>

      <ColumnEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        column={column}
        onUpdateColumn={handleUpdateColumn}
        onDeleteColumn={onDeleteColumn}
      />
    </>
  );
}; 