// Common types used across the application
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SortOrder = 'asc' | 'desc';
