import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { MessageCircle, Send, Edit, Trash2, User } from 'lucide-react';
import type { Comment } from '../types';
import { formatDate, getRelativeTime } from '../utils';

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string, updates: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentContainer = styled.div`
  margin-top: 1rem;
  border-top: 1px solid hsl(var(--border));
  padding-top: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: hsl(var(--foreground));
`;

const CommentCount = styled.span`
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
`;

const CommentForm = styled.form`
  margin-bottom: 1rem;
`;

const CommentInput = styled(Textarea)`
  margin-bottom: 0.75rem;
  min-height: 3rem;
  resize: vertical;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  background: hsl(var(--muted) / 0.3);
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(var(--primary));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CommentItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const CommentContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: hsl(var(--foreground));
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentItemActions = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${CommentItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(Button)`
  height: 1.5rem;
  width: 1.5rem;
  padding: 0;
  border-radius: 0.25rem;
  
  &:hover {
    background: rgba(var(--primary), 0.1);
    color: hsl(var(--primary));
  }
`;

const DeleteButton = styled(ActionButton)`
  color: hsl(var(--destructive));
  &:hover {
    color: hsl(var(--destructive));
    background: rgba(var(--destructive), 0.1);
  }
`;

const EditForm = styled.form`
  margin-top: 0.5rem;
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const CommentSection = ({
  taskId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      taskId,
      content: newComment.trim(),
      author: 'ユーザー', // TODO: 実際のユーザー名を取得
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddComment(comment);
    setNewComment('');
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    onUpdateComment(commentId, { content: editContent.trim() });
    setEditingComment(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('このコメントを削除しますか？')) {
      onDeleteComment(commentId);
    }
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <MessageCircle style={{ height: '1rem', width: '1rem' }} />
        コメント
        <CommentCount>{comments.length}</CommentCount>
      </CommentHeader>

      {/* コメント投稿フォーム */}
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを入力..."
          rows={2}
        />
        <CommentActions>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {newComment.length}/1000
          </div>
          <Button type="submit" size="sm" disabled={!newComment.trim()}>
            <Send style={{ height: '0.875rem', width: '0.875rem', marginRight: '0.25rem' }} />
            投稿
          </Button>
        </CommentActions>
      </CommentForm>

      {/* コメント一覧 */}
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentItemHeader>
              <div>
                <CommentAuthor>
                  <User style={{ height: '0.875rem', width: '0.875rem' }} />
                  {comment.author}
                </CommentAuthor>
                <CommentMeta>
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt > comment.createdAt && ' (編集済み)'}
                </CommentMeta>
              </div>
              <CommentItemActions>
                <ActionButton
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditComment(comment)}
                >
                  <Edit style={{ height: '0.75rem', width: '0.75rem' }} />
                </ActionButton>
                <DeleteButton
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 style={{ height: '0.75rem', width: '0.75rem' }} />
                </DeleteButton>
              </CommentItemActions>
            </CommentItemHeader>
            
            {editingComment === comment.id ? (
              <EditForm onSubmit={(e) => handleUpdateComment(e, comment.id)}>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="コメントを編集..."
                  rows={2}
                />
                <EditActions>
                  <Button type="submit" size="sm" disabled={!editContent.trim()}>
                    更新
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                    キャンセル
                  </Button>
                </EditActions>
              </EditForm>
            ) : (
              <CommentContent>{comment.content}</CommentContent>
            )}
          </CommentItem>
        ))}
      </CommentList>
    </CommentContainer>
  );
}; 