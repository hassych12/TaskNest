import React from 'react';
import styled from 'styled-components';
import type { Column, Task } from '../types';
import { SortableTaskCard } from './SortableTaskCard';
import { Button } from './ui/Button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
}

const ColumnContainer = styled.div<{ isDragging: boolean }>`
  flex-shrink: 0;
  width: 20rem;
  height: 100%;
  opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
`;

const ColumnContent = styled.div`
  background: rgba(var(--card), 0.9);
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(var(--primary), 0.3);
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ColumnTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: move;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(var(--muted), 0.5);
  }
`;

const ColumnTitle = styled.h3`
  font-weight: 600;
  font-size: 0.875rem;
  color: hsl(var(--card-foreground));
  margin: 0;
`;

const TaskCount = styled.span`
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
`;

const ColumnActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButton = styled(Button)`
  height: 1.5rem;
  width: 1.5rem;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
  min-height: 12.5rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: 2px dashed transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(var(--primary), 0.2);
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
`;

export const ColumnComponent: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}) => {
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

  return (
    <ColumnContainer ref={setNodeRef} style={style} isDragging={isDragging}>
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
          <ColumnActions>
            <ActionButton
              variant="ghost"
              size="icon"
              onClick={() => onAddTask(column.id)}
            >
              <Plus style={{ height: '0.75rem', width: '0.75rem' }} />
            </ActionButton>
            <div style={{ position: 'relative' }}>
              <ActionButton
                variant="ghost"
                size="icon"
              >
                <MoreHorizontal style={{ height: '0.75rem', width: '0.75rem' }} />
              </ActionButton>
              {/* TODO: Add dropdown menu for edit/delete column */}
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
  );
}; 