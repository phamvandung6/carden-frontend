'use client';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface DeckListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  maxVisiblePages?: number;
}

export function DeckListPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}: DeckListPaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange?.(Math.max(0, currentPage - 1))}
              className={cn(
                currentPage === 0 && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange?.(page)}
                isActive={page === currentPage}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange?.(Math.min(totalPages - 1, currentPage + 1))}
              className={cn(
                currentPage >= totalPages - 1 && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
