# 🚀 Finova - Premium Fintech Investment & Earnings Platform

**Finova** is a full-stack, enterprise-grade investment and earnings platform designed for modern financial management. Built with a high-performance **React + Vite** frontend and a robust **Node.js, Express & MongoDB** backend, Finova delivers a seamless user experience with real-time portfolio tracking, automated daily ROI calculations, and secure wallet management.

---

## 🌟 Key Features

- **🔐 Secure Authentication & Session Persistence**: JWT-based authentication with HTTP-only cookies, password hashing with `bcrypt`, and persistent user sessions across page reloads.
- **📈 Investment Plans**: Multiple tier investment plans with configurable daily yields, durations, and minimum/maximum deposit limits.
- **⚡ Automated Daily Yield Engine**: Automated cron job calculating and distributing daily investment returns with compound unique index idempotency.
- **💼 Wallet & Transaction Management**: Comprehensive transaction history for deposits, withdrawals, investment returns, and referral earnings.
- **👥 Referral Program**: Multi-tier referral tracking system awarding commissions on signups and active plan subscriptions.
- **🏦 Bank Account Linking**: Secure KYC-verified bank account linking for seamless fund withdrawals.
- **🎨 Glassmorphism Financial UI**: Premium dark fintech theme designed with dynamic time-based greetings ("Good morning/afternoon/evening"), responsive desktop sidebar, mobile navigation, and interactive charts (`Recharts`).
- **📚 Interactive Swagger API Docs**: Auto-generated REST API documentation accessible at `/api/docs`.

---

## 📁 Repository Structure

```text
Finova/
├── backend/                  # REST API Engine (Node.js, Express, MongoDB)
│   ├── src/
│   │   ├── config/           # Database, Env, Swagger, isolated payment configs
│   │   ├── controllers/      # Request handlers for Auth, User, Plans, Investments, etc.
│   │   ├── jobs/             # Scheduled Cron Jobs (Daily Yield Engine)
│   │   ├── middleware/       # Auth guard, validation, rate limiting, error handling
│   │   ├── models/           # Mongoose Data Models (User, Investment, Transaction, etc.)
│   │   ├── routes/           # Express REST API Endpoints
│   │   ├── services/         # Business Logic & Wallet Engine
│   │   ├── utils/            # Helper functions, logger, API response wrappers
│   │   ├── app.js            # Express application setup
│   │   └── server.js         # HTTP Server Entry Point
│   ├── tests/                # Integration & Unit Tests (Vitest)
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── frontend/                 # Client Web Application (React, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/       # UI Components, Modals, Header, Navigation
│   │   ├── context/          # AppContext state manager & Auth Provider
│   │   ├── data/             # Mock datasets & initial configurations
│   │   ├── pages/            # Application Views (Dashboard, Plans, Profile, Team, etc.)
│   │   ├── services/         # REST API Client (`api.js`)
│   │   ├── App.jsx           # Main Router & Application Root
│   │   └── main.jsx          # Vite Entry Point
│   └── package.json
│
├── .gitignore                # Root Git Ignore File
└── README.md                 # Project Documentation
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Dark Glassmorphism Theme)
- **Icons & Visuals**: Lucide React
- **Data Visualization**: Recharts
- **State Management**: React Context API + LocalStorage Sync

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT, Bcrypt, Helmet, CORS, Express Rate Limit
- **Validation**: Zod
- **Documentation**: Swagger OpenAPI 3.0 (`swagger-ui-express`)
- **Testing**: Vitest + Supertest

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Seed initial database plans & admin
npm run seed

# Start development server
npm run dev
```

The backend server will launch at `http://localhost:5000`.
- **Swagger Documentation**: `http://localhost:5000/api/docs`
- **Health Check**: `http://localhost:5000/health`

---

### 2. Frontend Setup

```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will launch at `http://localhost:5173`.

---

## 🔑 Key API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/plans` | Fetch available investment plans |
| `POST` | `/api/investments` | Activate an investment plan |
| `GET` | `/api/investments/my` | View active user investments |
| `GET` | `/api/transactions/my` | Fetch user deposit & withdrawal history |
| `POST` | `/api/withdrawals/request` | Submit withdrawal request |
| `GET` | `/api/bank-accounts` | View user linked bank accounts |
| `POST` | `/api/bank-accounts` | Link a new bank account |

---

## 🧪 Running Tests

To run the backend integration and unit test suite:

```bash
cd backend
npm run test
```

---

## 📜 License

This project is licensed under the MIT License.
