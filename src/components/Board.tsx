import React from 'react';
import styled from 'styled-components';
import type { Board as BoardType, Column, Task, Comment } from '../types';
import { ColumnComponent } from './Column';
import { TaskCard } from './TaskCard';
import { Button } from './ui/Button';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore } from '../stores/boardStore';

interface BoardProps {
  board: BoardType;
}

const BoardContainer = styled.div`
  height: 100%;
  background: hsl(var(--background));
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const BoardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const BoardTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0;
`;

const BoardDescription = styled.p`
  color: hsl(var(--muted-foreground));
  margin: 0.5rem 0 0 0;
`;

const BoardContent = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  flex: 1;
  padding-bottom: 1.5rem;
`;

const AddColumnButton = styled(Button)`
  flex-shrink: 0;
  width: 20rem;
  height: 3rem;
  border: 2px dashed hsl(var(--border));
  border-radius: 0.5rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(var(--primary), 0.5);
  }
`;

const DragOverlayContainer = styled.div`
  transform: rotate(3deg) scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const Board = ({ board }: BoardProps) => {
  const {
    addColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderColumns,
    updateColumn,
    deleteColumn,
    addComment,
    updateComment,
    deleteComment,
  } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      const task = board.tasks.find(t => t.id === active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) {
      setActiveTask(null);
      return;
    }

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    const isOverColumn = over.data.current?.type === 'column';

    if (isActiveTask) {
      const activeTask = board.tasks.find(t => t.id === activeId);
      
      if (isOverTask) {
        // タスクを別のタスクの上にドロップ
        const overTask = board.tasks.find(t => t.id === overId);
        if (activeTask && overTask) {
          if (activeTask.columnId === overTask.columnId) {
            // 同じカラム内での並び替え
            const tasksInColumn = board.tasks
              .filter(t => t.columnId === activeTask.columnId)
              .sort((a, b) => a.order - b.order);
            
            const activeIndex = tasksInColumn.findIndex(t => t.id === activeId);
            const overIndex = tasksInColumn.findIndex(t => t.id === overId);
            
            if (activeIndex !== -1 && overIndex !== -1) {
              // ドロップ位置に基づいて新しい順序を計算
              const newOrder = overIndex;
              moveTask(board.id, activeId, activeTask.columnId, activeTask.columnId, newOrder);
            }
          } else {
            // 異なるカラム間での移動
            const tasksInTargetColumn = board.tasks.filter(t => t.columnId === overTask.columnId);
            const overIndex = tasksInTargetColumn.findIndex(t => t.id === overId);
            const newOrder = overIndex !== -1 ? overIndex : tasksInTargetColumn.length;
            moveTask(board.id, activeId, activeTask.columnId, overTask.columnId, newOrder);
          }
        }
      } else if (isOverColumn) {
        // タスクをカラムにドロップ
        const overColumn = board.columns.find(c => c.id === overId);
        if (activeTask && overColumn && activeTask.columnId !== overColumn.id) {
          const tasksInColumn = board.tasks.filter(t => t.columnId === overColumn.id);
          const newOrder = tasksInColumn.length;
          moveTask(board.id, activeId, activeTask.columnId, overColumn.id, newOrder);
        }
      }
    }

    setActiveTask(null);
  };

  const handleAddColumn = () => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: '新しいカラム',
      order: board.columns.length,
      boardId: board.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addColumn(board.id, newColumn);
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: '新しいタスク',
      columnId,
      order: board.tasks.filter(t => t.columnId === columnId).length,
      tags: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addTask(board.id, newTask);
  };

  const handleEditTask = (task: Task) => {
    updateTask(board.id, task.id, task);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(board.id, taskId);
  };

  const handleEditColumn = (column: Column) => {
    updateColumn(board.id, column.id, column);
  };

  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(board.id, columnId);
  };

  const handleAddComment = (comment: Comment) => {
    addComment(board.id, comment.taskId, comment);
  };

  const handleUpdateComment = (commentId: string, updates: Partial<Comment>) => {
    // コメントのタスクIDを取得
    const task = board.tasks.find(t => t.comments?.some(c => c.id === commentId));
    if (task) {
      updateComment(board.id, task.id, commentId, updates);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    // コメントのタスクIDを取得
    const task = board.tasks.find(t => t.comments?.some(c => c.id === commentId));
    if (task) {
      deleteComment(board.id, task.id, commentId);
    }
  };

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>
          {board.title}
        </BoardTitle>
        {board.description && (
          <BoardDescription>
            {board.description}
          </BoardDescription>
        )}
      </BoardHeader>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={(event) => {
          const { active, over } = event;
          
          if (!over) return;

          const activeId = active.id as string;
          const overId = over.id as string;

          if (activeId === overId) return;

          const isActiveTask = active.data.current?.type === 'task';
          const isOverTask = over.data.current?.type === 'task';
          const isOverColumn = over.data.current?.type === 'column';

          if (isActiveTask) {
            const activeTask = board.tasks.find(t => t.id === activeId);
            
            if (isOverTask) {
              // タスクを別のタスクの上にドロップ
              const overTask = board.tasks.find(t => t.id === overId);
              if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
                const tasksInTargetColumn = board.tasks.filter(t => t.columnId === overTask.columnId);
                const overIndex = tasksInTargetColumn.findIndex(t => t.id === overId);
                const newOrder = overIndex !== -1 ? overIndex : tasksInTargetColumn.length;
                moveTask(board.id, activeId, activeTask.columnId, overTask.columnId, newOrder);
              }
            } else if (isOverColumn) {
              // タスクをカラムにドロップ
              const overColumn = board.columns.find(c => c.id === overId);
              if (activeTask && overColumn && activeTask.columnId !== overColumn.id) {
                const tasksInColumn = board.tasks.filter(t => t.columnId === overColumn.id);
                const newOrder = tasksInColumn.length;
                moveTask(board.id, activeId, activeTask.columnId, overColumn.id, newOrder);
              }
            }
          }
        }}
        onDragEnd={handleDragEnd}
      >
        <BoardContent>
          <SortableContext
            items={board.columns.map(col => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <ColumnComponent
                  key={column.id}
                  column={column}
                  tasks={board.tasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onAddComment={handleAddComment}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))}
          </SortableContext>
          
          <AddColumnButton
            variant="outline"
            onClick={handleAddColumn}
          >
            <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            カラムを追加
          </AddColumnButton>
        </BoardContent>
        
        <DragOverlay>
          {activeTask ? (
            <DragOverlayContainer>
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                onAddComment={() => {}}
                onUpdateComment={() => {}}
                onDeleteComment={() => {}}
              />
            </DragOverlayContainer>
          ) : null}
        </DragOverlay>
      </DndContext>
    </BoardContainer>
  );
}; 