
import React from 'react';
import { UnifiedSearchBar } from '@/components/shared';

interface IntegratedSearchBarProps {
  placeholder?: string;
  className?: string;
}

const IntegratedSearchBar: React.FC<IntegratedSearchBarProps> = ({
  placeholder = "Rechercher des lieux, restaurants...",
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <UnifiedSearchBar
        placeholder={placeholder}
        onSearch={(query) => console.log('Search:', query)}
        showSuggestions={true}
        size="md"
      />
    </div>
  );
};

export default IntegratedSearchBar;
