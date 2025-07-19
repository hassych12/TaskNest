import React from 'react';
import { Board } from './components/Board';
import { ThemeToggle } from './components/ThemeToggle';
import { useBoardStore } from './stores/boardStore';
import { useTheme } from './hooks/useTheme';
import type { Board as BoardType, Comment } from './types';
import { generateId } from './utils';

// エラーバウンダリーコンポーネント
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('エラーバウンダリーでキャッチされたエラー:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              エラーが発生しました
            </h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || '不明なエラーが発生しました'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { boards, currentBoard, setCurrentBoard, addBoard } = useBoardStore();
  useTheme();

  // サンプルデータを作成
  React.useEffect(() => {
    if (boards.length === 0) {
      const boardId = generateId();
      const column1Id = generateId();
      const column2Id = generateId();
      const column3Id = generateId();
      
      // サンプルコメントを作成
      const sampleComment1: Comment = {
        id: generateId(),
        taskId: '', // 後で設定
        content: 'このタスクは重要です。優先的に取り組んでください。',
        author: 'プロジェクトマネージャー',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      };

      const sampleComment2: Comment = {
        id: generateId(),
        taskId: '', // 後で設定
        content: 'UIの改善点について議論しましょう。',
        author: 'デザイナー',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1時間前
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      };

      const sampleComment3: Comment = {
        id: generateId(),
        taskId: '', // 後で設定
        content: 'テストケースを追加しました。確認をお願いします。',
        author: 'QAエンジニア',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30分前
        updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      };
      
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
            comments: [sampleComment1],
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
            comments: [sampleComment2],
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
            comments: [],
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
            comments: [sampleComment3],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // コメントのtaskIdを設定
      sampleComment1.taskId = sampleBoard.tasks[0].id;
      sampleComment2.taskId = sampleBoard.tasks[1].id;
      sampleComment3.taskId = sampleBoard.tasks[3].id;
      
      // ボードストアに追加
      addBoard(sampleBoard);
      
      // デバッグ用: localStorageの状態をコンソールに出力
      console.log('📦 初期データを作成しました:', sampleBoard);
      console.log('💾 localStorageの状態:', localStorage.getItem('tasknest-board-storage'));
    }
  }, [boards.length, addBoard]);

  // データの永続化状態を監視
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log('💾 localStorageが更新されました:', localStorage.getItem('tasknest-board-storage'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // データの読み込み状態を監視
  React.useEffect(() => {
    if (boards.length > 0) {
      console.log('📊 現在のボード数:', boards.length);
      console.log('📋 現在のタスク数:', boards.reduce((total, board) => total + board.tasks.length, 0));
      console.log('💬 現在のコメント数:', boards.reduce((total, board) => 
        total + board.tasks.reduce((taskTotal, task) => 
          taskTotal + (task.comments?.length || 0), 0), 0));
    }
  }, [boards]);

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
    <ErrorBoundary>
      <div className="h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">TaskNest</h1>
          <div className="flex items-center gap-4">
            {/* デバッグ情報 */}
            {import.meta.env.DEV && (
              <div className="text-xs text-muted-foreground">
                ボード: {boards.length} | タスク: {boards.reduce((total, board) => total + board.tasks.length, 0)} | コメント: {boards.reduce((total, board) => 
                  total + board.tasks.reduce((taskTotal, task) => 
                    taskTotal + (task.comments?.length || 0), 0), 0)}
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
        <Board board={currentBoard} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
