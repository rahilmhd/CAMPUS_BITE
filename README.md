# CampusBite — Smart Campus Food Ordering & Insight Platform

> **MCA Final Year Major Academic Project**  
> Digitize campus canteen ordering while providing kitchen staff and administrators with operational and statistical demand forecasting insights.

---

## 📌 Project Overview
The traditional campus canteen experience suffers from long queues during peak hours, unorganized food preparation, cash handling delays, stock shortages, food wastage, and a complete lack of real-time order tracking.

**CampusBite** is a complete, production-grade web platform designed to solve these problems by integrating:
1. **Student Pre-Ordering**: Browse live catalog with dietary labels (Veg, Non-Veg, Vegan, Egg), select advance pickup times, and make digital payments.
2. **Real-Time Live Order Tracking**: Instant visual stepper updates (`PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED`) powered by WebSockets (Socket.IO) without refreshing.
3. **Kitchen Live Queue Display**: Kanban-style operational dashboard for canteen chefs with order urgency timers and 1-click status progression.
4. **Demand Forecasting (Simple Moving Average)**: Transparent mathematical calculation of future food demand with configurable window periods ($N=3$, $N=7$) and kitchen safety stock buffers.
5. **Admin Central Management**: Live sales trends, food popularity rankings, category breakdown, user account management, and one-click CSV / PDF audit report generation.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.IO Client.
- **Backend**: Node.js, Express.js, TypeScript, Socket.IO, Prisma ORM, JWT, bcryptjs, Zod, Helmet, Rate Limiter, PDFKit.
- **Database**: 
  - **Local/Viva Evaluation**: SQLite (`file:./dev.db`) requiring zero external database daemons.
  - **Cloud Production**: PostgreSQL schema (`backend/prisma/schema.postgresql.prisma`) ready for Render, Supabase, Neon, or Railway.
- **Testing**: Vitest test suite covering auth, food catalog, payment verification, and moving-average forecasting algorithms.

---

## 🔑 Demo Login Credentials (For Presentation / Viva)

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **System Admin** | `admin@campusbite.local` | `Admin@123` | Full dashboard, user management, food CRUD, sales analytics, demand forecasting, CSV/PDF reports |
| **Kitchen Staff** | `kitchen@campusbite.local` | `Kitchen@123` | Live Kanban queue, order dispatching, preparation recommendations (SMA) |
| **Student** | `student@campusbite.local` | `Student@123` | Browse menu, cart, checkout, mock digital payment, live order tracker, order history |

*Tip: The web interface also features 1-click quick-fill buttons on the landing page and login screen.*

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Node.js v18+ (Node.js v20 LTS recommended)
- npm v9+

### 2. Environment Setup
```bash
# Backend Environment
cd backend
cp .env.example .env

# Frontend Environment
cd ../frontend
cp .env.example .env
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Database Setup & Seeding
```bash
cd backend
# Push relational schema to local SQLite database
npm run db:push

# Populate 30 days of historical sales and demo users
npm run db:seed
```

### 5. Running the Application
```bash
# Terminal 1: Start Backend API & WebSocket Gateway (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend Web Application (Port 5173)
cd frontend
npm run dev
```

Visit the application at: **`http://localhost:5173`**

---

## 🧪 Automated Testing
Run the automated test suite verifying mathematical forecasting accuracy, JWT tokens, bcrypt hashes, and payment abstractions:
```bash
cd backend
npm run test
```

---

## 📋 Step-by-Step Presentation & Evaluation Flow

1. **Student Pre-Ordering Flow**:
   - Navigate to `http://localhost:5173` and click **"Login as Student"**.
   - Browse the catalog, search for `"Biriyani"`, filter by `"Vegetarian"`, and open the food modal to inspect ingredients and prep time.
   - Add items to cart, proceed to Checkout, select pickup time, and click **"Pay Now"**.
   - In the mock payment sandbox modal, click **"Confirm & Authorize Payment"**.
   - Observe the **"Order Placed Successfully"** celebration screen and click **"Track Order in Real-Time"**.

2. **Kitchen Staff Live Queue Progression**:
   - In a second tab/browser, log in as **Kitchen Staff** (`kitchen@campusbite.local`).
   - Notice the student's order immediately present in the **"New Placed Orders"** column.
   - Click **"Accept Order"** $\to$ card transitions to **Confirmed**.
   - Click **"Start Cooking"** $\to$ card transitions to **Cooking**.
   - Switch back to the student's tab: **the order stepper updates in real-time without refreshing!**
   - Click **"Mark Ready for Pickup"** $\to$ student instantly receives a floating in-app notification: *"Order Ready for Pickup at Counter 1"*.

3. **Admin Insights & Demand Forecasting**:
   - Log in as **System Administrator** (`admin@campusbite.local`).
   - View real-time KPI metrics (Sales Today, Total Orders, Average Order Value).
   - Navigate to **"Demand Forecast"**: select any dish, toggle between 3-day and 7-day Simple Moving Average, and explain the mathematical formulation and safety stock buffer (+8%).
   - Navigate to **"Reports"**: export transactions as **CSV** or **PDF**.

---

## 📚 Project Documentation
- [System Architecture](docs/architecture.md) — Tier diagrams, security model, and WebSocket architecture.
- [Database Schema & ER Model](docs/database.md) — Entity-relationship diagram and data integrity constraints.
- [REST API Reference](docs/api.md) — Endpoint specifications, JSON request/response formats.
- [Demand Forecasting & Viva Defense](docs/forecasting.md) — Mathematical SMA derivation, formulas, and viva questions.
