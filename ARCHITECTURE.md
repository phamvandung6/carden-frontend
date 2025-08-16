# Carden FE - Architecture Guide

## 🏗️ Feature-Based Architecture

Project này được tổ chức theo **feature-based architecture** để đảm bảo:
- **Maintainability**: Mỗi feature độc lập, dễ maintain
- **Scalability**: Dễ thêm features mới mà không ảnh hưởng features khác  
- **Type Safety**: TypeScript types được tổ chức rõ ràng
- **Developer Experience**: Cấu trúc rõ ràng, dễ navigate

## 📁 Cấu trúc thư mục

```
carden-fe/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group  
│   ├── (learning)/        # Learning route group
│   └── api/               # API routes
│
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── common/           # Shared components
│   └── layout/           # Layout components
│
├── features/             # 🎯 Feature modules
│   ├── auth/
│   ├── flashcards/
│   ├── decks/
│   ├── study/
│   ├── practice/
│   └── analytics/
│
├── lib/                  # Shared utilities
│   ├── api/             # API client
│   ├── stores/          # Global stores
│   ├── utils/           # Utility functions
│   ├── hooks/           # Global hooks
│   └── providers/       # React providers
│
└── types/               # Global TypeScript types
    ├── api.ts          # API response types
    └── common.ts       # Common types
```

## 🎯 Feature Module Structure

Mỗi feature được tổ chức theo pattern:

```
features/[feature-name]/
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── services/          # API calls for this feature
├── stores/            # State management
├── types/             # Feature-specific types
├── utils/             # Feature utilities
└── index.ts           # Feature exports
```

## 📋 Nguyên tắc tổ chức

### 1. **Separation of Concerns**
- **app/**: Chỉ chứa routes và layouts
- **components/**: UI components tái sử dụng
- **features/**: Business logic theo feature
- **lib/**: Shared utilities và configurations

### 2. **API Response Standardization**
Tất cả API responses đều follow format chuẩn:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: ApiMeta;
}
```

### 3. **Type Organization**
- **Global types**: `types/` directory
- **Feature types**: `features/[name]/types/`
- **Component props**: Inline hoặc trong component file

### 4. **Import Strategy**
```typescript
// Global imports
import type { ApiResponse } from '@/types';
import { apiClient } from '@/lib/api/client';

// Feature imports  
import { useAuth } from '@/features/auth';
import { DeckCard } from '@/features/decks/components';

// Relative imports (within feature)
import { deckApi } from './services/deck-api';
import type { Deck } from './types';
```

## 🚀 Development Workflow

1. **Tạo feature mới**: Copy structure từ existing feature
2. **Implement types trước**: Define interfaces và types
3. **API layer**: Implement services với standardized responses
4. **State management**: Create stores nếu cần
5. **Components**: Build UI components
6. **Integration**: Connect với global app

## 🔧 Tools & Standards

- **Framework**: Next.js 15 với App Router
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript strict mode
- **API Client**: Axios với interceptors
- **Forms**: React Hook Form + Zod validation

## 📝 Next Steps

Sau khi base structure đã sẵn sàng:
1. Implement API client với interceptors
2. Setup authentication flow
3. Create shared components
4. Implement từng feature theo priority
5. Add testing infrastructure
