# 🧲 Magnetic Apparels — Full-Stack Architecture

> **E-Commerce Platform** for Dresses, Shoes, Watches & Wallets  
> Inspired by Meesho · Built with Node.js · MongoDB · Angular · React · Vue

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MAGNETIC APPARELS                            │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │     VUE      │    │    REACT     │    │       ANGULAR        │  │
│  │  Port: 5173  │    │  Port: 3000  │    │      Port: 4200      │  │
│  │              │    │              │    │                      │  │
│  │ • Login      │ → │ • Dashboard  │ → │ • Shared Auth Mgmt   │  │
│  │ • Register   │    │ • Products   │    │ • Route Guards       │  │
│  │ • Cart       │    │ • Search     │    │ • JWT Interceptor    │  │
│  │ • Payment    │    │ • Filters    │    │ • Shared Services    │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────────────────┘  │
│         │                  │                                        │
│         └──────────┬───────┘                                        │
│                    ▼                                                 │
│          ┌──────────────────┐                                        │
│          │   NODE.JS API    │ Port: 5000                             │
│          │                  │                                        │
│          │ Auth · Products  │                                        │
│          │ Cart · Orders    │                                        │
│          └────────┬─────────┘                                        │
│                   ▼                                                  │
│          ┌──────────────────┐    ┌──────────────────┐               │
│          │    MONGODB       │    │  FakeStore API   │               │
│          │   (Primary DB)   │    │ (Third-party API) │              │
│          └──────────────────┘    └──────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
magnetic-apparels/
│
├── logo.svg                          ← Brand logo
│
├── magnetic-apparels-node/           ← Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── server.js                 ← Entry point
│   │   ├── config/
│   │   │   └── logger.js             ← Winston logger
│   │   ├── models/
│   │   │   ├── User.js               ← User schema (bcrypt, validation)
│   │   │   └── Order.js              ← Order schema
│   │   ├── controllers/
│   │   │   ├── authController.js     ← Register, Login, Me, Add Address
│   │   │   ├── productController.js  ← FakeStore API proxy + enrichment
│   │   │   ├── cartController.js     ← In-memory cart (Redis-ready)
│   │   │   └── orderController.js    ← Place & get orders
│   │   ├── middleware/
│   │   │   └── auth.js               ← JWT authenticate + authorize
│   │   ├── routes/
│   │   │   ├── authRoutes.js         ← /api/auth/*
│   │   │   ├── productRoutes.js      ← /api/products/*
│   │   │   ├── cartRoutes.js         ← /api/cart/*
│   │   │   └── orderRoutes.js        ← /api/orders/*
│   │   └── tests/
│   │       └── auth.test.js          ← Supertest API tests
│   ├── .env.example
│   └── package.json
│
├── magnetic-apparels-vue/            ← Login, Register, Cart, Payment (Vue 3 + Pinia)
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── router/index.js           ← Vue Router with auth guards
│   │   ├── store/
│   │   │   ├── authStore.js          ← Pinia auth store
│   │   │   └── cartStore.js          ← Pinia cart store
│   │   ├── views/
│   │   │   ├── LoginView.vue         ← Login form + validation
│   │   │   ├── RegisterView.vue      ← Register + password strength
│   │   │   ├── CartView.vue          ← Cart + address form
│   │   │   └── PaymentView.vue       ← UPI, Card, Net Banking, COD
│   │   └── tests/
│   │       └── LoginView.test.js     ← Vitest component tests
│   └── package.json
│
├── magnetic-apparels-react/          ← Products Dashboard (React 18)
│   ├── src/
│   │   ├── App.js                    ← Protected route wrapper
│   │   ├── services/api.js           ← Axios + interceptors
│   │   ├── hooks/useProducts.js      ← Data fetching + filter hook
│   │   ├── components/
│   │   │   ├── ProductCard.jsx       ← Product card with size picker
│   │   │   └── ProductCard.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         ← Main dashboard
│   │   │   └── Dashboard.css
│   │   └── tests/
│   │       └── ProductCard.test.js   ← RTL component tests
│   └── package.json
│
└── magnetic-apparels-angular/        ← Shared Auth Layer (Angular 16)
    ├── src/app/
    │   ├── services/
    │   │   ├── auth.service.ts       ← BehaviorSubject + HTTP auth
    │   │   └── jwt.interceptor.ts    ← Auto-attach + 401 handling
    │   ├── guards/
    │   │   └── auth.guard.ts         ← AuthGuard + GuestGuard
    │   └── tests/
    │       └── auth.service.spec.ts  ← Jasmine/Karma unit tests
    └── package.json
```

---

## 🔄 User Flow

```
User lands at Vue (Port 5173)
       │
       ├── Has account? ──YES──→ Login (Vue) ──────────────────────────┐
       │                                                               │
       └── No account? ──────→ Register (Vue) ─────────────────────────┤
                                                                       │
                                         JWT Token stored in localStorage
                                                                       │
                                                                       ▼
                                          React Dashboard (Port 3000)
                                          ┌──────────────────────────────┐
                                          │ Header: Search + Cart + User │
                                          │ Hero Banner                  │
                                          │ Sidebar: Categories + Sort   │
                                          │ Product Grid (FakeStore API) │
                                          │ • Dresses, Shoes, Watches,   │
                                          │   Wallets                    │
                                          │ • Add to Cart → Node API     │
                                          └──────────────┬───────────────┘
                                                         │
                                                "Go to Cart" button
                                                         │
                                                         ▼
                                          Vue Cart Page (Port 5173/cart)
                                          ┌──────────────────────────────┐
                                          │ Cart Items List              │
                                          │ Quantity Controls            │
                                          │ Delivery Address Form        │
                                          │ Order Summary + Pricing      │
                                          └──────────────┬───────────────┘
                                                         │
                                              "Proceed to Payment"
                                                         │
                                                         ▼
                                          Vue Payment Page (Port 5173/payment)
                                          ┌──────────────────────────────┐
                                          │ UPI | Card | Net Banking | COD│
                                          │ Order Summary                │
                                          │ POST /api/orders             │
                                          │ → Order Success Screen       │
                                          └──────────────────────────────┘
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get JWT |
| GET | `/api/auth/me` | ✅ | Get logged-in user |
| POST | `/api/auth/address` | ✅ | Add delivery address |
| GET | `/api/products` | ✅ | Get all products (with filter/sort/page) |
| GET | `/api/products/:id` | ✅ | Get single product |
| GET | `/api/products/categories` | ✅ | Get categories |
| GET | `/api/cart` | ✅ | Get cart |
| POST | `/api/cart` | ✅ | Add to cart |
| PUT | `/api/cart/:productId` | ✅ | Update cart item |
| DELETE | `/api/cart/:productId` | ✅ | Remove from cart |
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders` | ✅ | Get my orders |
| GET | `/api/orders/:id` | ✅ | Get order by ID |

**Query params for GET /api/products:**
- `category`: dresses | shoes | watches | wallets
- `sort`: price_asc | price_desc | rating
- `page`: number (default 1)
- `limit`: number (default 12)

**Third-Party API Used:** [FakeStore API](https://fakestoreapi.com) — mapped to app categories:
- `dresses` → women's clothing
- `shoes` → men's clothing
- `watches` → jewelery
- `wallets` → electronics

---

## 🛡 Security Architecture

### 1. Authentication & Authorization
- **JWT tokens** with 7-day expiry stored in `localStorage`
- Passwords hashed with **bcrypt (cost factor: 12)**
- Separate `authLimiter` for login/register — **10 req / 15 min**
- Generic error messages for login failures (no user enumeration)
- Token verified on every protected request via middleware
- Role-based access via `authorize(...roles)` middleware

### 2. HTTP Security (Helmet.js)
Helmet sets all critical security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-XSS-Protection`

### 3. Input Validation
- Server-side: **express-validator** on all input fields
- Client-side: Vue reactive validators + Angular Reactive Forms
- Email normalization (lowercase, trim)
- Password strength: uppercase + lowercase + digit required

### 4. CORS
- Whitelist-only origins via `ALLOWED_ORIGINS` env variable
- Credentials enabled only for trusted origins

### 5. Rate Limiting
- **100 req/15 min** on all API routes
- **10 req/15 min** on auth routes (prevents brute force)

### 6. What to Add in Production
| Concern | Solution |
|---------|----------|
| HTTPS | Nginx + Let's Encrypt / AWS ACM |
| Token Refresh | Implement refresh token rotation |
| Cart Storage | Replace in-memory cart with Redis |
| Payment | Integrate Razorpay / Stripe (replace mock) |
| Secrets | Use AWS Secrets Manager / Vault |
| Session Hijacking | Add `httpOnly` cookies for refresh token |
| SQL/NoSQL Injection | Mongoose sanitizes; add `express-mongo-sanitize` |
| XSS | Use `xss-clean` middleware |
| DDoS | AWS WAF / Cloudflare |
| Audit Logging | Log all sensitive actions with IP + user ID |

---

## 🧪 Testing Strategy

### Backend (Node.js) — Supertest + Jest
```bash
cd magnetic-apparels-node && npm test
```
Tests cover: register, login, duplicate email, weak password, invalid token, auth protection.

### Frontend (Vue) — Vitest + Vue Test Utils
```bash
cd magnetic-apparels-vue && npm test
```
Tests cover: LoginView rendering, validation errors, register form, password strength.

### Frontend (React) — React Testing Library + Jest
```bash
cd magnetic-apparels-react && npm test
```
Tests cover: ProductCard renders, add to cart, size selection, badge visibility.

### Angular — Jasmine + Karma
```bash
cd magnetic-apparels-angular && npm test
```
Tests cover: AuthService login, register, logout, isLoggedIn state, HTTP mocking.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or MongoDB Atlas URI
- npm >= 9

### 1. Backend
```bash
cd magnetic-apparels-node
cp .env.example .env    # Edit MONGODB_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:5000
```

### 2. Vue (Login / Register / Cart / Payment)
```bash
cd magnetic-apparels-vue
npm install
npm run dev             # http://localhost:5173
```

### 3. React (Dashboard)
```bash
cd magnetic-apparels-react
npm install
npm start               # http://localhost:3000
```

### 4. Angular (Shared Auth layer - optional standalone)
```bash
cd magnetic-apparels-angular
npm install
npm start               # http://localhost:4200
```

---

## 🌍 Environment Variables

### magnetic-apparels-node/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/magnetic-apparels
JWT_SECRET=<min_32_char_secret>
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:5173
```

### magnetic-apparels-vue/.env
```
VITE_API_URL=http://localhost:5000/api
```

### magnetic-apparels-react/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔮 Future Enhancements

- **Wishlist** feature
- **Product Reviews & Ratings** (user submitted)
- **Admin Panel** (Angular) — manage products, orders, users
- **Real Payment Gateway** — Razorpay / Stripe
- **Push Notifications** — order updates
- **PWA** — offline support
- **Elasticsearch** — advanced product search
- **Microservices** — split into Product, Order, Auth services
