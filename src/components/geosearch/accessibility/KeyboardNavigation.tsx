import React, { useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface SkipLinksProps {
  targets: Array<{
    id: string;
    label: string;
  }>;
}

const SkipLinks: React.FC<SkipLinksProps> = ({ targets }) => {
  const { announceToScreenReader } = useAccessibility();
  const skipLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip links on Tab from top of page
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        skipLinksRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = (targetId: string, label: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader(`Navigation vers ${label}`);
    }
  };

  return (
    <div
      ref={skipLinksRef}
      className="sr-only-focusable fixed top-0 left-0 z-[9999] bg-primary text-primary-foreground p-2 rounded-br-lg"
      role="navigation"
      aria-label="Liens de navigation rapide"
    >
      <ul className="flex gap-2">
        {targets.map((target) => (
          <li key={target.id}>
            <button
              onClick={() => handleSkip(target.id, target.label)}
              className="px-3 py-1 bg-background text-foreground rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Aller à {target.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  trapFocus?: boolean;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onEscape,
  onEnter,
  trapFocus = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusManagement } = useAccessibility();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | undefined;

    if (trapFocus) {
      cleanup = focusManagement.trapFocus(container);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          if (e.target === container) {
            onEnter?.();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      cleanup?.();
    };
  }, [onEscape, onEnter, trapFocus, focusManagement]);

  return (
    <div ref={containerRef} className="outline-none">
      {children}
    </div>
  );
};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  element?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  element: Element = 'span' 
}) => {
  return (
    <Element className="sr-only">
      {children}
    </Element>
  );
};

export default SkipLinks;