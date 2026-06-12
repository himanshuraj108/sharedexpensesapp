# BUILD_PLAN.md — SplitWise Clone

## 1. Product Research

### How I Studied Splitwise
- Visited **splitwise.com** and reviewed the full landing page, feature list, and screenshots
- Analyzed the core UI screens from provided screenshots:
  - Expense detail (who paid, who owes what, spending by category)
  - Settle up screen (directional payment: avatar → avatar)
  - Add expense screen (split type shown below amount)
  - Friends list (total balance, per-friend balance: "owes you" / "you owe")
  - Group feed (date-grouped expenses, "you lent" / "you borrowed" indicators)

### What I Learned
- Splitwise is fundamentally a **debt tracker**, not a payment processor
- The core concept: someone pays a bill → others owe that person their share
- Balance = Σ(splits where person X is owed) - Σ(splits where person X owes) - Σ(payments made) + Σ(payments received)
- "Simplify debts" is a key feature — reduces N-person debt to minimal transactions (greedy algorithm)
- Chat is per-expense, not per-group or per-user
- Currency is single for MVP; multi-currency is a PRO feature

### Workflows Identified
1. **Register → Add Friends → Create Group → Add Expense → View Balance → Settle Up**
2. **Add Expense (group) → Choose split type → Save → View splits → Chat → Mark settled**
3. **Friend detail → See shared expenses + payments → Settle up balance**

### Product Assumptions
- Single currency (INR ₹) — matches Indian context
- No OAuth (email/password only for simplicity)
- No receipt upload (PRO feature in real Splitwise)
- No recurring expenses (out of scope)
- No push notifications
- Real-time chat via polling (3s) instead of WebSocket for deployment simplicity

---

## 2. Architecture

### Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Backend | Django REST Framework | Assignment explicitly asked for Django REST APIs |
| Frontend | React + Vite | Assignment explicitly asked for React |
| Database | SQLite (local) / Supabase PostgreSQL (prod) | Relational DB required; Supabase = free tier |
| Auth | JWT via SimpleJWT | Stateless, no session overhead |
| Chat real-time | 3s polling (prod: Supabase Realtime) | Polling works reliably without WebSocket infra |
| Backend hosting | Render.com | 100% free, no credit card |
| Frontend hosting | Vercel | 100% free, zero-config React |

### Database Schema

```
users (id UUID PK, email UNIQUE, name, avatar_color, password_hash)
  │
  ├── friendships (id, requester_id→users, addressee_id→users, status)
  │
  ├── groups (id UUID PK, name, description, group_type, created_by→users)
  │     └── group_members (id, group_id→groups, user_id→users, role)
  │
  ├── expenses (id UUID PK, group_id→groups NULL, description, total_amount,
  │            currency, paid_by→users, split_type, category, date, notes,
  │            created_by→users)
  │     ├── expense_splits (id, expense_id, user_id, amount_owed,
  │     │                   share_value, percentage)
  │     └── messages (id UUID PK, expense_id, user_id, content, created_at)
  │
  └── payments (id UUID PK, payer_id→users, payee_id→users, amount,
                group_id→groups NULL, note, date, created_by→users)
```

### Split Calculation Logic

- **Equal**: `amount / n` per person, remainder added to first person
- **Unequal**: User specifies exact amounts; validated that sum = total (±₹0.02)
- **Percentage**: `(total × pct%) / 100` per person; percentages must sum to 100% (±0.5%)
- **Shares**: `(total × shares_i) / total_shares` per person; auto-normalized

### Balance Calculation

```
net_balance(A, B) = 
  Σ(splits where A is in expense paid by B) [A owes B]
  - Σ(splits where B is in expense paid by A) [B owes A]  
  - Σ(payments A→B)
  + Σ(payments B→A)
```

If positive → B owes A. If negative → A owes B.

### Debt Simplification (Greedy Algorithm)
1. Compute net balance for every group member
2. Split into creditors (positive) and debtors (negative)
3. Greedily match largest debtor to largest creditor
4. Result: minimum number of transactions to clear all debts

### API Design
- RESTful endpoints under `/api/`
- JWT Bearer token authentication
- All UUIDs as primary keys
- 403 for auth failures, 400 for validation errors
- Filtering via query params (`?group_id=`, `?friend_id=`)

### Frontend Architecture

```
App.jsx (Router)
├── PublicRoute → Landing, Login, Register
└── PrivateRoute → Layout (Sidebar + Outlet)
    ├── /dashboard      → Dashboard.jsx
    ├── /friends        → Friends.jsx
    ├── /friends/:id    → FriendDetail.jsx
    ├── /groups         → Groups.jsx
    ├── /groups/:id     → GroupDetail.jsx
    ├── /expenses/:id   → ExpenseDetail.jsx
    └── /profile        → Profile.jsx

Contexts: AuthContext (user, login, logout, register)
API: api.js (Axios instance with JWT interceptors + auto-refresh)
Components: Layout, AddExpenseModal, SettleUpModal, CreateGroupModal
```

### Deployment Approach
- Backend: `gunicorn config.wsgi:application` on Render
- Frontend: Static build (`npm run build`) deployed to Vercel
- DB: Supabase free tier PostgreSQL
- Env vars managed per platform

---

## 3. AI Collaboration Process

### How I Instructed the AI
- Used the required initial prompt from the assignment to kick off the process
- Directed the AI to act as a junior engineer: ask questions first, don't assume
- Required the AI to maintain `AI_CONTEXT.md` as a living document

### Questions the AI Asked
Before building, the AI asked about:
- Currency preference → INR ₹
- Google OAuth → Skip (email+password only)
- Profile photos → Avatar initials with color picker
- Deployment platform → Render + Vercel + Supabase (all free)
- Split types needed → All 4 (equal, unequal, percentage, shares)

### How the Plan Evolved
1. Started with Supabase MCP (couldn't authenticate automatically)
2. Pivoted: built all code first, Supabase setup done manually
3. Used SQLite for local development to allow immediate testing
4. Added Vite proxy to simplify frontend↔backend CORS in dev

### How AI_CONTEXT.md Was Maintained
The AI updated `AI_CONTEXT.md` at every major decision point:
- Tech stack finalized
- DB schema designed
- API endpoints defined
- Frontend routes planned
- Each app built (users, groups, expenses, balances, payments, chat)

---

## 4. Tradeoffs

| What | Decision | Reason |
|---|---|---|
| Currency | Single (INR) | Multi-currency is PRO feature, adds complexity |
| Auth | Email+password only | Google OAuth needs credentials + OAuth app setup |
| Profile photos | Color + initials | No file storage infra needed |
| Real-time chat | 3s polling | WebSocket needs Django Channels (extra infra) |
| Recurring expenses | Out of scope | Not in minimum requirements |
| Receipt scanning | Out of scope | PRO feature |
| Offline mode | Out of scope | Needs service workers + sync logic |
| Debt simplification | Greedy (not optimal) | Greedy is O(n log n), sufficient for group sizes |
| Balance storage | Computed on-read | No stale data risk; acceptable perf at this scale |

### What I Would Improve With More Time
1. **WebSocket real-time chat** instead of polling (Django Channels + Redis)
2. **Email notifications** when added to a group or expense
3. **Expense categories chart** (spending by category over time)
4. **Multi-currency support** with exchange rate API
5. **Mobile-responsive sidebar** (hamburger menu)
6. **Export to CSV** for expense history
7. **Unit test coverage** for balance calculation edge cases
