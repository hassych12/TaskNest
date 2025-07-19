import { create } from 'zustand';
import type { Board, Column, Task } from '../types';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  
  // Column actions
  addColumn: (boardId: string, column: Column) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;
  
  // Task actions
  addTask: (boardId: string, task: Task) => void;
  updateTask: (boardId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  
  addBoard: (board) => set((state) => ({
    boards: [...state.boards, board]
  })),
  
  updateBoard: (boardId, updates) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId ? { ...board, ...updates } : board
    ),
    currentBoard: state.currentBoard?.id === boardId 
      ? { ...state.currentBoard, ...updates }
      : state.currentBoard
  })),
  
  deleteBoard: (boardId) => set((state) => ({
    boards: state.boards.filter(board => board.id !== boardId),
    currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard
  })),
  
  addColumn: (boardId, column) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { ...board, columns: [...board.columns, column] }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? { ...state.currentBoard, columns: [...state.currentBoard.columns, column] }
      : state.currentBoard
  })),
  
  updateColumn: (boardId, columnId, updates) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { 
            ...board, 
            columns: board.columns.map(col => 
              col.id === columnId ? { ...col, ...updates } : col
            )
          }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map(col =>
            col.id === columnId ? { ...col, ...updates } : col
          )
        }
      : state.currentBoard
  })),
  
  deleteColumn: (boardId, columnId) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { 
            ...board, 
            columns: board.columns.filter(col => col.id !== columnId),
            tasks: board.tasks.filter(task => task.columnId !== columnId)
          }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? {
          ...state.currentBoard,
          columns: state.currentBoard.columns.filter(col => col.id !== columnId),
          tasks: state.currentBoard.tasks.filter(task => task.columnId !== columnId)
        }
      : state.currentBoard
  })),
  
  reorderColumns: (boardId, columnIds) => set((state) => {
    const board = state.boards.find(b => b.id === boardId);
    if (!board) return state;
    
    const reorderedColumns = columnIds.map((id, index) => {
      const column = board.columns.find(col => col.id === id);
      return column ? { ...column, order: index } : null;
    }).filter(Boolean) as Column[];
    
    return {
      boards: state.boards.map(b => 
        b.id === boardId ? { ...b, columns: reorderedColumns } : b
      ),
      currentBoard: state.currentBoard?.id === boardId
        ? { ...state.currentBoard, columns: reorderedColumns }
        : state.currentBoard
    };
  }),
  
  addTask: (boardId, task) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { ...board, tasks: [...board.tasks, task] }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? { ...state.currentBoard, tasks: [...state.currentBoard.tasks, task] }
      : state.currentBoard
  })),
  
  updateTask: (boardId, taskId, updates) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { 
            ...board, 
            tasks: board.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? {
          ...state.currentBoard,
          tasks: state.currentBoard.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        }
      : state.currentBoard
  })),
  
  deleteTask: (boardId, taskId) => set((state) => ({
    boards: state.boards.map(board => 
      board.id === boardId 
        ? { ...board, tasks: board.tasks.filter(task => task.id !== taskId) }
        : board
    ),
    currentBoard: state.currentBoard?.id === boardId
      ? {
          ...state.currentBoard,
          tasks: state.currentBoard.tasks.filter(task => task.id !== taskId)
        }
      : state.currentBoard
  })),
  
  moveTask: (boardId, taskId, fromColumnId, toColumnId, newOrder) => set((state) => {
    const board = state.boards.find(b => b.id === boardId);
    if (!board) return state;
    
    const task = board.tasks.find(t => t.id === taskId);
    if (!task) return state;
    
    // 同じカラム内での並び替えの場合
    if (fromColumnId === toColumnId) {
      const tasksInColumn = board.tasks
        .filter(t => t.columnId === fromColumnId)
        .sort((a, b) => a.order - b.order);
      
      const oldIndex = tasksInColumn.findIndex(t => t.id === taskId);
      if (oldIndex === -1) return state;
      
      // タスクを削除
      const tasksWithoutMoved = tasksInColumn.filter(t => t.id !== taskId);
      
      // 新しい位置に挿入
      const beforeInsert = tasksWithoutMoved.slice(0, newOrder);
      const afterInsert = tasksWithoutMoved.slice(newOrder);
      
      const reorderedTasks = [
        ...beforeInsert.map((t, index) => ({ ...t, order: index })),
        { ...task, order: newOrder },
        ...afterInsert.map((t, index) => ({ ...t, order: newOrder + 1 + index }))
      ];
      
      // 他のカラムのタスクを取得
      const otherColumnTasks = board.tasks.filter(t => t.columnId !== fromColumnId);
      
      const allUpdatedTasks = [...otherColumnTasks, ...reorderedTasks];
      
      return {
        boards: state.boards.map(b => 
          b.id === boardId ? { ...b, tasks: allUpdatedTasks } : b
        ),
        currentBoard: state.currentBoard?.id === boardId
          ? { ...state.currentBoard, tasks: allUpdatedTasks }
          : state.currentBoard
      };
    }
    
    // 異なるカラム間での移動の場合
    const updatedTask = { ...task, columnId: toColumnId, order: newOrder };
    
    // 移動元のカラムのタスクを再順序付け
    const sourceColumnTasks = board.tasks
      .filter(t => t.columnId === fromColumnId && t.id !== taskId)
      .sort((a, b) => a.order - b.order)
      .map((t, index) => ({ ...t, order: index }));
    
    // 移動先のカラムのタスクを再順序付け
    const targetColumnTasks = board.tasks
      .filter(t => t.columnId === toColumnId)
      .sort((a, b) => a.order - b.order)
      .map((t, index) => ({ ...t, order: index >= newOrder ? index + 1 : index }));
    
    // 他のカラムのタスクを取得
    const otherColumnTasks = board.tasks.filter(t => 
      t.columnId !== fromColumnId && t.columnId !== toColumnId
    );
    
    const allUpdatedTasks = [
      ...otherColumnTasks,
      ...sourceColumnTasks,
      ...targetColumnTasks,
      updatedTask
    ];
    
    return {
      boards: state.boards.map(b => 
        b.id === boardId ? { ...b, tasks: allUpdatedTasks } : b
      ),
      currentBoard: state.currentBoard?.id === boardId
        ? { ...state.currentBoard, tasks: allUpdatedTasks }
        : state.currentBoard
    };
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
})); 