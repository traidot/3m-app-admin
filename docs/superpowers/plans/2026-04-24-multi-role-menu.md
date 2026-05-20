# [Feature] Multi-Role Dynamic Navigation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic role-based filtering for the vertical navigation menu to support 3M Admin and Agent roles.

**Architecture:** 
1. Create a `RoleProvider` context to manage the current user role (simulating authentication).
2. Update `verticalMenuData.tsx` to include metadata about which roles can see which menu items.
3. Update the `VerticalMenu` component to subscribe to the role context and filter items accordingly.

**Tech Stack:** Next.js 16, React Context, MUI.

---

### Task 1: Core Role Infrastructure

**Files:**
- Create: `src/contexts/RoleContext.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Role Context**
Create a React Context to manage the active role (`admin` vs `agent`) with a provider.

```typescript
// src/contexts/RoleContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'admin' | 'agent'
interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('admin')
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole must be used within a RoleProvider')
  return context
}
```

- [ ] **Step 2: Wrap Root Layout**
Include the `RoleProvider` in `src/app/layout.tsx`.

- [ ] **Step 3: Commit**
`git add src/contexts/RoleContext.tsx src/app/layout.tsx && git commit -m "feat: add RoleContext and provider for multi-role support"`

### Task 2: Metadata-driven Menu Configuration

**Files:**
- Modify: `src/data/navigation/verticalMenuData.tsx`

- [ ] **Step 1: Update Menu Data with Role Rules**
Add a `roles` array property to the menu item structure.
- [ ] **Step 2: Group Admin vs Agent items**
Ensure all sections are correctly tagged with their intended roles.
- [ ] **Step 3: Commit**
`git add src/data/navigation/verticalMenuData.tsx && git commit -m "feat: add role-based metadata to vertical menu data"`

### Task 3: Dynamic Menu Rendering

**Files:**
- Modify: `src/components/layout/vertical/VerticalMenu.tsx`
- Modify: `src/app/(module)/dashboard/page.tsx`

- [ ] **Step 1: Implement Filtering in VerticalMenu**
Update `VerticalMenu.tsx` to use `useRole()` and filter `menuData`.
- [ ] **Step 2: Connect Dashboard Switcher**
Update `src/app/(module)/dashboard/page.tsx` to use `useRole()`.
- [ ] **Step 3: Test and Verify**
Switch roles and verify menu updates.
- [ ] **Step 4: Commit**
`git add src/components/layout/vertical/VerticalMenu.tsx src/app/(module)/dashboard/page.tsx && git commit -m "feat: implement dynamic menu filtering based on RoleContext"`
