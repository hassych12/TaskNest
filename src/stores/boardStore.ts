import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Column, Task, Comment } from '../types';
import { generateId } from '../utils';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (board: Board) => void;
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, column: Column) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (boardId: string, task: Task) => void;
  updateTask: (boardId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;
  // コメント機能
  addComment: (boardId: string, taskId: string, comment: Comment) => void;
  updateComment: (boardId: string, taskId: string, commentId: string, updates: Partial<Comment>) => void;
  deleteComment: (boardId: string, taskId: string, commentId: string) => void;
}

// 日付オブジェクトを安全に復元する関数
const restoreDate = (dateString: string | Date | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  if (dateString instanceof Date) return dateString;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (error) {
    console.error('日付復元エラー:', error);
    return undefined;
  }
};

// ボードデータを復元する関数
const restoreBoard = (board: any): Board => {
  return {
    ...board,
    createdAt: restoreDate(board.createdAt) || new Date(),
    updatedAt: restoreDate(board.updatedAt) || new Date(),
    columns: board.columns?.map((column: any) => ({
      ...column,
      createdAt: restoreDate(column.createdAt) || new Date(),
      updatedAt: restoreDate(column.updatedAt) || new Date(),
    })) || [],
    tasks: board.tasks?.map((task: any) => ({
      ...task,
      createdAt: restoreDate(task.createdAt) || new Date(),
      updatedAt: restoreDate(task.updatedAt) || new Date(),
      dueDate: restoreDate(task.dueDate),
      comments: task.comments?.map((comment: any) => ({
        ...comment,
        createdAt: restoreDate(comment.createdAt) || new Date(),
        updatedAt: restoreDate(comment.updatedAt) || new Date(),
      })) || [],
    })) || [],
  };
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,

      setCurrentBoard: (board) => set({ currentBoard: board }),

      addBoard: (board) =>
        set((state) => ({
          boards: [...state.boards, board],
          currentBoard: board,
        })),

      updateBoard: (boardId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, ...updates, updatedAt: new Date() } : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, ...updates, updatedAt: new Date() }
              : state.currentBoard,
        })),

      deleteBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          currentBoard:
            state.currentBoard?.id === boardId ? null : state.currentBoard,
        })),

      addColumn: (boardId, column) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, columns: [...board.columns, column] }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, columns: [...state.currentBoard.columns, column] }
              : state.currentBoard,
        })),

      updateColumn: (boardId, columnId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? { ...column, ...updates, updatedAt: new Date() }
                      : column
                  ),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.map((column) =>
                    column.id === columnId
                      ? { ...column, ...updates, updatedAt: new Date() }
                      : column
                  ),
                }
              : state.currentBoard,
        })),

      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.filter((column) => column.id !== columnId),
                  tasks: board.tasks.filter((task) => task.columnId !== columnId),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.filter((column) => column.id !== columnId),
                  tasks: state.currentBoard.tasks.filter((task) => task.columnId !== columnId),
                }
              : state.currentBoard,
        })),

      addTask: (boardId, task) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, tasks: [...board.tasks, task] }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, tasks: [...state.currentBoard.tasks, task] }
              : state.currentBoard,
        })),

      updateTask: (boardId, taskId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, ...updates, updatedAt: new Date() }
                      : task
                  ),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  tasks: state.currentBoard.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, ...updates, updatedAt: new Date() }
                      : task
                  ),
                }
              : state.currentBoard,
        })),

      deleteTask: (boardId, taskId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, tasks: board.tasks.filter((task) => task.id !== taskId) }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, tasks: state.currentBoard.tasks.filter((task) => task.id !== taskId) }
              : state.currentBoard,
        })),

      moveTask: (boardId, taskId, fromColumnId, toColumnId, newOrder) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return;

        const task = board.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // 移動先のカラムのタスクを取得して並び替え
        const tasksInTargetColumn = board.tasks
          .filter((t) => t.columnId === toColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        // 新しい順序でタスクを挿入
        tasksInTargetColumn.splice(newOrder, 0, { ...task, columnId: toColumnId, order: newOrder });

        // 移動先カラムのタスクの順序を更新
        const updatedTasksInTargetColumn = tasksInTargetColumn.map((t, index) => ({
          ...t,
          order: index,
        }));

        // 移動元カラムのタスクの順序を更新
        const tasksInSourceColumn = board.tasks
          .filter((t) => t.columnId === fromColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order)
          .map((t, index) => ({ ...t, order: index }));

        // 他のカラムのタスクはそのまま
        const tasksInOtherColumns = board.tasks.filter(
          (t) => t.columnId !== fromColumnId && t.columnId !== toColumnId
        );

        const updatedTasks = [
          ...tasksInOtherColumns,
          ...tasksInSourceColumn,
          ...updatedTasksInTargetColumn,
        ];

        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, tasks: updatedTasks } : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, tasks: updatedTasks }
              : state.currentBoard,
        }));
      },

      reorderColumns: (boardId, columnIds) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return;

        const updatedColumns = columnIds.map((columnId, index) => {
          const column = board.columns.find((c) => c.id === columnId);
          return column ? { ...column, order: index } : column;
        }).filter(Boolean) as Column[];

        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, columns: updatedColumns } : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, columns: updatedColumns }
              : state.currentBoard,
        }));
      },

      // コメント機能
      addComment: (boardId, taskId, comment) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: [...(task.comments || []), comment],
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  tasks: state.currentBoard.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: [...(task.comments || []), comment],
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : state.currentBoard,
        })),

      updateComment: (boardId, taskId, commentId, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: (task.comments || []).map((comment) =>
                            comment.id === commentId
                              ? { ...comment, ...updates, updatedAt: new Date() }
                              : comment
                          ),
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  tasks: state.currentBoard.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: (task.comments || []).map((comment) =>
                            comment.id === commentId
                              ? { ...comment, ...updates, updatedAt: new Date() }
                              : comment
                          ),
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : state.currentBoard,
        })),

      deleteComment: (boardId, taskId, commentId) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: (task.comments || []).filter((comment) => comment.id !== commentId),
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? {
                  ...state.currentBoard,
                  tasks: state.currentBoard.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          comments: (task.comments || []).filter((comment) => comment.id !== commentId),
                          updatedAt: new Date(),
                        }
                      : task
                  ),
                }
              : state.currentBoard,
        })),
    }),
    {
      name: 'tasknest-board-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('🔄 データの復元を開始...');
          
          // ボードデータを復元
          state.boards = state.boards.map(restoreBoard);
          
          // 現在のボードも復元
          if (state.currentBoard) {
            state.currentBoard = restoreBoard(state.currentBoard);
          }
          
          console.log('✅ データの復元が完了しました');
        }
      },
    }
  )
); 