import React from 'react';
import { Board } from './components/Board';
import { ThemeToggle } from './components/ThemeToggle';
import { useBoardStore } from './stores/boardStore';
import { useTheme } from './hooks/useTheme';
import type { Board as BoardType } from './types';
import { generateId } from './utils';

function App() {
  const { boards, currentBoard, setCurrentBoard } = useBoardStore();
  useTheme();

  // サンプルデータを作成
  React.useEffect(() => {
    if (boards.length === 0) {
      const boardId = generateId();
      const column1Id = generateId();
      const column2Id = generateId();
      const column3Id = generateId();
      
      const sampleBoard: BoardType = {
        id: boardId,
        title: 'TaskNest サンプルボード',
        description: 'タスク管理を始めましょう！',
        backgroundColor: 'bg-blue-500',
        columns: [
          {
            id: column1Id,
            title: 'To Do',
            order: 0,
            boardId: boardId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: column2Id,
            title: '進行中',
            order: 1,
            boardId: boardId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: column3Id,
            title: '完了',
            order: 2,
            boardId: boardId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        tasks: [
          {
            id: generateId(),
            title: 'TaskNestアプリの開発',
            description: 'React + TypeScript + Tailwind CSSでモダンなタスク管理アプリを作成する',
            columnId: column1Id,
            order: 0,
            tags: ['開発', 'React'],
            assignee: '開発者',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: generateId(),
            title: 'UI/UXデザインの改善',
            description: 'ユーザビリティを向上させるためのデザイン改善',
            columnId: column2Id,
            order: 0,
            tags: ['デザイン', 'UX'],
            assignee: 'デザイナー',
            priority: 'medium',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: generateId(),
            title: 'ドキュメント作成',
            description: 'プロジェクトの技術ドキュメントを作成する',
            columnId: column1Id,
            order: 1,
            tags: ['ドキュメント'],
            assignee: 'テックライター',
            priority: 'low',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: generateId(),
            title: 'テスト実装',
            description: 'ユニットテストとE2Eテストを実装する',
            columnId: column2Id,
            order: 1,
            tags: ['テスト', '品質'],
            assignee: 'QAエンジニア',
            priority: 'high',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // ボードストアに追加
      useBoardStore.getState().addBoard(sampleBoard);
    }
  }, [boards.length]);

  if (!currentBoard && boards.length > 0) {
    setCurrentBoard(boards[0]);
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TaskNest
          </h1>
          <p className="text-muted-foreground mb-8">
            モダンなタスク管理アプリ
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">TaskNest</h1>
        <ThemeToggle />
      </div>
      <Board board={currentBoard} />
    </div>
  );
}

export default App;
