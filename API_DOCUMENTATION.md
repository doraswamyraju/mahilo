# MAHILO REST API Documentation
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api` (Development) / `https://mahilo.in/api` (Production)  
**Standard Authorization Header:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & Identity (`/api/auth`)

### `POST /api/auth/register`
Creates a new customer account, attaches default role `CUSTOMER`, and initializes an empty cart.
* **Request Body:**
  ```json
  {
    "fullName": "Radhika Verma",
    "phone": "9876543299",
    "email": "radhika@example.com",
    "password": "securePassword123"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Welcome to Mahilo! Account created successfully.",
    "data": {
      "user": {
        "id": "usr-a8b29c1d",
        "fullName": "Radhika Verma",
        "phone": "9876543299",
        "roles": ["CUSTOMER"]
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### `POST /api/auth/login`
Universal sign-in for Customer, Seller, and Administrator.
* **Request Body:**
  ```json
  {
    "identifier": "9876543211", // Mobile number or email address
    "password": "mahilo123"
  }
  ```
* **Success Response (200):** Returns assigned roles and seller onboarding status.

### `GET /api/auth/me`
* **Headers:** `Authorization: Bearer <TOKEN>`
* Returns the authenticated user session, assigned roles, and seller ID.

---

## 2. Seller Ecosystem (`/api/sellers`)

### `GET /api/sellers`
Returns all verified approved seller storefronts with their product and service counts.

### `GET /api/sellers/:slug`
Public storefront profile of an entrepreneur, including their bio, cover banner, products, and services.

### `POST /api/sellers/apply`
* **Authorization:** `Bearer <TOKEN>`
* Submits a seller onboarding application without creating duplicate user accounts.
* **Request Body:**
  ```json
  {
    "businessName": "Maya Handmade Terracotta",
    "businessType": "INDIVIDUAL_ARTISAN",
    "description": "Handcrafted clay kitchenware fired in natural kilns.",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "bankAccountNumber": "918273645012",
    "bankIfscCode": "HDFC0001234",
    "bankAccountName": "Maya Patel"
  }
  ```

---

## 3. Product Marketplace (`/api/products`)

### `GET /api/products`
* **Query Parameters:**
  * `category` (string, slug or category ID)
  * `search` (string, keyword query)
  * `minPrice` & `maxPrice` (numeric filter)
  * `inStock` (`true` / `false`)
  * `sellerId` (filter by artisan)

### `GET /api/products/:slug`
Returns full product detail with gallery, seller profile, and customer reviews.

### `POST /api/products`
* **Authorization:** `Bearer <TOKEN>` (Requires approved `SELLER` role)
* Lists a new physical product in the seller's storefront.

### `PUT /api/products/:id` & `DELETE /api/products/:id`
Allows seller to edit price, stock quantity, images, or remove their own listing.

---

## 4. Service Marketplace & Slots Engine (`/api/services`)

### `GET /api/services`
Browse bookable services with filters: `category`, `deliveryMode` (`AT_CLIENT_LOCATION`, `AT_SELLER_STUDIO`, `ONLINE`), `maxPrice`, `search`.

### `GET /api/services/:id/available-slots?date=YYYY-MM-DD`
* Real-time slot reservation calculator.
* Computes available appointment time intervals based on the provider's recurring day schedule, duration, buffer times, and already reserved bookings.
* **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "date": "2026-03-02",
      "dayOfWeek": 1,
      "isOperatingDay": true,
      "durationMinutes": 60,
      "slots": [
        { "startTime": "09:00", "endTime": "10:00", "isAvailable": true },
        { "startTime": "10:30", "endTime": "11:30", "isAvailable": false }
      ]
    }
  }
  ```

### `POST /api/services`
* **Authorization:** `Bearer <TOKEN>` (Approved `SELLER`)
* Creates a new service offering with duration, pricing, and home vs. salon options.

---

## 5. Multi-Vendor Cart (`/api/cart`)

### `GET /api/cart`
Returns customer cart grouped seller-wise with sub-totals, delivery charges, and gross summary.

### `POST /api/cart/items`
Adds a product to cart or increments quantity.

### `PUT /api/cart/items/:productId` & `DELETE /api/cart/items/:productId`
Updates or removes a cart item.

---

## 6. Orders & Multi-Seller Splitting (`/api/orders`)

### `POST /api/orders/checkout`
* **Authorization:** `Bearer <TOKEN>`
* Converts unified multi-seller cart into **1 Parent Order** and **$N$ Seller-Specific Sub-Orders**.
* Calculates commissions, deducts inventory, and records double-entry ledger credits.

### `GET /api/orders/my-orders`
Customer retrieves full parent order history with shipping step tracking.

### `GET /api/orders/seller/my-orders`
* **Authorization:** `Bearer <TOKEN>` (Approved `SELLER`)
* Sellers access *only* sub-orders placed with their storefront.

### `PUT /api/orders/seller/:sellerOrderId/status`
Seller updates fulfillment status (`ACCEPTED`, `PROCESSING`, `READY_TO_SHIP`, `SHIPPED` with tracking number, `DELIVERED`).

---

## 7. Service Appointments & Bookings (`/api/bookings`)

### `POST /api/bookings`
* **Concurrency-Guarded Slot Reservation:** Prevents double-booking via transactional uniqueness checks.
* **Request Body:**
  ```json
  {
    "serviceId": "srv-1",
    "bookingDate": "2026-03-09",
    "startTime": "10:00",
    "endTime": "11:00",
    "serviceAddress": {
      "name": "Ananya Sharma",
      "phone": "9876543210",
      "addressLine1": "Flat 402, Lotus Orchid Apts",
      "city": "Mumbai",
      "pincode": "400053"
    },
    "specialNotes": "Please ring doorbell twice"
  }
  ```

### `GET /api/bookings/my-bookings` & `GET /api/bookings/seller/my-bookings`
Retrieve customer and provider appointment queues.

---

## 8. Financial Ledger & Settlements (`/api/ledger`)

### `GET /api/ledger/summary`
Calculates lifetime gross sales, platform commission deductions, available settlement balance, and order statistics.

### `GET /api/ledger/transactions`
Immutable double-entry transaction ledger with chronological running balances.

### `POST /api/ledger/seller/request-payout`
Sellers request bank disbursement of their accrued balance.

---

## 9. Payments & Razorpay Integration (`/api/payments`)

### `POST /api/payments/razorpay/create-order`
Creates Razorpay gateway order with amount in paise.

### `POST /api/payments/razorpay/verify`
Validates cryptographic HMAC-SHA256 signature and advances order/booking status to `PAID` or `CONFIRMED`.

---

## 10. Reviews & Ratings (`/api/reviews`)

### `POST /api/reviews`
Verified buyer rates product or service (1 to 5 stars) and leaves review text.

### `POST /api/reviews/:id/reply`
Artisan or service provider writes official response to review.

---

## 11. Admin & Moderation Operations (`/api/admin`)

* `GET /api/admin/analytics`: Gross Merchandise Value (GMV), platform fee revenue, seller counts.
* `GET /api/admin/sellers`: Review queue for pending seller applications.
* `PUT /api/admin/sellers/:sellerId/status`: Approve or reject seller applications.
* `PUT /api/admin/commissions/:ruleId`: Configure independent commission rates for products vs services.
* `PUT /api/admin/settlements/:settlementId`: Process bank payouts with UTR reference.
