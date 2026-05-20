# [Feature] Upstream Layer UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the frontend interface for managing global eSIM suppliers, mapping their products to the marketplace, and monitoring API sync logs.

**Architecture:** 
- Clean separation between Next.js Pages (Routes) and View Components.
- Use MUI DataGrid for complex tables (Mapping & Logs).
- Use MUI Cards for Supplier overview.

**Tech Stack:** Next.js 16, MUI, Tabler Icons.

---

### Task 1: Supplier Management Interface

**Files:**
- Create: `src/app/(module)/upstream/suppliers/page.tsx`
- Create: `src/views/upstream/suppliers/SupplierList.tsx`
- Create: `src/views/upstream/suppliers/AddSupplierModal.tsx`

- [ ] **Step 1: Create Suppliers Page Entry**
Create the Next.js page that serves as the entry point for `/upstream/suppliers`.
- [ ] **Step 2: Implement Supplier List View**
Build a grid-based view showing supplier cards with logos, connection status, and quick stats.
- [ ] **Step 3: Build Add/Edit Supplier Modal**
Create a form to input Supplier name, API credentials, and region.
- [ ] **Step 4: Commit**
`git add src/app/(module)/upstream/suppliers src/views/upstream/suppliers && git commit -m "feat: implement suppliers management UI"`

### Task 2: Product Mapping Matrix

**Files:**
- Create: `src/app/(module)/upstream/supplier-products/page.tsx`
- Create: `src/views/upstream/supplier-products/MappingTable.tsx`

- [ ] **Step 1: Create Supplier Products Page Entry**
- [ ] **Step 2: Implement Split-View Mapping Table**
A high-performance table showing:
  - Left: Supplier package details (from API).
  - Center: Status (Mapped/Unmapped).
  - Right: Marketplace Product selector.
- [ ] **Step 3: Implement "Auto-Map" Action**
Add a button to suggest mappings based on string similarity.
- [ ] **Step 4: Commit**
`git add src/app/(module)/upstream/supplier-products src/views/upstream/supplier-products && git commit -m "feat: implement product mapping UI"`

### Task 3: API Sync Monitoring Logs

**Files:**
- Create: `src/app/(module)/upstream/sync-logs/page.tsx`
- Create: `src/views/upstream/sync-logs/LogsList.tsx`

- [ ] **Step 1: Create Sync Logs Page Entry**
- [ ] **Step 2: Implement Activity Log Table**
A list of API calls with timestamps, status, duration, and a "View Payload" button to inspect JSON.
- [ ] **Step 3: Commit**
`git add src/app/(module)/upstream/sync-logs src/views/upstream/sync-logs && git commit -m "feat: implement sync logs monitoring UI"`
