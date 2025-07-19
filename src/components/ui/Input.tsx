import React from 'react';
import styled from 'styled-components';

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const StyledInput = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
  
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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledInput
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 