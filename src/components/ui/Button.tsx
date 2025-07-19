import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const buttonVariants = {
  default: css`
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border: 1px solid hsl(var(--primary));
    
    &:hover {
      background: hsl(var(--primary) / 0.9);
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
  destructive: css`
    background: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    border: 1px solid hsl(var(--destructive));
    
    &:hover {
      background: hsl(var(--destructive) / 0.9);
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
  outline: css`
    background: transparent;
    color: hsl(var(--foreground));
    border: 1px solid hsl(var(--input));
    
    &:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
  secondary: css`
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    border: 1px solid hsl(var(--secondary));
    
    &:hover {
      background: hsl(var(--secondary) / 0.8);
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
  ghost: css`
    background: transparent;
    color: hsl(var(--foreground));
    border: 1px solid transparent;
    
    &:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
  link: css`
    background: transparent;
    color: hsl(var(--primary));
    border: 1px solid transparent;
    text-decoration: underline;
    text-underline-offset: 4px;
    
    &:hover {
      color: hsl(var(--primary) / 0.8);
    }
    
    &:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `,
};

const buttonSizes = {
  default: css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  `,
  sm: css`
    height: 2rem;
    padding: 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
  `,
  lg: css`
    height: 3rem;
    padding: 0 1.5rem;
    font-size: 1rem;
    font-weight: 500;
  `,
  icon: css`
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

const StyledButton = styled.button<{
  $variant: keyof typeof buttonVariants;
  $size: keyof typeof buttonSizes;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ $variant }) => buttonVariants[$variant]}
  ${({ $size }) => buttonSizes[$size]}
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button'; 