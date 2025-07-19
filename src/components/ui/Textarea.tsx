import React from 'react';
import styled from 'styled-components';

interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 5rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
  padding: 0.75rem;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
  line-height: 1.5;
  transition: all 0.2s ease;
  resize: vertical;
  
  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:invalid {
    border-color: hsl(var(--destructive));
  }
`;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextarea
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea'; 