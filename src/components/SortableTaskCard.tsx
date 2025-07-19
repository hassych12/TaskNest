import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import type { Task } from '../types';

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const SortableContainer = styled.div<{ isDragging: boolean }>`
  transition: all 0.2s ease;
  
  ${({ isDragging }) => isDragging && `
    opacity: 0.5;
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 10;
  `}
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const SortableTaskCard: React.FC<SortableTaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      isDragging={isDragging}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </SortableContainer>
  );
}; 