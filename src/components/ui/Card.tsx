import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled.div`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  color: hsl(var(--card-foreground));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCard
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  space-y: 0.5rem;
  padding: 1.5rem;
`;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCardHeader
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCardHeader>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.75rem;
  letter-spacing: -0.025em;
  margin: 0;
`;

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCardTitle
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCardTitle>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardDescription = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
`;

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCardDescription
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCardDescription>
    );
  }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardContent = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`;

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCardContent
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCardContent>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
`;

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <StyledCardFooter
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </StyledCardFooter>
    );
  }
);

CardFooter.displayName = 'CardFooter'; 