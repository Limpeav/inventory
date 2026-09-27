# Inventory Management System

A full-stack warehouse inventory management system built with **Next.js 14**, **Spring Boot 3**, and **PostgreSQL** using **Clean Architecture**.

## Project Structure

```
inventory/
├── frontend/   # Next.js 14 + TypeScript + Tailwind CSS
└── backend/    # Spring Boot 3 + Java 21 + Clean Architecture
```

## Getting Started

### 1. Setup Database (pgAdmin4)

Open **pgAdmin4** and create a new database:
- Right-click **Databases** → **Create** → **Database**
- Name: `inventory_db`
- Owner: `postgres`
- Click **Save**

Tables and seed data are created automatically on first backend run.

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

> **Initial Admin Credentials:**
> - Username: `admin` (or configured via `APP_ADMIN_USERNAME`)
> - Password: Configured via `APP_ADMIN_PASSWORD` in `.env` / environment variables (or generated securely in logs on first start)

API runs at: `http://localhost:8080/api/v1`

### 3. Run the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Architecture

### Backend — Clean Architecture

```
presentation/   → REST Controllers, DTOs, Exception Handlers
application/    → Use Cases / Business Services
domain/         → Entities, Repository Interfaces (Ports)
infrastructure/ → JPA Adapters, Security, JWT
```

### Frontend — Next.js App Router

```
app/(dashboard)/   → Protected pages (Dashboard, Users, Roles)
app/login/         → Public login page
lib/               → API clients (Axios + interceptors)
store/             → Zustand global state
types/             → TypeScript interfaces
```

---

## Phase 1 Features (Built)

- ✅ JWT Authentication (login / refresh / logout)
- ✅ RBAC — Roles (ADMIN, MANAGER, STAFF) + Permissions
- ✅ User Management (CRUD)
- ✅ Role Management (CRUD + permission assignment)
- ✅ Route protection (middleware + Zustand)
- ✅ Dark premium UI with glassmorphism

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/users` | List users |
| POST | `/api/v1/users` | Create user |
| PUT | `/api/v1/users/{id}` | Update user |
| DELETE | `/api/v1/users/{id}` | Delete user |
| GET | `/api/v1/roles` | List roles |
| POST | `/api/v1/roles` | Create role |
| PUT | `/api/v1/roles/{id}` | Update role |
| DELETE | `/api/v1/roles/{id}` | Delete role |
| GET | `/api/v1/roles/permissions` | List permissions |
# inventory
