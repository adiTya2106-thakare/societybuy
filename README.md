# SocietyBuy — Buy Together. Save Together.

A community-based bulk shopping and delivery platform for residential societies. Residents combine demand to unlock bulk prices from local suppliers, while every household gets their own order, invoice, and delivery.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm

### 1. Clone and install

```bash
cd societybuy
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at minimum:
- `DATABASE_URL` — your PostgreSQL connection string
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — your app URL (http://localhost:3000 for dev)

### 3. Set up database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed with development data
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🐳 Docker (Recommended for Local Dev)

```bash
docker-compose up -d
```

Then run migrations:
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

---

## 🔑 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Platform Admin | admin@societybuy.in | Admin@1234 |
| Merchant | merchant@greenfield.in | Merchant@1234 |
| Resident | resident1@example.com | Resident@1234 |

---

## 🗺️ Application Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | About SocietyBuy |
| `/how-it-works` | How community shopping works |
| `/bulk-deals` | Public deal listings |
| `/merchants` | Merchant partnership info |
| `/contact` | Contact & support |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/refund-policy` | Refund policy |

### Auth
| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/register` | New account registration |
| `/forgot-password` | Password recovery |
| `/reset-password` | Password reset |

### Resident App
| Route | Description |
|-------|-------------|
| `/app` | Personalized dashboard |
| `/app/shop` | Product marketplace |
| `/app/bulk-deals` | Community bulk deals |
| `/app/bulk-deals/[id]` | Deal details + commit |
| `/app/cart` | Shopping cart |
| `/app/checkout` | Checkout + payment |
| `/app/orders` | Order history |
| `/app/orders/[id]` | Order details |
| `/app/profile` | User profile |
| `/app/savings` | Savings history |
| `/app/addresses` | Address management |
| `/app/support` | Support tickets |

### Merchant Portal
| Route | Description |
|-------|-------------|
| `/merchant` | Merchant dashboard |
| `/merchant/products` | Product management |
| `/merchant/orders` | Order management |
| `/merchant/inventory` | Inventory management |
| `/merchant/settlements` | Settlement reports |

### Admin Portal
| Route | Description |
|-------|-------------|
| `/admin` | Platform overview |
| `/admin/users` | User management |
| `/admin/societies` | Society management |
| `/admin/merchants` | Merchant verification |
| `/admin/orders` | Order monitoring |
| `/admin/deals` | Deal management |
| `/admin/payments` | Payment reconciliation |
| `/admin/audit` | Audit logs |

### Other Portals
| Route | Description |
|-------|-------------|
| `/delivery` | Delivery partner portal |
| `/society-admin` | Society admin portal |

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — New user registration
- `POST /api/auth/[...nextauth]` — NextAuth handlers

### Products
- `GET /api/products` — List products (paginated, searchable)
- `GET /api/products/[id]` — Product details + active deals
- `GET /api/categories` — Product categories

### Cart
- `GET /api/cart` — Get current user's cart
- `POST /api/cart` — Add item to cart
- `PATCH /api/cart/items/[id]` — Update cart item quantity
- `DELETE /api/cart/items/[id]` — Remove cart item

### Bulk Deals
- `GET /api/deals` — List active deals
- `GET /api/deals/[id]` — Deal details
- `POST /api/deals/[id]` — Commit quantity to deal
- `DELETE /api/deals/[id]/commitments/[cid]` — Cancel commitment

### Orders
- `POST /api/orders` — Create order from cart
- `GET /api/orders` — User's order history
- `GET /api/orders/[id]` — Order details
- `POST /api/orders/[id]/cancel` — Cancel order

### Payments
- `POST /api/payments/checkout` — Create payment order
- `POST /api/payments/verify` — Verify payment (with idempotency)

### Societies
- `GET /api/societies` — List societies
- `POST /api/societies` — Create society (admin)
- `POST /api/societies/join` — Request membership

### Admin
- `GET /api/admin/analytics` — Platform analytics
- `GET /api/admin/users` — User management

---

## 💳 Payment Integration

In **development mode** (when `RAZORPAY_KEY_ID` is absent or `PAYMENT_DEV_MODE=true`):
- A clearly labeled dev payment simulator is shown at checkout
- Use **"Simulate Success"** or **"Simulate Failure"** buttons
- No real money is processed

In **production**:
1. Create a Razorpay account at razorpay.com
2. Get your Key ID and Key Secret
3. Set in environment: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
4. Set `PAYMENT_DEV_MODE=false`

---

## 🗄️ Database

### Schema Models (47 models)
Users, Societies, Merchants, Products, Inventory, Bulk Deals, Orders, Payments, Deliveries, and more.

### Migrations
```bash
npx prisma migrate dev --name <description>
npx prisma migrate deploy   # production
```

### Backup (PostgreSQL)
```bash
pg_dump -U postgres societybuy > backup_$(date +%Y%m%d).sql
psql -U postgres societybuy < backup_20240101.sql
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests (requires running app)
npm run test:e2e
```

---

## 🔒 Security Checklist

- [x] Server-side role-based access control (RBAC)
- [x] JWT sessions with configurable expiry
- [x] bcrypt password hashing (cost factor 12)
- [x] Server-side price recalculation — never trust client prices
- [x] Idempotency records for payment verification
- [x] Webhook signature verification
- [x] SQL injection prevention via Prisma ORM
- [x] Input validation with Zod on every endpoint
- [x] Protected routes redirecting unauthenticated users
- [x] Merchant/admin portals require role check on server
- [x] Order ownership verified before data exposure
- [x] Inventory reservations with transaction safety
- [x] Audit logging for privileged operations
- [ ] Rate limiting (configure with edge middleware)
- [ ] CSP headers (configure in next.config.ts)
- [ ] HTTPS (configure at hosting/reverse-proxy level)

---

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project on vercel.com
3. Set environment variables (from `.env.example`)
4. Deploy

After deployment:
```bash
npx prisma migrate deploy
npm run db:seed
```

### Required Environment Variables for Production

```
DATABASE_URL=          # PostgreSQL connection string
AUTH_SECRET=           # 32-byte random secret
NEXTAUTH_URL=          # Your production URL
NEXT_PUBLIC_APP_URL=   # Your production URL
RAZORPAY_KEY_ID=       # Razorpay Key ID
RAZORPAY_KEY_SECRET=   # Razorpay Key Secret
RAZORPAY_WEBHOOK_SECRET= # Razorpay webhook secret
PAYMENT_DEV_MODE=false
```

---

## 🏗️ Architecture

```
societybuy/
├── prisma/
│   ├── schema.prisma      # Complete DB schema (47 models)
│   └── seed.ts            # Development seed data
├── src/
│   ├── app/
│   │   ├── (public)/      # Public website pages
│   │   ├── (auth)/        # Login, register, password reset
│   │   ├── app/           # Resident application
│   │   ├── merchant/      # Merchant portal
│   │   ├── delivery/      # Delivery partner portal
│   │   ├── society-admin/ # Society admin portal
│   │   ├── admin/         # Platform admin portal
│   │   └── api/           # REST API endpoints
│   ├── components/
│   │   ├── ui/            # Reusable UI primitives
│   │   ├── layout/        # Navigation, sidebars
│   │   ├── deals/         # Deal-specific components
│   │   └── orders/        # Order-specific components
│   ├── lib/
│   │   ├── auth/          # NextAuth configuration
│   │   ├── db.ts          # Prisma singleton
│   │   ├── pricing.ts     # Server-side pricing engine
│   │   ├── utils.ts       # Shared utilities
│   │   ├── deals/         # Bulk deal engine
│   │   ├── payments/      # Payment abstraction
│   │   └── notifications.ts # Notification service
│   ├── tests/
│   │   └── unit/          # Vitest unit tests
│   └── types/             # TypeScript type extensions
├── e2e/                   # Playwright E2E tests
└── docker-compose.yml     # Local development stack
```

---

## 📋 Implementation Status

### Phase 1 — MVP (Implemented)
- [x] User registration and login (NextAuth v5 + bcrypt)
- [x] Society membership with approval flow
- [x] Product catalog with search and pagination
- [x] Shopping cart (persistent, server-side totals)
- [x] Individual checkout with address selection
- [x] Bulk deal engine (state machine, tier pricing, concurrency-safe)
- [x] Deal commitment and progress tracking
- [x] Order creation with inventory reservation
- [x] Payment integration (Razorpay + dev simulator)
- [x] Payment verification with idempotency
- [x] Order cancellation with inventory release
- [x] Merchant dashboard with orders and analytics
- [x] Delivery partner portal
- [x] Society admin portal
- [x] Platform admin dashboard
- [x] In-app notifications
- [x] Audit logging
- [x] Database migrations and seed data
- [x] Unit tests (pricing engine, utils)
- [x] E2E tests (auth flows, protected routes)
- [x] Docker Compose configuration
- [x] Deployment documentation

### Phase 2 — Planned
- [ ] Merchant quote competition
- [ ] Coupon engine
- [ ] Email notifications (Resend/SMTP)
- [ ] Invoice PDF generation
- [ ] Review system
- [ ] Support ticket system
- [ ] CSV product import
- [ ] Advanced analytics with Recharts

### Phase 3 — Future
- [ ] Multilingual support (Hindi, Marathi)
- [ ] PWA + push notifications
- [ ] Demand forecasting
- [ ] Delivery route optimization

---

## 🐞 Troubleshooting

**Prisma generate fails**
```bash
npx prisma generate
```

**Database connection fails**
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run `npx prisma db push` to create tables without migrations

**Auth errors**
- Ensure `AUTH_SECRET` is set and at least 32 characters
- Ensure `NEXTAUTH_URL` matches your running URL exactly

**Build fails on TypeScript errors**
```bash
npm run typecheck
```

---

*SocietyBuy — Built for Indian residential communities*
