'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface DeckListBulkSelectorProps {
  totalCount: number;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  show?: boolean;
}

export function DeckListBulkSelector({
  totalCount,
  selectedCount,
  onSelectAll,
  show = true
}: DeckListBulkSelectorProps) {
  if (!show || totalCount === 0) {
    return null;
  }

  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={onSelectAll}
        className={cn(isIndeterminate && 'data-[state=checked]:bg-primary')}
      />
      <span className="text-sm">
        Select all decks
      </span>
    </div>
  );
}
