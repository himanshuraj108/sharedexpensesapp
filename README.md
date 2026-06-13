# FairShare — Shared Expenses App

FairShare is a production-ready, full-stack shared expenses application built to resolve messy room expenses, dynamic member timelines, multi-currency splits, and peer-to-peer settlements. It features an anomaly detection engine to audit spreadsheet files and flags inconsistencies like duplicates, currency mismatches, and membership out-of-bound dates.

---

## Core Features

### 1. Spreadsheet Ingestion & 12-Anomaly Audit Engine
An integrated CSV parser reads group transaction spreadsheets row-by-row and audits them against 12 distinct data problems:
* **Duplicate Rows**: Skip exact matches to prevent double-counting.
* **USD Currency Conversion**: Detects trip expenses spent in USD and converts them to INR dynamically using a historical rate.
* **Disguised Settlements**: Detects payments (e.g. "Rohan paid Aisha") and logs them as a payment/transfer rather than a shared cost.
* **Timeline Checks**: Dates are analyzed against dynamic group memberships so roommates aren't split into costs before joining or after moving out.
* **Fuzzy Typo Matching**: Automatically normalizes member names (e.g., `Ayesha` ➔ `Aisha`, `Rohn` ➔ `Rohan`).

### 2. Time-Aware Splits
Group memberships are date-bounded. When splitting a cost, the application dynamically filters the group members to only split among members active on the expense date. 

### 3. Aisha's View: Greedy Debt Simplification
An implementation of a greedy cash-flow matching algorithm that resolves all net balances into the minimum possible number of peer-to-peer bank transfers.

### 4. Rohan's View: Double-Entry Audit Logs
Provides full transparency. Users can click on any peer relationship to expand a detailed audit trail of all transactions (expenses, splits, and payments) that sum up to their net balance.

---

## Detailed Tech Stack

* **Backend**: Django 4.2 + Django REST Framework + SimpleJWT Token Authentication
* **Frontend**: React 18 + Vite + Recharts + Lucide Icons + Tailwind CSS + Vanilla CSS 
* **Database**: SQLite (Local development) / PostgreSQL (Production ready)

---

## Database Schema

We use a normalized relational schema for robust data integrity:
1. **User**: Credentials, details, and color accent preferences.
2. **Group**: Shared flat or trip entities.
3. **GroupMembership**: Date-bound timeline markers (`joined_at`, `left_at`) for each user.
4. **Expense**: Header details containing amount, currency, payer, and description.
5. **ExpenseSplit**: Junction table linking individual users to their precise share of an expense.
6. **Payment**: Direct peer-to-peer transfers or debt settlements.
7. **CSVImport**: Logs containing the history of uploaded CSV spreadsheets.
8. **CSVAnomaly**: Log of all detected spreadsheet anomalies, maintaining their review and approval state.

---

## Local Setup Instructions

### Prerequisites
* Python 3.11+
* Node.js 18+

### Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS / Linux:
   source .venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Seed database with active roommate memberships:
   ```bash
   python reset_db.py
   ```
6. Start the development server:
   ```bash
   python manage.py runserver 8000
   ```
   The backend API will run at `http://127.0.0.1:8000`.

### Frontend Setup (Vite + React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.

---

## Core API Endpoints

### Authentication
* `POST /api/auth/register/` - Register a new user account.
* `POST /api/auth/login/` - Obtain JWT access/refresh tokens.
* `POST /api/auth/token/refresh/` - Refresh JWT tokens.
* `GET /api/auth/me/` - Fetch details of the logged-in user.

### Groups & Memberships
* `GET, POST /api/groups/` - List user's groups or create a new group.
* `GET, PUT, DELETE /api/groups/<uuid>/` - Group detail and operations.
* `GET, POST /api/groups/<uuid>/memberships/` - List or add memberships to a group.

### Expenses & Payments
* `GET, POST /api/expenses/` - List active expenses or add a new expense.
* `GET, PUT, DELETE /api/expenses/<uuid>/` - Edit or soft-delete an expense.
* `GET, POST /api/payments/` - List and log payments/refunds.

### CSV Ingestion & Auditing
* `POST /api/imports/upload/` - Upload a CSV transaction spreadsheet to start an ingestion job.
* `POST /api/imports/anomalies/<uuid>/resolve/` - Approve or reject a detected CSV anomaly.
* `GET /api/imports/<uuid>/report/` - Fetch a detailed status report of a CSV import run.

### Balance Summary
* `GET /api/groups/<uuid>/balances/` - Returns individual net balances, simplified debt settlements, and detailed line-item breakdown audit lists.
