# ExpenseFlow – Full Stack Expense Management App

ExpenseFlow is a **Splitwise-inspired full-stack expense tracking application** that helps individuals and groups track expenses, split bills, settle balances, analyze spending, and communicate in real time.

Built with a **modern frontend + secure backend architecture**, focused on correctness, UX polish, and production-grade patterns.

---

## What the App Does (User Perspective)

- Learn about the product on a public landing page
- Sign up / log in securely
- Track personal expenses
- Create groups and split expenses
- See who owes whom (always zero-sum correct)
- Settle balances safely
- View spending analytics
- Chat with group members in real time
- Use the app seamlessly on mobile, tablet, and desktop

---

## Key Features

### Authentication & Security

- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes (frontend + backend)
- Stateless logout
- Auth persistence with **no UI flicker**
- Clean landing → login → dashboard flow

---

### Personal Expenses

- Add and manage expenses
- Category-based tracking
- Monthly summaries
- Per-user data isolation

---

### Groups & Shared Expenses

- Create and manage groups
- Add members
- Equal split
- Custom percentage split
- Automatic balance calculation
- Clear view of who owes whom
- **Net balance integrity check (zero-sum accounting)**

---

### Real-Time Group Chat

- Group-specific chat rooms
- Socket-based real-time messaging
- WhatsApp-style message alignment
- Scrollable message history
- Persistent chat storage

---

### Analytics & Insights

- Monthly spending trends (line chart)
- Category breakdown (pie chart)
- Dark-theme optimized charts
- Fully responsive analytics views

---

### Payments (Stripe – Test Mode)

- Stripe payment intents
- Simulated card payments
- Secure server-side Stripe integration
- Transaction logging

---

### Settlements

- Mark balances as settled
- Prevent over-settlement
- Optimistic UI updates
- Persistent financial history

---

## Tech Stack

### Frontend

| Layer | Technology |
|-----|-----------|
| Framework | React + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State / Data | React Query |
| Routing | React Router |
| Charts | Recharts |
| Real-time | Socket.io |

### Backend

| Layer | Technology |
|------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Payments | Stripe (Test Mode) |
| Real-time | Socket.io |

---

## Project Structure

```bash
root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── stripe.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── expenses/
│   │   │   ├── groups/
│   │   │   └── transactions/
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── components/
│   │   └── api/
│   │
│   ├── index.css
│   ├── vite.config.ts
│   └── package.json
```

---

## Local Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Design Principles

- Zero-sum financial correctness
- Clean separation of concerns
- State-driven routing (no redirect races)
- Dark-first UI
- Mobile-first responsiveness
- Production-grade UX polish

---

## Inspiration

Inspired by:

- Splitwise
- Modern fintech dashboards
- Real-world group expense workflows

---

## Summary

ExpenseFlow is not just an API or a demo — it is a **complete, production-quality full-stack application** showcasing:

- Real-world business logic
- Correct financial modeling
- Clean authentication architecture
- Modern UI/UX
- Scalable frontend + backend integration

Perfect for learning, showcasing, or extending into a real product.
