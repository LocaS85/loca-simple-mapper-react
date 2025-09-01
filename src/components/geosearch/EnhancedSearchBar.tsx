import React, { useState, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onLocationSelect?: (location: any) => void;
  placeholder?: string;
  userLocation?: [number, number];
  disabled?: boolean;
  className?: string;
  recentSearches?: string[];
  mapboxToken?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  userLocation,
  disabled = false,
  className = "",
  recentSearches = []
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const handleClear = () => {
    onChange('');
    setShowHistory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value);
      setShowHistory(false);
    }
    if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  const handleHistorySelect = (search: string) => {
    onChange(search);
    onSearch(search);
    setShowHistory(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => recentSearches.length > 0 && setShowHistory(true)}
        onBlur={() => setTimeout(() => setShowHistory(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Historique des recherches */}
      {showHistory && recentSearches.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto">
          <div className="p-2 text-xs text-muted-foreground bg-muted/50 border-b">
            Recherches récentes
          </div>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
              onClick={() => handleHistorySelect(search)}
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{search}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchBar;