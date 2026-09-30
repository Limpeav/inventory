# 📦 Warehouse Inventory Management System

A production-ready, full-stack warehouse and inventory management platform built with **Next.js 16** (Turbopack, React 19), **Spring Boot 3.3** (Java 21), and **PostgreSQL** adhering to **Clean Architecture** principles with **Role-Based Access Control (RBAC)** and **Real-Time WebSocket Updates**.

---

## 🚀 Key Features

- **🔐 Enterprise Authentication & RBAC**: JWT access/refresh token rotation, password recovery via secure email tokens, and fine-grained permissions for **ADMIN**, **MANAGER**, and **STAFF** roles.
- **⚡ Real-Time WebSocket Streaming**: Instant live push notifications for sales orders, stock adjustments, procurement receipts, and recorded expenses.
- **📊 Comprehensive Executive Dashboard**: KPI metric tracking (Revenue, Procurement Spend, Low Stock Alerts, Network statistics) with shimmer skeleton loaders and micro-animations.
- **📦 Product Catalog & Category Management**: Barcode support, categorization, pricing, reorder levels, cost tracking, and multi-language product naming.
- **🏬 Warehouse Stock & Adjustments**: Live inventory levels, manual stock adjustments, reorder alert watchlist, and sufficient stock indicators.
- **🧾 Sales & Invoicing**: Point of Sale (POS) and sales invoice creation with walk-in or registered customer support, multi-currency pricing (USD, KHR), discount calculation, and order tracking.
- **🛒 Procurement & Purchase Orders**: Supplier purchase order lifecycle, itemized order drafting, and goods-received inventory auto-incrementing.
- **🔄 Sales Returns & Refunds**: Structured return processing with reason tracking, refund calculation, and inventory restocking.
- **💳 Multi-Channel Payments**: Payment logging across multiple payment accounts (Cash, Bank Transfer, Mobile/KHQR).
- **💸 Expense Tracking**: Categorized operating expenses, vendor expense tracking, and monthly expense analytics.
- **🌐 Bilingual Localization**: Seamless instant language toggle supporting **English** and **Khmer (ភាសាខ្មែរ)**.
- **✨ Ultra-Modern Glassmorphic UI**: Dynamic dark/light mode, ambient living gradient backgrounds, card hover elevation, and spring transitions.

---

## 🔒 Security Best Practices (Read Before Pushing to GitHub)

> [!IMPORTANT]
> **Never commit secret keys or sensitive configuration files to GitHub!**

1. **Ignored Files**: Ensure `.env`, `backend/.env`, `frontend/.env.local`, and `application-local.yml` remain untracked:
   ```bash
   # Verify that no sensitive files are staged:
   git status --ignored
   ```
2. **Environment Templates**: Always use `.env.example` templates for public repositories:
   - Backend: [`backend/.env.example`](backend/.env.example)
   - Frontend: [`frontend/.env.example`](frontend/.env.example)
3. **Strong Production Credentials**:
   - **JWT Secret**: Generate a cryptographically secure 256-bit secret for production:
     ```bash
     openssl rand -base64 32
     ```
   - **Admin Password**: Avoid default passwords. Configure `APP_ADMIN_PASSWORD` in your production environment.
   - **Initial Seeding**: Set `APP_SEED_ENABLED=false` after initial database bootstrapping.
4. **CORS Configuration**: Restrict `CORS_ORIGINS` to trusted domains in production (avoid wildcard `*` with credentials).
5. **Database Security**: Use SSL connections (`sslmode=require`) and dedicated, least-privileged PostgreSQL database users in production environments.

---

## 🏗️ Architecture

### Clean Architecture Backend (Spring Boot 3)
```
backend/src/main/java/com/inventory/backend/
├── presentation/     # REST Controllers, DTOs, Exception Handlers
├── application/      # Use Cases, Business Logic & Orchestration
├── domain/           # Core Entities, Value Objects, Repository Interfaces (Ports)
└── infrastructure/   # Spring Data JPA Adapters, Security, JWT, WebSockets, Mail
```

### Next.js App Router Frontend (Next.js 16 + React 19)
```
frontend/src/
├── app/
│   ├── (dashboard)/  # Protected dashboard routes (products, stock, sales, etc.)
│   ├── login/        # Authentication & login flow
│   ├── forgot-password/
│   └── reset-password/
├── components/       # Reusable UI widgets, Toast, Theme & Language toggles
├── hooks/            # Custom hooks (e.g., useWebSocket)
├── lib/              # API clients (Axios interceptors) & i18n translations
└── store/            # Zustand global state (Auth, Language)
```

---

## 💻 Getting Started

### Prerequisites
- **Java**: OpenJDK 21 or later
- **Node.js**: v18.18+ or v20+
- **PostgreSQL**: v14+ (or cloud provider like Neon / Supabase)
- **Maven**: (Maven wrapper `./mvnw` is included)

---

### Step 1: Database Setup

Create a PostgreSQL database named `inventory_db`:

```sql
CREATE DATABASE inventory_db;
```

---

### Step 2: Configure & Run Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your PostgreSQL credentials:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/inventory_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secure_256_bit_jwt_secret
   APP_ADMIN_PASSWORD=your_strong_admin_password
   ```

4. Run the backend application:
   ```bash
   ./mvnw spring-boot:run
   ```

Backend server runs at: `http://localhost:8080/api/v1`  
WebSocket server runs at: `http://localhost:8080/api/v1/ws`

---

### Step 3: Configure & Run Frontend

1. Open a new terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Frontend application runs at: `http://localhost:3000`

---

## 🛠️ Troubleshooting Port Conflicts

If you see `Port 8080 was already in use` or `Port 3000 is in use`:

```bash
# Check running processes on ports 8080 and 3000:
lsof -i :8080 -i :3000

# Stop existing processes by PID if necessary:
kill -9 <PID>
```

---

## 📡 REST API Overview

All API endpoints are prefixed with `/api/v1`:

| Domain | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Authenticate user & issue tokens |
| | `POST` | `/auth/refresh` | Rotate access token via refresh token |
| | `POST` | `/auth/logout` | Revoke session & clear cookies |
| | `POST` | `/auth/forgot-password` | Request password reset token via email |
| | `POST` | `/auth/reset-password` | Set new password with reset token |
| **Users** | `GET`, `POST` | `/users` | List / create application users |
| | `GET`, `PUT`, `DELETE`| `/users/{id}` | Retrieve, update, or deactivate user |
| **Roles** | `GET`, `POST` | `/roles` | List / define roles with permissions |
| | `GET` | `/roles/permissions` | Get all available permissions |
| **Dashboard** | `GET` | `/dashboard/stats` | Aggregated executive KPIs & alerts |
| **Products** | `GET`, `POST` | `/products` | List / register products |
| | `PUT`, `DELETE` | `/products/{id}` | Update or soft-delete product |
| **Categories** | `GET`, `POST` | `/categories` | List / create product categories |
| **Stock** | `GET` | `/stock` | View inventory levels across items |
| | `POST` | `/stock/adjust` | Manual inventory count adjustment |
| **Sales** | `GET`, `POST` | `/sales` | List / record sales invoice orders |
| | `GET` | `/sales/{id}` | Get sale invoice details |
| **Purchases** | `GET`, `POST` | `/purchases` | List / create purchase procurement |
| | `POST` | `/purchases/{id}/receive`| Mark goods received & update stock |
| **Returns** | `GET`, `POST` | `/returns` | List / process sales returns & restock |
| **Payments** | `GET`, `POST` | `/payments` | List / register payments |
| **Expenses** | `GET`, `POST` | `/expenses` | List / record company expenses |
| | `GET`, `POST` | `/expenses/categories` | Expense category management |
| **Entities** | `GET`, `POST` | `/customers`, `/suppliers`, `/employees` | Directory management |

---

## 📜 License

This project is licensed under the MIT License.
