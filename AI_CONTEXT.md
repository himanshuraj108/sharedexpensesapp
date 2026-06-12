# AI_CONTEXT.md — SplitWise Clone

> **This file is the source of truth for the entire project.**
> Another developer or AI agent should be able to read this file and recreate the same application.

---

## Product Understanding

Splitwise is an expense-splitting application. Its core purpose:
> Someone pays a shared expense. The app tracks who owes how much and to whom, so you don't have to remember manually.

Key insight: Splitwise is a **debt tracker**, not a payment system. It records financial obligations and settlements, not actual money movement.

### Core Workflows
1. User pays a restaurant bill → creates expense → others split it
2. Over time → balances accumulate
3. Users "settle up" by recording cash/online payments
4. Balances reset to zero

---

## Product Scope (MVP)

### In Scope
- Email/password authentication (JWT)
- Friend management (add by email, remove)
- Group management (create, invite members, remove members, delete)
- Expense management:
  - Create with 4 split types: equal, unequal, percentage, shares
  - Delete expense
  - View expense detail with splits
- Chat per expense (REST polling, 3s interval)
- Balance calculation:
  - Per-friend balance
  - Per-group balance
  - Overall dashboard summary
- Debt simplification (greedy algorithm)
- Debt settlements (record payment)

### Out of Scope
- Google OAuth
- Multi-currency
- Receipt scanning
- Recurring expenses
- Email notifications
- Offline mode
- Mobile app

---

## Engineering Requirements

### Authentication
- JWT-based (djangorestframework-simplejwt)
- Access token: 7 days
- Refresh token: 30 days with rotation
- Frontend: stores tokens in localStorage
- Auto-refresh: Axios interceptor retries on 401

### Data Model

#### users
```
id: UUID (PK)
email: VARCHAR UNIQUE
name: VARCHAR(150)
avatar_color: VARCHAR(7) — hex color
password_hash: (Django AbstractBaseUser)
is_active: BOOLEAN
created_at: TIMESTAMP
```

#### friendships
```
id: UUID (PK)
requester_id: UUID → users
addressee_id: UUID → users
status: ENUM('pending', 'accepted') — all auto-accepted in MVP
created_at: TIMESTAMP
UNIQUE(requester, addressee)
```

#### groups
```
id: UUID (PK)
name: VARCHAR(200)
description: TEXT
group_type: ENUM('trip', 'home', 'couple', 'other')
created_by: UUID → users
created_at, updated_at: TIMESTAMP
```

#### group_members
```
id: UUID (PK)
group_id: UUID → groups
user_id: UUID → users
role: ENUM('admin', 'member')
joined_at: TIMESTAMP
UNIQUE(group_id, user_id)
```

#### expenses
```
id: UUID (PK)
group_id: UUID → groups (nullable — non-group expenses exist)
description: VARCHAR(300)
total_amount: DECIMAL(12, 2)
currency: VARCHAR(3) = 'INR'
paid_by: UUID → users
split_type: ENUM('equal', 'unequal', 'percentage', 'shares')
category: ENUM('food', 'transport', 'accommodation', 'entertainment', 
               'shopping', 'utilities', 'health', 'other')
date: DATE
notes: TEXT
created_by: UUID → users
created_at, updated_at: TIMESTAMP
```

#### expense_splits
```
id: UUID (PK)
expense_id: UUID → expenses
user_id: UUID → users
amount_owed: DECIMAL(12, 2)
share_value: DECIMAL(10, 2) (nullable — for 'shares' split type)
percentage: DECIMAL(5, 2) (nullable — for 'percentage' split type)
UNIQUE(expense_id, user_id)
```

#### payments
```
id: UUID (PK)
payer_id: UUID → users
payee_id: UUID → users
amount: DECIMAL(12, 2)
group_id: UUID → groups (nullable)
note: VARCHAR(300)
date: DATE
created_by: UUID → users
created_at: TIMESTAMP
```

#### messages
```
id: UUID (PK)
expense_id: UUID → expenses
user_id: UUID → users
content: TEXT
created_at: TIMESTAMP
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language (BE) | Python | 3.11 |
| Framework (BE) | Django | 4.2.11 |
| REST API | Django REST Framework | 3.15.1 |
| Auth | djangorestframework-simplejwt | 5.3.1 |
| CORS | django-cors-headers | 4.3.1 |
| DB Driver | psycopg2-binary | 2.9.9 |
| Static files | whitenoise | 6.6.0 |
| WSGI server | gunicorn | 21.2.0 |
| Language (FE) | JavaScript (JSX) | ES2022 |
| Framework (FE) | React | 18 |
| Build tool | Vite | 8 |
| HTTP client | Axios | latest |
| Router | react-router-dom | v6 |
| Toast | react-hot-toast | latest |
| Icons | lucide-react | latest |
| Date utils | date-fns | latest |
| DB (local) | SQLite | built-in |
| DB (prod) | PostgreSQL via Supabase | free tier |

---

## API Design

### Base URL: `/api/`
### Auth: `Authorization: Bearer <access_token>`

#### Auth Endpoints
```
POST /api/auth/register/
  Body: { name, email, password }
  Response: { id, name, email, avatar_color, initials }

POST /api/auth/login/
  Body: { email, password }
  Response: { access, refresh, user: { id, name, email, avatar_color } }

POST /api/auth/token/refresh/
  Body: { refresh }
  Response: { access }

GET /api/auth/me/
  Response: { id, name, email, avatar_color, initials, created_at }

PUT /api/auth/me/
  Body: { name?, avatar_color? }
  Response: updated user

GET /api/auth/search/?q=<query>
  Response: [users]
```

#### Friends
```
GET /api/friends/
  Response: [{ id, friend: {user}, status, created_at }]

POST /api/friends/add/
  Body: { email }
  Response: friendship object

DELETE /api/friends/<uuid:pk>/remove/
  Response: 204
```

#### Groups
```
GET /api/groups/
  Response: [groups with members]

POST /api/groups/
  Body: { name, description, group_type, member_emails: [] }
  Response: group object

GET /api/groups/<uuid:pk>/
  Response: group with members

PUT /api/groups/<uuid:pk>/
  Body: partial group fields
  Response: updated group

DELETE /api/groups/<uuid:pk>/
  Response: 204

POST /api/groups/<uuid:pk>/invite/
  Body: { email }
  Response: group_member object

DELETE /api/groups/<uuid:pk>/members/<uuid:user_id>/remove/
  Response: 204
```

#### Expenses
```
GET /api/expenses/?group_id=<uuid>&friend_id=<uuid>
  Response: [expenses with splits]

POST /api/expenses/
  Body: {
    group_id?, description, total_amount, paid_by_id,
    split_type, category, date, notes?,
    splits: [{ user_id, amount?, percentage?, shares? }]
  }
  Response: expense with splits

GET /api/expenses/<uuid:pk>/
  Response: expense with splits

DELETE /api/expenses/<uuid:pk>/
  Response: 204
```

#### Payments
```
GET /api/payments/?group_id=<uuid>&friend_id=<uuid>
  Response: [payments]

POST /api/payments/
  Body: { payee_id, amount, group_id?, note?, date }
  Response: payment object

DELETE /api/payments/<uuid:pk>/
  Response: 204
```

#### Balances
```
GET /api/balances/user/
  Response: {
    summary: [{ friend: {user}, net_balance, status }],
    total_owed_to_you, total_you_owe, net
  }

GET /api/balances/group/<uuid:group_id>/
  Response: {
    balances: [{ user, net_balance, status }],
    simplified_transactions: [{ from_user, to_user, amount }]
  }

GET /api/balances/friend/<uuid:friend_id>/
  Response: { friend: {user}, net_balance, status }
```

#### Chat
```
GET /api/chat/<uuid:expense_id>/messages/
  Response: [messages with user]

POST /api/chat/<uuid:expense_id>/messages/
  Body: { content }
  Response: message object
```

---

## Frontend Structure

### Pages
| Route | Component | Purpose |
|---|---|---|
| `/` | Landing.jsx | Marketing page with CTAs |
| `/login` | Login.jsx | Email + password login |
| `/register` | Register.jsx | Account creation |
| `/dashboard` | Dashboard.jsx | Balance summary + recent expenses |
| `/friends` | Friends.jsx | Friend list with balances |
| `/friends/:id` | FriendDetail.jsx | Shared expenses + settle up |
| `/groups` | Groups.jsx | Group grid with member avatars |
| `/groups/:id` | GroupDetail.jsx | 3 tabs: expenses, balances, members |
| `/expenses/:id` | ExpenseDetail.jsx | Splits + real-time chat |
| `/profile` | Profile.jsx | Edit name + avatar color |

### Key Components
| Component | Purpose |
|---|---|
| Layout.jsx | Sidebar + outlet for auth pages |
| AddExpenseModal.jsx | Full expense creation with 4 split types |
| SettleUpModal.jsx | Directional payment recording |
| CreateGroupModal.jsx | Group creation with multi-email invite |

### State Management
- **AuthContext**: user object, login/logout/register functions
- **Local state**: each page manages its own data with `useState` + `useEffect`
- No Redux/Zustand — simple enough for Context + local state

### API Layer
- Single Axios instance in `api.js`
- JWT attached via request interceptor
- Auto-refresh on 401 via response interceptor
- Named exports per domain: `authAPI`, `friendsAPI`, `groupsAPI`, etc.

---

## Balance Calculation Details

### Formula
```
net_balance(currentUser, friend) = 
  total_owed_to_current_user_by_friend
  - total_owed_by_current_user_to_friend
  - payments_current_user_made_to_friend
  + payments_friend_made_to_current_user
```

### Sign Convention
- **Positive net**: friend owes current user (green)
- **Negative net**: current user owes friend (red)
- **Near zero (< ₹0.01)**: settled up (gray)

### Debt Simplification Algorithm
```python
def simplify_debts(balances):
    # balances: {user_id: net_balance}
    # Separate into creditors (+) and debtors (-)
    # Sort both descending by absolute value
    # Greedily match: largest debtor pays largest creditor
    # If debtor's debt < creditor's credit → debtor fully pays, move to next debtor
    # If debtor's debt > creditor's credit → creditor fully paid, move to next creditor
    # Continue until all settled
```

---

## Deployment Plan

### Backend (Render.com)
1. Push code to GitHub
2. Create new Web Service on render.com
3. Connect GitHub repo, set Root Directory: `backend`
4. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
6. Environment variables:
   - `SECRET_KEY` = generate random 50-char string
   - `DEBUG` = False
   - `DATABASE_URL` = from Supabase project settings
   - `CORS_ALLOWED_ORIGINS` = https://your-frontend.vercel.app
   - `ALLOWED_HOSTS` = your-backend.onrender.com

### Frontend (Vercel)
1. Push code to GitHub
2. Import project on vercel.com
3. Root Directory: `frontend`
4. Framework: Vite (auto-detected)
5. Environment variables:
   - `VITE_API_URL` = https://your-backend.onrender.com/api

### Database (Supabase)
1. Create new project at supabase.com
2. Go to Settings → Database → Connection string (URI mode)
3. Copy the PostgreSQL URI
4. Set as `DATABASE_URL` in Render environment variables
5. Run `python manage.py migrate` after first deploy

---

## Testing Plan

### Manual Test Cases
1. Register new user → verify JWT returned
2. Login with same user → verify redirect to dashboard
3. Add friend by email → verify appears in friend list
4. Create group → verify creator is admin
5. Invite member to group → verify member appears
6. Add expense (equal split, 3 people) → verify each person gets total/3
7. Add expense (percentage split) → verify percentages sum to 100%
8. Add expense (shares split) → verify amounts proportional to shares
9. Add expense (unequal) → verify amounts sum to total
10. View group balances → verify debt simplification suggests minimum transactions
11. Settle up → verify balance updates
12. Post message on expense → verify appears in chat
13. Refresh page → verify JWT auto-refresh works
14. Delete expense → verify removed from list

---

## Known Limitations

1. **Chat is polling-based** (3s interval) — not true WebSocket real-time
2. **No email verification** — any email can register
3. **Balance computed on every request** — not cached (acceptable at small scale)
4. **No expense editing** — delete and re-create only
5. **No group chat** — only per-expense chat
6. **Single currency** — no currency conversion
7. **No pagination** — large datasets would need it
8. **No soft delete** — deleted expenses permanently removed

---

## Changes Made During Implementation

### Change 1: Dropped Supabase Realtime
- **Original plan**: Use Supabase Realtime WebSocket for live chat
- **Actual implementation**: 3-second polling interval
- **Reason**: Supabase MCP token couldn't be configured automatically; polling is simpler to deploy and reliable

### Change 2: SQLite for Local Dev
- **Original plan**: PostgreSQL everywhere
- **Actual**: SQLite locally, PostgreSQL on Render via Supabase
- **Reason**: Allows immediate local development without DB setup

### Change 3: Vite Proxy Instead of Direct CORS
- **Original plan**: Configure Django CORS to allow localhost:5173
- **Actual**: Vite proxy (`/api` → `http://localhost:8000`)
- **Reason**: Cleaner local dev, no CORS headers needed in dev

### Change 4: Avatar Colors Instead of Profile Photos
- **Original plan**: Profile photo upload
- **Actual**: Color picker with initials avatar
- **Reason**: No file storage infra needed; still visually distinctive

---

## Prompts Used

### Initial Prompt (as required by assignment)
```
You are a junior engineer helping me complete an internship assignment.
The assignment is to reverse engineer Splitwise, scope a realistic 3-day version,
and build a working deployed app.

Important instructions:
1. Do not assume product requirements.
2. Do not jump directly into implementation.
3. Ask me detailed questions about product scope, UX, workflows, edge cases, and
engineering decisions...
[full prompt as specified in assignment]
```

### Key Scoping Questions & Answers
- **Currency?** → INR (₹)
- **Google OAuth?** → No, email/password only
- **Profile photos?** → No, color avatars with initials
- **Real-time chat tech?** → Polling (3s), Supabase Realtime in production
- **Deployment platforms?** → Render + Vercel + Supabase (all 100% free)
- **Split types needed?** → All 4: equal, unequal, percentage, shares
- **Debt simplification?** → Yes, greedy algorithm

### Build Direction Prompts
- "Build the Django backend with all 6 apps: users, groups, expenses, payments, balances, chat"
- "Write the balance calculation logic as a standalone calculator module"
- "Build the React frontend with a dark-mode design system, teal/purple palette, Inter font"
- "The AddExpenseModal must show real-time preview of split amounts as user enters values"
- "Write BUILD_PLAN.md and AI_CONTEXT.md as deliverable documents"
