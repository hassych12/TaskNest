# TaskNest

モダンなタスク管理アプリケーション - TrelloやJiraに似たUI/UXを提供

## 🚀 機能

- **ボード管理**: 複数のボードを作成・管理
- **カラム管理**: カスタマイズ可能なカラム（To Do、進行中、完了など）
- **タスク管理**: ドラッグ&ドロップでタスクを移動
- **タグ機能**: タスクにタグを付けて分類
- **担当者**: タスクに担当者を割り当て
- **期限管理**: タスクに期限を設定
- **レスポンシブデザイン**: モバイル対応
- **ダークモード対応**: ライト/ダークテーマ切り替え

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **ドラッグ&ドロップ**: @dnd-kit
- **アイコン**: Lucide React
- **UIコンポーネント**: カスタムコンポーネント（shadcn/ui風）

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 🎯 今後の機能

- [ ] 認証機能（Supabase Auth / Clerk）
- [ ] リアルタイム同期（WebSocket）
- [ ] ファイル添付機能
- [ ] コメント機能
- [ ] 通知機能
- [ ] ガントチャート表示
- [ ] カレンダービュー
- [ ] チーム機能
- [ ] API連携（Supabase / PocketBase）

## 🎨 UI/UX

- **モダンなデザイン**: Tailwind CSSによる美しいUI
- **直感的な操作**: ドラッグ&ドロップで簡単にタスク移動
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: キーボード操作対応

## 📱 使用方法

1. **ボード作成**: 新しいボードを作成
2. **カラム追加**: 「カラムを追加」ボタンでカラムを作成
3. **タスク作成**: カラム内の「+」ボタンでタスクを追加
4. **タスク移動**: タスクをドラッグ&ドロップで別のカラムに移動
5. **タスク編集**: タスクカードの編集ボタンで詳細を編集

## 🔧 開発

### プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── ui/            # 再利用可能なUIコンポーネント
│   ├── Board.tsx      # ボードコンポーネント
│   ├── Column.tsx     # カラムコンポーネント
│   ├── TaskCard.tsx   # タスクカードコンポーネント
│   └── SortableTaskCard.tsx # ドラッグ可能なタスクカード
├── stores/            # Zustandストア
│   └── boardStore.ts  # ボード状態管理
├── types/             # TypeScript型定義
│   └── index.ts
├── utils/             # ユーティリティ関数
│   └── index.ts
└── App.tsx           # メインアプリケーション
```

### 状態管理

Zustandを使用してボード、カラム、タスクの状態を管理しています。

### ドラッグ&ドロップ

@dnd-kitを使用してタスクのドラッグ&ドロップ機能を実装しています。

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

---

**TaskNest** - モダンなタスク管理を、シンプルに。
