# Woof Circle - Folder Structure

This document outlines the folder structure for the Woof Circle project, which is built on a modern **Laravel 11** backend and an **Inertia.js + React + Tailwind CSS** frontend.

## 📂 Root Directory (`/`)
The root contains standard Laravel scaffolding, configuration files (Vite, Tailwind, TypeScript, PHPStan, PHPUnit), and key markdown documents (like this one and `DESIGN.md`).

### 📁 `.agent/` & `.agents/`
Contains system AI configurations, automated scripts, workflows, and rules used by the Antigravity assistant for testing, codebase maintenance, and feature generation.

### 📁 `app/` (Backend Application Core)
Contains the core PHP logic of the application.
- `Console/`: Artisan custom commands.
- `Exceptions/`: Custom exception handlers.
- `Http/`:
  - `Controllers/`: Route controllers organized by features (e.g., `Admin/`, `API/`, standard web controllers).
  - `Middleware/`: HTTP middleware for filtering requests (e.g., admin authentication).
  - `Requests/`: Form request validation classes.
- `Models/`: Eloquent ORM models representing the database schema (e.g., `User`, `Pet`, `DirectoryProfile`, `Adoption`, `Badge`).
- `Providers/`: Service providers for bootstrapping application services.
- `Support/`: Utility classes and services (e.g., `DashboardStats.php`).

### 📁 `bootstrap/`
Contains the `app.php` file which bootstraps the Laravel framework, including routing, middleware, and exception configuration.

### 📁 `config/`
Configuration files for the application (database, mail, services, cashier, etc.).

### 📁 `database/`
Database definitions and seeds.
- `factories/`: Model factories for generating test data.
- `migrations/`: Database schema definitions, strictly following a phase-based execution strategy (e.g., `01_system`, `02_auth`, etc.).
- `seeders/`: Classes used to populate the database with dummy/initial data.

### 📁 `public/`
The public entry point (`index.php`). Also stores publicly accessible assets like images, compiled CSS/JS from Vite, and user-uploaded media (via symlink to `storage/app/public`).

### 📁 `resources/` (Frontend UI & Views)
Contains uncompiled frontend assets.
- `css/`: Tailwind CSS entry points (`app.css` and `index.css`) containing global styles and design tokens.
- `js/`: The entire React + Inertia frontend application.
  - `Components/`: Reusable UI components (buttons, modals, forms, layout elements).
  - `Layouts/`: Page layouts (e.g., `AuthenticatedLayout`, `AdminLayout`, `GuestLayout`).
  - `Pages/`: React page components that map directly to Laravel routes (e.g., `Auth/`, `Admin/`, `Dashboard/`, `Directory/`, `Marketplace/`).
  - `types/`: TypeScript definitions and interfaces.
  - `lib/`: Utility functions (e.g., class merging).
- `views/`: Laravel Blade templates (mostly just `app.blade.php` as the Inertia root).

### 📁 `routes/`
Application route definitions.
- `web.php`: Frontend and authenticated user web routes.
- `admin.php`: Dedicated routes for the superadmin control panel.
- `api.php`: API endpoints for stateless requests.
- `console.php`: Closure-based console commands.

### 📁 `storage/`
Compiled Blade templates, file-based sessions, file caches, and user-uploaded files.
- `app/public/`: Uploaded images, pet avatars, and directory logos (symlinked to `/public/storage`).
- `logs/`: Application error logs (`laravel.log`).

### 📁 `tests/`
Automated test suite (Pest / PHPUnit).
- `Feature/`: End-to-end and integration tests for application features (Auth, Dashboard, Profiles, Map, Payments).
- `Unit/`: Isolated unit tests for individual classes/functions.

---

## 🏗️ Key Architectural Features
1. **Polymorphic Directory:** All directory members (Vets, Breeders, Trainers, Boarding, Welfare) share the `directory_profiles` table, mapped to specific models via Eloquent's `enforceMorphMap`.
2. **Minimalist Testing:** We enforce strict testing practices. Obsolete tests for dropped features (e.g., `adoption_images`, `vet_galleries`) have been intentionally purged.
3. **TypeScript + React:** The frontend is fully typed (`resources/js/types/`) ensuring robust state management via Inertia.js.
