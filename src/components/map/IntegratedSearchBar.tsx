
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface IntegratedSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  proximity?: [number, number];
  className?: string;
  placeholder?: string;
}

const IntegratedSearchBar: React.FC<IntegratedSearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  proximity,
  className = '',
  placeholder = 'Rechercher...'
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
        className="flex-1"
      />
      <Button onClick={onSearch} size="sm">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default IntegratedSearchBar;
