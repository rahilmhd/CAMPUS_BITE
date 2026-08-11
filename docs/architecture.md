# CampusBite — System Architecture Documentation
## Smart Campus Food Ordering & Insight Platform

CampusBite is engineered as a modern, full-stack campus canteen digitization platform following Clean Architecture and Separation of Concerns principles.

---

## 1. High-Level Architectural Diagram

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (Frontend)                            |
|  React 18 • TypeScript • Vite • Tailwind CSS • Lucide Icons • Recharts        |
|                                                                               |
|  +--------------------+  +----------------------+  +------------------------+ |
|  |   Student Portal   |  | Kitchen Staff Portal |  |  Administrator Portal  | |
|  | - Live Food Catalog|  | - Live Kanban Queue  |  | - Analytics KPIs       | |
|  | - Advance Ordering |  | - Prep Advice (SMA)  |  | - Menu & User CRUD     | |
|  | - Real-Time Tracker|  | - Status Lifecycle   |  | - Demand Forecast (SMA)| |
|  | - In-App Notifs    |  | - Order Ticker       |  | - CSV & PDF Exporters  | |
|  +--------------------+  +----------------------+  +------------------------+ |
+---------------------------------------+---------------------------------------+
                                        | HTTP REST & WebSocket (Socket.IO)
+---------------------------------------v---------------------------------------+
|                           APPLICATION SERVER (Backend)                        |
|  Node.js v20+ • Express • TypeScript • Socket.IO • Helmet • Rate-Limiting    |
|                                                                               |
|  +--------------------------------------------------------------------------+ |
|  | Routing & Middleware: JWT Auth, RBAC Role Guards, Zod Request Validators  | |
|  +--------------------------------------------------------------------------+ |
|  | Controllers: Auth, Food, Order, Payment, Analytics, Admin, Notification  | |
|  +--------------------------------------------------------------------------+ |
|  | Service Layer:                                                           | |
|  | - OrderService (Stock decrement, atomic transactions, status progression) | |
|  | - PaymentService (Mock/Stripe/Razorpay abstraction, signature verification)| |
|  | - MovingAverageService (N-Period SMA demand forecast, buffer batch sizing)| |
|  | - SalesAnalyticsService (Sales trends, food rankings, category shares)  | |
|  +--------------------------------------------------------------------------+ |
|  | Real-Time Hub: Socket.IO authenticated rooms (user:{id}, kitchen, admin) | |
+---------------------------------------+---------------------------------------+
                                        | Prisma ORM Client
+---------------------------------------v---------------------------------------+
|                              DATA TIER (Database)                             |
|  Local Execution: SQLite (dev.db) • Production Deployment: PostgreSQL        |
|                                                                               |
|  - Users (Students, Kitchen Staff, System Administrators)                     |
|  - FoodCategories & FoodItems (Menu items with pricing, dietary attributes)   |
|  - Orders & OrderItems (Purchased items with frozen historical unit prices)   |
|  - Payments (Transaction references, payment methods, gateway responses)     |
|  - OrderStatusHistory (Complete audit trail of every status transition)       |
|  - Notifications (In-app alerts for real-time customer feedback)             |
+-------------------------------------------------------------------------------+
```

---

## 2. Order State Machine & Lifecycle

CampusBite implements a strictly audited order lifecycle:

```
[Student Basket Checkout]
           |
           v
       (PLACED) ---------> [Payment Verified & Order Added to Kitchen Queue]
           |
           v (Chef clicks "Accept")
      (CONFIRMED) -------> [Kitchen confirms capacity & preparation slot]
           |
           v (Chef clicks "Start Cooking")
      (PREPARING) -------> [Food cooking in canteen kitchen]
           |
           v (Chef marks "Ready")
        (READY) ---------> [Alert pushed to Student: "Ready for Pickup at Counter 1"]
           |
           v (Handover confirmed)
      (COMPLETED) -------> [Order archived in historical ledger]
```

At each stage transition:
1. Database transaction updates order status.
2. An entry is appended to `OrderStatusHistory` recording actor, notes, and timestamp.
3. Socket.IO emits a message to the student's personal room (`user:{userId}`), instantly updating the UI stepper without manual refreshing.
4. An in-app `Notification` is stored and dispatched.

---

## 3. Security Architecture
- **Password Hashing**: Salted bcrypt hashing with 10 rounds.
- **Session Tokens**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 containing user ID, email, and role.
- **Role-Based Authorization (RBAC)**: Middleware intercepts requests to ensure only authorized roles (`STUDENT`, `KITCHEN_STAFF`, `ADMIN`) can access protected resources.
- **Input Sanitization**: Strict Zod schemas validate JSON payloads before controller execution.
- **Rate Limiting**: Protects backend APIs against brute-force attacks (500 requests/15-min window).
- **Payment Signature Protection**: Cryptographic HMAC signature checking ensures frontend cannot spoof fake payment authorizations.
