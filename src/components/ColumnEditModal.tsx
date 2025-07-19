import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AlertTriangle, Trash2, Edit } from 'lucide-react';
import type { Column } from '../types';

interface ColumnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: Column | null;
  onUpdateColumn: (columnId: string, updates: Partial<Column>) => void;
  onDeleteColumn: (columnId: string) => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
`;

const RequiredLabel = styled(Label)`
  &::after {
    content: ' *';
    color: hsl(var(--destructive));
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--destructive));
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid hsl(var(--border));
  margin-top: 1.5rem;
`;

const DeleteSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: hsl(var(--destructive) / 0.1);
  border: 1px solid hsl(var(--destructive) / 0.2);
  border-radius: 0.5rem;
`;

const DeleteSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: hsl(var(--destructive));
  font-weight: 600;
`;

const DeleteSectionDescription = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const DeleteButton = styled(Button)`
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
  border-color: hsl(var(--destructive));
  
  &:hover {
    background: hsl(var(--destructive) / 0.9);
  }
`;

export const ColumnEditModal = ({
  isOpen,
  onClose,
  column,
  onUpdateColumn,
  onDeleteColumn,
}: ColumnEditModalProps) => {
  const [title, setTitle] = useState(column?.title || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (column) {
      setTitle(column.title);
      setErrors({});
    }
  }, [column]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'カラム名は必須です';
    }
    
    if (title.length > 50) {
      newErrors.title = 'カラム名は50文字以内で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !column) {
      return;
    }

    onUpdateColumn(column.id, { title: title.trim() });
    onClose();
  };

  const handleDelete = () => {
    if (!column) return;
    
    if (window.confirm('このカラムを削除しますか？\n\nカラム内のすべてのタスクも削除されます。')) {
      setIsDeleting(true);
      onDeleteColumn(column.id);
      onClose();
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setTitle(column?.title || '');
    setErrors({});
    onClose();
  };

  if (!column) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="カラムを編集"
    >
      <FormContainer onSubmit={handleSubmit}>
        {/* カラム名 */}
        <FormField>
          <RequiredLabel htmlFor="title">
            カラム名
          </RequiredLabel>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }));
              }
            }}
            placeholder="カラム名を入力"
            className={errors.title ? 'border-destructive focus:ring-destructive' : ''}
          />
          {errors.title && (
            <ErrorMessage>
              <AlertTriangle style={{ height: '1rem', width: '1rem' }} />
              {errors.title}
            </ErrorMessage>
          )}
        </FormField>

        {/* ボタン */}
        <ButtonContainer>
          <div>
            <Button type="button" variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
          </div>
          <Button type="submit">
            保存
          </Button>
        </ButtonContainer>

        {/* 削除セクション */}
        <DeleteSection>
          <DeleteSectionHeader>
            <Trash2 style={{ height: '1rem', width: '1rem' }} />
            カラムを削除
          </DeleteSectionHeader>
          <DeleteSectionDescription>
            このカラムを削除すると、カラム内のすべてのタスクも削除されます。
            この操作は元に戻すことができません。
          </DeleteSectionDescription>
          <DeleteButton
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            {isDeleting ? '削除中...' : 'カラムを削除'}
          </DeleteButton>
        </DeleteSection>
      </FormContainer>
    </Modal>
  );
}; 