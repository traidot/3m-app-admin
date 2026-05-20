# [Feature] Final UI Implementation Plan

> **Goal:** Implement all remaining frontend interfaces for Admin and Agent roles.

---

### Task 1: Downstream Layer (Admin)
- `/downstream/agents`: List and manage agents.
- `/downstream/tiers`: Define discount tiers.
- `/downstream/api-keys`: Manage API access for agents.

### Task 2: Finance & Wallet (Admin/Agent)
- `/finance/wallets`: Overview of all agent balances.
- `/finance/transactions`: System-wide transaction history.
- `/finance/reconciliation`: Supplier vs Marketplace audit.
- `/finance/my-wallet`: (Agent) View personal balance and top-up.

### Task 3: Orders & Activation (Admin/Agent)
- `/orders/list`: All orders dashboard.
- `/orders/activation-logs`: Technical logs for eSIM delivery.
- `/orders/my-orders`: (Agent) Order history.

### Task 4: System & Settings (Admin)
- `/system/users`: Internal staff management.
- `/system/settings`: Global app configuration.
- `/system/api`: (Agent) API Documentation & Sandbox.

---
### Execution Strategy:
I will implement them group by group, ensuring Vietnamese localization and premium MUI design for every single page.
