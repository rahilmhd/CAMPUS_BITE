# CampusBite — REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register Student
`POST /auth/register`
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@campusbite.local",
  "phone": "+91 9876500002",
  "password": "Student@123"
}
```

### Login
`POST /auth/login`
```json
{
  "email": "student@campusbite.local",
  "password": "Student@123"
}
```
*Response returns JWT token and sanitized user profile without password hashes.*

### Current Session
`GET /auth/me` (Header: `Authorization: Bearer <token>`)

---

## 2. Food & Menu Endpoints

### List Foods
`GET /foods`
Query Parameters:
- `search` (string)
- `categoryId` (UUID)
- `dietaryType` (VEGETARIAN, NON_VEGETARIAN, VEGAN, EGG)
- `availableOnly` (true/false)
- `sortBy` (popularity, price_asc, price_desc, name)

### Get Food by ID
`GET /foods/:id`

### Create Food (Admin)
`POST /foods` (Header: Admin Bearer Token)

### Update Food (Admin)
`PUT /foods/:id`

### Toggle Availability (Admin/Kitchen)
`PATCH /foods/:id/availability`
```json
{ "available": false }
```

---

## 3. Order Management Endpoints

### Create Order (Student)
`POST /orders` (Header: Student Bearer Token)
```json
{
  "items": [
    { "foodItemId": "UUID", "quantity": 2 }
  ],
  "pickupTime": "2026-09-16T17:30:00Z",
  "paymentMethod": "MOCK",
  "notes": "Less spicy please"
}
```

### List Orders
`GET /orders`
- For Students: Returns student's orders.
- For Kitchen / Admin: Returns all campus orders.

### Update Order Status (Kitchen / Admin)
`PATCH /orders/:id/status`
```json
{
  "status": "PREPARING",
  "notes": "Chef started cooking"
}
```

---

## 4. Digital Payment Endpoints

### Initiate Payment
`POST /payments/initiate`
```json
{
  "orderId": "UUID",
  "method": "MOCK"
}
```

### Verify Payment
`POST /payments/verify`
```json
{
  "orderId": "UUID",
  "transactionReference": "TXN_CB_12345",
  "signature": "HMAC_SHA256_TOKEN",
  "simulatedStatus": "SUCCESS"
}
```

---

## 5. Analytics & Demand Forecasting

### Overview KPIs
`GET /analytics/overview` (Header: Admin/Kitchen Bearer Token)

### Sales Trends
`GET /analytics/sales-trends?days=14`

### Food Popularity Rankings
`GET /analytics/popularity?limit=10`

### Simple Moving Average Demand Forecast
`GET /analytics/forecast/:foodItemId?window=7&history=30`

### Kitchen Preparation Recommendations
`GET /analytics/recommendations?window=7`

### Export CSV Report
`GET /analytics/reports/csv?range=30d`

### Export PDF Report
`GET /analytics/reports/pdf?range=30d`
