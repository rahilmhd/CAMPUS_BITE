# CampusBite — Database Design & Schema Documentation

The database is designed with full 3NF normalization, foreign key referential integrity, and historical transaction preservation.

---

## 1. Entity-Relationship (ER) Overview

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ORDER_STATUS_HISTORY : "updates"
    FOOD_CATEGORY ||--|{ FOOD_ITEM : "contains"
    ORDER ||--|{ ORDER_ITEM : "includes"
    FOOD_ITEM ||--o{ ORDER_ITEM : "referenced in"
    ORDER ||--|| PAYMENT : "has"
    ORDER ||--o{ ORDER_STATUS_HISTORY : "tracks"
    ORDER ||--o{ NOTIFICATION : "triggers"

    USER {
        string id PK
        string name
        string email UK
        string phone
        string passwordHash
        string role
        string status
        datetime createdAt
    }

    FOOD_CATEGORY {
        string id PK
        string name UK
        string description
        boolean active
    }

    FOOD_ITEM {
        string id PK
        string categoryId FK
        string name
        string description
        float price
        string imageUrl
        string ingredients
        string dietaryType
        boolean available
        int stockQuantity
        int preparationTime
    }

    ORDER {
        string id PK
        string orderNumber UK
        string userId FK
        float totalAmount
        string status
        string paymentStatus
        datetime pickupTime
        datetime createdAt
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string foodItemId FK
        int quantity
        float unitPrice
        float subtotal
    }

    PAYMENT {
        string id PK
        string orderId FK
        string transactionReference UK
        float amount
        string method
        string status
        datetime paidAt
    }

    ORDER_STATUS_HISTORY {
        string id PK
        string orderId FK
        string status
        string changedBy FK
        string notes
        datetime timestamp
    }

    NOTIFICATION {
        string id PK
        string userId FK
        string orderId FK
        string type
        string title
        string message
        boolean read
        datetime createdAt
    }
```

---

## 2. Key Data Integrity Rules

1. **Frozen Historical Unit Prices**:
   - `ORDER_ITEM` explicitly stores `unitPrice` and `subtotal` as of the purchase instant.
   - If the canteen updates `Chicken Biriyani` price from ₹140 to ₹160 next month, historical sales and accounting reports remain 100% mathematically correct.

2. **Soft Deletion & Order History Protection**:
   - Deleting a food item that has existing historical orders does not delete the database row; it sets `available = false` to ensure foreign key cascades never destroy past transaction records.

3. **Atomic Financial Transactions**:
   - Order creation, order item lines, and initial payment creation execute inside a Prisma interactive transaction (`prisma.$transaction`), preventing orphaned order states.

4. **Multi-Database Support**:
   - **Local / Evaluation Mode**: SQLite file database (`backend/prisma/schema.prisma` -> `file:./dev.db`) requiring zero external daemons.
   - **Cloud Production Mode**: PostgreSQL (`backend/prisma/schema.postgresql.prisma`) ready for Render, Supabase, Neon, or Railway deployments with enum support.
