# 💎 Finova — Production-Ready REST API Backend

A production-quality Node.js, Express.js & MongoDB backend engine for the **Finova** fintech investment dashboard and earnings platform.

---

## 🌟 Key Architecture & Features

- **Ledger-Based Financial Wallet**: Immutable transaction records for all credits, debits, holds, and payout releases. Balance mutations occur strictly via trusted backend services (`WalletService`).
- **Server-Computed Investment Terms**: Investment terms, daily return rates, and duration days are computed 100% server-side from MongoDB database records. Client inputs cannot alter returns or rates.
- **Idempotent Daily Earnings Engine**: Scheduled cron job with compound unique index constraint (`user + investment + earningDate`) preventing duplicate daily return credits even on job retries or crashes.
- **10% Referral Commission System**: Automated 10% direct referral reward credited upon eligible plan activation by team members. Self-referral prevention and team metrics tracking.
- **Payment Provider Abstraction**: Payment gateway order creation, callback, and webhook signature verification (`PaymentService`). Does not trust frontend payment success claims.
- **Withdrawal Hold & Payout Engine**: Instant IMPS payout requesting system with wallet balance hold, verification check, and admin approval/rejection release workflow.
- **Role-Based Access Control (RBAC)**: Dedicated admin routes (`/api/admin/*`) protected by JWT authentication and admin role authorization middleware. Audit logs (`AuditLog`) track sensitive admin actions.
- **Security Suite**: Helmet security headers, CORS origin whitelist, Zod schema request validation, strict rate limiting, bcrypt password hashing, HTTP-only secure cookies with refresh token rotation.
- **Swagger Documentation**: Interactive OpenAPI 3.0 documentation served at `/api/docs`.

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection & shutdown handling
│   │   ├── env.js            # Environment configuration parser
│   │   ├── payment.js        # Payment gateway config
│   │   └── swagger.js        # Swagger OpenAPI spec
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── plan.controller.js
│   │   ├── investment.controller.js
│   │   ├── earning.controller.js
│   │   ├── referral.controller.js
│   │   ├── transaction.controller.js
│   │   ├── payment.controller.js
│   │   ├── withdrawal.controller.js
│   │   ├── bank.controller.js
│   │   └── admin.controller.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── InvestmentPlan.js
│   │   ├── Investment.js
│   │   ├── Earning.js        # Idempotency compound index
│   │   ├── Referral.js
│   │   ├── Transaction.js    # Immutable financial ledger
│   │   ├── Payment.js
│   │   ├── Withdrawal.js
│   │   ├── BankAccount.js    # Masked & encrypted bank data
│   │   └── AuditLog.js       # Administrative audit trail
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── plan.routes.js
│   │   ├── investment.routes.js
│   │   ├── earning.routes.js
│   │   ├── referral.routes.js
│   │   ├── transaction.routes.js
│   │   ├── payment.routes.js
│   │   ├── withdrawal.routes.js
│   │   ├── bank.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.js           # JWT protection middleware
│   │   ├── admin.js          # Admin RBAC middleware
│   │   ├── validate.js       # Zod schema validation
│   │   ├── errorHandler.js   # Centralized error handler
│   │   ├── rateLimiter.js    # IP rate limiting
│   │   └── requestId.js      # Request ID tracing
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── investment.service.js
│   │   ├── earning.service.js
│   │   ├── referral.service.js
│   │   ├── payment.service.js
│   │   ├── withdrawal.service.js
│   │   └── wallet.service.js # Balance & ledger manager
│   │
│   ├── jobs/
│   │   └── dailyEarnings.job.js # Idempotent cron engine
│   │
│   ├── utils/
│   │   ├── apiResponse.js    # Standard JSON format
│   │   ├── generateToken.js  # JWT & HTTP-only cookies
│   │   ├── generateReferralCode.js
│   │   ├── transactionId.js
│   │   └── seed.js           # Database seed script
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── auth.test.js
├── .env.example
├── package.json
└── README.md
```

---

## 🛠 Quick Start & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure MongoDB is running locally (`mongodb://localhost:27017/finova`) or provide a MongoDB Atlas connection URI.

### 3. Seed Demo Data
Populate the database with default investment plans, demo user, and admin account:
```bash
npm run seed
```

**Seed Credentials**:
- **Demo User**: `rajan@example.com` / `password123`
- **Admin User**: `admin@finova.app` / `admin123`

### 4. Run Development Server
```bash
npm run dev
```

The server will start at **`http://localhost:5000`**.  
Interactive Swagger API docs available at **`http://localhost:5000/api/docs`**.

---

## 📑 API Reference Summary

| Category | Endpoint | Method | Description |
|---|---|---|---|
| **Auth** | `/api/auth/register` | `POST` | Register new investor account |
| | `/api/auth/login` | `POST` | Authenticate & set HTTP-only cookie |
| | `/api/auth/refresh` | `POST` | Rotate refresh token & issue access token |
| | `/api/auth/logout` | `POST` | Clear cookie session |
| | `/api/auth/me` | `GET` | Get current user profile |
| **Dashboard** | `/api/dashboard` | `GET` | Get aggregated portfolio balance & metrics |
| | `/api/dashboard/performance` | `GET` | Get performance chart data (`1D`, `1W`, `1M`, `3M`, `1Y`) |
| **Plans** | `/api/plans` | `GET` | Get active investment plans |
| **Investments** | `/api/investments` | `POST` | Activate plan (`{ planId }`) |
| | `/api/investments` | `GET` | List active & past investments |
| **Earnings** | `/api/earnings` | `GET` | List daily credited returns |
| | `/api/earnings/summary` | `GET` | Summary of today, total, and referral earnings |
| **Referrals** | `/api/referrals/stats` | `GET` | Direct team count, active/inactive ratio & earnings |
| | `/api/referrals/history` | `GET` | Referral reward payouts log |
| **Transactions** | `/api/transactions` | `GET` | Immutable financial ledger |
| **Payments** | `/api/payments/create-order` | `POST` | Create deposit order |
| | `/api/payments/verify` | `POST` | Verify payment signature & credit wallet |
| | `/api/payments/webhook` | `POST` | Provider webhook endpoint |
| **Withdrawals** | `/api/withdrawals` | `POST` | Request withdrawal to linked bank |
| | `/api/withdrawals` | `GET` | View withdrawal history |
| **Bank Accounts**| `/api/bank-accounts` | `GET` | List linked accounts (masked numbers) |
| | `/api/bank-accounts` | `POST` | Link new bank account |
| **Admin** | `/api/admin/dashboard` | `GET` | System-wide statistics |
| | `/api/admin/users` | `GET` | Search & manage users |
| | `/api/admin/withdrawals` | `GET` | List pending withdrawal requests |
| | `/api/admin/withdrawals/:id/status` | `PATCH` | Approve/Reject withdrawal request |

---

## 🧪 Running Tests
```bash
npm run test
```

---

## 🛡 Security & Financial Integrity
1. **Zero Client-Controlled Calculations**: Financial returns, referral bonuses, and investment terms are calculated exclusively by server services.
2. **MongoDB Idempotency Index**: Unique compound index `{ user: 1, investment: 1, earningDate: 1 }` prevents double daily return credits.
3. **Ledger Integrity**: Every balance modification generates an immutable `Transaction` record with a unique `TXN-YYYYMMDD-XXXXXX` identifier.
