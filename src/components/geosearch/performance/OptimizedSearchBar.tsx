import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface OptimizedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  showSuggestions?: boolean;
  suggestions?: Array<{
    id: string;
    name: string;
    address: string;
    coordinates: [number, number];
  }>;
  onSuggestionClick?: (suggestion: any) => void;
  className?: string;
}

const OptimizedSearchBar: React.FC<OptimizedSearchBarProps> = memo(({
  value,
  onChange,
  onSearch,
  placeholder = "Rechercher un lieu...",
  isLoading = false,
  disabled = false,
  showSuggestions = false,
  suggestions = [],
  onSuggestionClick,
  className = ''
}) => {
  // Debounce pour optimiser les performances
  const debouncedSearch = useDebounce(value, 300);

  // Trigger search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    onChange(suggestion.name);
    onSuggestionClick?.(suggestion);
  }, [onChange, onSuggestionClick]);

  const containerVariants = {
    idle: { scale: 1 },
    focused: { scale: 1.02 },
    loading: { scale: 1.01 }
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        animate={isLoading ? 'loading' : 'idle'}
        whileFocus="focused"
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              pl-10 pr-20 h-12 text-base
              border-border/50 hover:border-primary/50 
              focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* Boutons d'action */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            
            {value && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={disabled || !value.trim() || isLoading}
              className="h-8 px-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          variants={suggestionVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="p-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full text-left p-3 rounded-md hover:bg-muted 
                  transition-colors duration-150 focus:outline-none 
                  focus:ring-2 focus:ring-primary/50
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 }
                }}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {suggestion.address}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});

OptimizedSearchBar.displayName = 'OptimizedSearchBar';

export default OptimizedSearchBar;