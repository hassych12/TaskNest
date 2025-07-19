import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: hsl(var(--modal-backdrop, var(--background)));
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  position: relative;
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 2px solid hsl(var(--border));
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeIn 0.2s ease, slideIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px) scale(0.95);
    }
    to {
      transform: translateY(0) scale(1);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(var(--muted), 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--primary));
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary-foreground));
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid hsl(var(--border));
  background: linear-gradient(135deg, rgba(var(--card), 0.95) 0%, rgba(var(--card), 0.98) 100%);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  border-radius: 1rem 1rem 0 0;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--card-foreground));
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CloseButton = styled(Button)`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(var(--destructive), 0.1);
    color: hsl(var(--destructive));
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
`;

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <ModalOverlay>
      <Backdrop onClick={onClose} />
      
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X style={{ height: '1.25rem', width: '1.25rem' }} />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );

  // React Portalを使ってbody直下にレンダリング
  return createPortal(modalContent, document.body);
}; 