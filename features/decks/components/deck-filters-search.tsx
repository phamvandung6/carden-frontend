'use client';

import { useRef, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface DeckFiltersSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DeckFiltersSearch = memo(function DeckFiltersSearch({ 
  value, 
  onChange, 
  placeholder = "Search decks..." 
}: DeckFiltersSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    // Focus sau khi clear để user có thể tiếp tục gõ
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        key="deck-search-input" 
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="pl-9 pr-4"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
});