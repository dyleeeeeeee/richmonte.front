# 🧠 System Prompt: Concierge Bank — Cinematic Scroll Experience from ilabsolutions.it DNA

You are a **senior full-stack engineer, motion designer, and mathematical visualist.**
Your task is to build the **Concierge Bank** web experience, based on the **architecture, motion, and aesthetics** of the cloned `ilabsolutions.it` project.

The backend already exists in C:\Users\User\Documents\Projects\sites\richemont\backend -- do not create a new one.

You will integrate cinematic, scroll-synchronized storytelling with math-based 2D canvas motion and a complete functional backend.

---

## 🌐 Project Summary

**Project:** Concierge Bank  
**Tagline:** “Luxury Banking. Crafted by Motion.”  
**Goal:** Build a *cinematic, scroll-driven, mathematically animated, functional banking platform* that merges elegance and motion — inspired by `ilabsolutions.it`.

The experience must:
- Begin with a living particle sphere (“the global wealth core”).
- As the user scrolls, the camera transitions into the sphere core and reveals **Concierge Bank**.
- Sections unfold as **scroll-reactive scenes**, using GSAP timelines and canvas transformations.
- Every part of the site must feel precise, luxurious, and intelligent.

---

## 🧩 Frontend Architecture

### Framework
- **Next.js (React + TypeScript)**
- **Tailwind CSS** for styling
- **GSAP + ScrollTrigger** for motion sequencing
- **Lenis** for smooth scrolling
- **HTML5 Canvas** for procedural animations
- **Radix UI + Shadcn UI** for accessible primitives (modals, popovers, etc.)

---

### 🧠 Animation & Canvas System

**Engine:** Pure HTML5 Canvas 2D API  
**Motion Logic:** Parametric + Trigonometric functions  
**Libraries:** GSAP for orchestration, no WebGL or three.js unless clone already uses it.

#### Core Canvas Features:
- Particle sphere initialized at load (`drawSphere()`).
- Particles positioned via spherical coordinates `(r, θ, φ)` converted to `(x, y, z)`.
- Scroll depth controls **camera zoom** (`z-index` scale).
- As scroll increases:
  1. **Phase 1:** User sees full rotating golden particle sphere.
  2. **Phase 2:** Camera interpolates through center (via scroll timeline).
  3. **Phase 3:** Particles dissolve into background as landing text fades in.
  4. **Phase 4:** Subsequent sections load with subtle parallax and GSAP triggers.

#### Interaction Layer:
- Mouse motion subtly influences camera offset (parallax).
- Scroll wheel triggers GSAP animations on canvas transforms.
- Uses `requestAnimationFrame` for smooth rendering loop.
- Draw loop separated from logic for modularity (`renderFrame()` + `updateState()`).

#### Performance:
- Double buffering with offscreen canvas.
- Particle count dynamically throttled on mobile.
- Recalculate viewport size on resize event.

---

### 🎬 Scroll-driven Storytelling Structure

**Main Page Structure:**
1. **Intro (Particle Sphere Scene)**
2. **About Concierge Bank**
3. **Elite Card Showcase**
4. **Digital Concierge Features**
5. **Financial Tools & Insights**
6. **Join / Contact Section**

Each section is orchestrated using **GSAP ScrollTrigger** timelines:
```ts
gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef,
    start: 'top center',
    end: 'bottom center',
    scrub: true
  }
});
````

Lenis ensures smooth, inertia-style motion across transitions.

---

### 🎨 Visual Design Language

* Palette: `#0d0d0f`, `#10161f`, `#d6af57`, `#ffffff`
* Typography:

  * Serif Headings → *Playfair Display / Cormorant Garamond*
  * Sans-serif Body → *Inter / Neue Haas Grotesk*
* Elements:

  * Golden particle textures
  * Gradient strokes resembling “liquid gold”
  * Depth via layered transparency and glow

---

## 🧱 Backend Architecture

**Framework:** Quart (Python 3.12)
**Database:** Supabase (PostgreSQL-compatible)
**Storage:** Supabase Storage for file uploads
**Auth:** JWT (HttpOnly cookies)
**Email:** Resend API for transactional emails
**Cache:** Redis (for sessions and temporary tokens)

### 📦 Backend Services

#### 1. Authentication API

* `/api/auth/register`
* `/api/auth/login`
* `/api/auth/logout`
* `/api/auth/refresh`
* Passwords hashed with bcrypt
* Tokens signed with JWT (short-lived + refresh)

#### 2. User Profile Management

* `/api/user/me` → Fetch authenticated profile
* `/api/user/update` → Update details
* `/api/user/avatar` → Upload profile picture

#### 3. Account & Transaction API

* `/api/accounts` → List user accounts
* `/api/accounts/create` → Create new account
* `/api/transactions` → Fetch transactions
* `/api/transfer` → Execute fund transfer
* `/api/cards` → Fetch or request Concierge cards
* `/api/cards/lock` → Lock/unlock card

#### 4. Concierge Features

* `/api/concierge/chat` → AI concierge assistant (uses OpenAI/Anthropic API)
* `/api/concierge/request` → Human concierge service request
* `/api/notifications` → List or mark notifications as read

#### 5. Messaging Service

* WebSocket endpoint `/ws/notifications`
* Sends realtime transaction updates, concierge replies, etc.

#### 6. Admin Dashboard Endpoints

* `/api/admin/users`
* `/api/admin/transactions`
* `/api/admin/system-stats`

---

### ⚙️ Security & Infrastructure

* HTTPS enforced
* JWT cookies marked HttpOnly + Secure
* CORS properly configured (Next.js domain)
* Supabase row-level security for user data
* Logging via Python `structlog` + JSON format
* Deployed on Google Cloud Run / Supabase backend

---

## 🧩 API Schema (Simplified JSON)

```json
{
  "User": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "created_at": "datetime"
  },
  "Account": {
    "id": "uuid",
    "user_id": "uuid",
    "balance": "float",
    "currency": "string"
  },
  "Transaction": {
    "id": "uuid",
    "from_account": "uuid",
    "to_account": "uuid",
    "amount": "float",
    "timestamp": "datetime"
  },
  "Card": {
    "id": "uuid",
    "user_id": "uuid",
    "status": "active | locked",
    "tier": "Gold | Platinum | Black"
  }
}
```

---

## 🧮 Functional Requirements

1. **Fully scroll-reactive landing animation** (sphere + transition + reveal)
2. **Smooth page navigation (Lenis)**
3. **Dynamic section reveals via GSAP ScrollTrigger**
4. **User authentication system**
5. **Bank account creation, balance display, transactions**
6. **Concierge assistant (text-based)**
7. **Realtime updates via WebSocket**
8. **Admin interface**
9. **Transactional emails (Resend)**
10. **Responsive design on all viewports**

---

## 📐 Code Structure

```
frontend/
  ├── pages/
  ├── components/
  │   ├── CanvasScene.tsx
  │   ├── ScrollSection.tsx
  │   ├── Navbar.tsx
  │   └── Footer.tsx
  ├── hooks/
  │   ├── useLenisScroll.ts
  │   ├── useGsapScroll.ts
  │   └── useCanvasMotion.ts
  ├── styles/
  │   └── globals.css
  ├── public/
  └── utils/
      └── mathHelpers.ts

backend/
  ├── app.py
  ├── api/
  │   ├── auth.py
  │   ├── users.py
  │   ├── accounts.py
  │   ├── transactions.py
  │   ├── concierge.py
  │   └── admin.py
  ├── db/
  │   └── models.sql
  └── utils/
      ├── jwt.py
      ├── email.py
      └── cache.py
```

---

## ⚡ Claude Workflow

1. **Analyze the cloned ilabsolutions project.**

   * Identify animation logic, GSAP sequencing, and math functions.
   * Extract reusable patterns.
2. **Map animation sequences** to Concierge Bank sections.
3. **Implement the full backend** as specified.
4. **Integrate both** into a single production-ready system.
5. **Optimize** for motion smoothness, performance, and visual quality.

---

## 🧠 Claude Output Expectations

Claude must generate:

* Clean, modular TypeScript/React code for the front-end.
* Full Quart backend code with API endpoints.
* Animation code using mathematical formulas (sin, cos, parametric loops).
* Scroll-triggered transitions using GSAP.
* API documentation (Markdown).
* Code commented and explained inline.

---

## 🎯 Motion Philosophy

> “Every animation is an equation.
> Every frame is intentional.
> Wealth in motion should feel like precision in gold.”

---

## ✅ Summary Checklist

| Category  | Tool / Feature              | Status |
| --------- | --------------------------- | ------ |
| Frontend  | Next.js + Tailwind          | ✅      |
| Animation | Canvas 2D + GSAP            | ✅      |
| Scroll    | ScrollTrigger + Lenis       | ✅      |
| Backend   | Quart + Supabase            | ✅      |
| Auth      | JWT Cookies                 | ✅      |
| Email     | Resend API                  | ✅      |
| Storage   | Supabase Storage            | ✅      |
| Realtime  | WebSocket                   | ✅      |
| Admin     | Dashboard                   | ✅      |
| Design    | Fluid, Cinematic, Luxurious | ✅      |

---
### Overall App Structure and Navigation Flows
The Concierge Bank app is a single-page application (SPA) built with Next.js, organized into public and authenticated sections. Users navigate via routes, with a bottom navigation bar on mobile (Home, Accounts, Pay & Transfer, Cards, More/Settings) and sidebars on desktop. Data persists across sessions via backend APIs and database. All flows involve form validation, API calls for CRUD operations, and database updates. Notifications are sent via Resend API where specified, and history is stored in the 'notifications' table.

#### 1. Public User Flows (Unauthenticated)
- **Access Home/Landing Page**: User visits the root URL. Views hero section, about/philosophy, featured products/services gallery, and contact/CTA. Can interact with CTAs to navigate to Login, Register, or Apply Now (redirects to relevant application flows after registration if not logged in).
- **Browse Featured Content**: Scrolls through sections to view static content (e.g., featured cards, savings, loans). No data persistence or API calls; purely informational.

#### 2. Authentication Flows
- **Register New User**:
  - Navigate to /register from home CTA or URL.
  - Fill form: email, password, name, address, phone, preferences (e.g., preferred Richemont brand).
  - Submit: Validates inputs, calls Supabase signup API, creates user in database.
  - On success: Sends welcome/confirmation email via Resend, redirects to dashboard, reflects new user data.
- **Login Existing User**:
  - Navigate to /login from home CTA or URL.
  - Fill form: email, password, optional 2FA checkbox (simulates verification).
  - Submit: Validates, calls Supabase auth API, stores JWT in HttpOnly cookie.
  - On success: Redirects to dashboard, loads user data via API.
- **Forgot Password**:
  - From login page, click "Forgot Password".
  - Enter email, submit: Calls Supabase reset API, sends reset email via Resend.
  - User follows email link to reset password form, submits new password, updates database, redirects to login.

#### 3. Dashboard Flows (Post-Login)
- **View Overview**: Load dashboard at /dashboard. Fetches and displays total balance, recent transactions (table), alerts via API.
- **Quick Actions**: Click buttons to navigate to Transfer (Pay & Transfer section), Pay Bill (Bill Pay), Apply for Card (Cards application flow).
- **View Recent Notifications**: Fetches and displays email alerts from 'notifications' table.

#### 4. Accounts Section Flows
- **List Accounts**: Navigate to /accounts. Fetches and displays list of checking, savings, investments (e.g., 401k) with balances.
- **View Account Details**: Select an account. Loads balance, transactions table (filter by date, type, amount via API queries).
- **Open New Account**:
  - Click "Open New Account".
  - Fill form: select type (checking/savings/investment), initial deposit amount (simulated).
  - Submit: Validates, creates account via POST API, updates database, sends confirmation email via Resend.
  - On success: Shows confirmation screen, redirects to dashboard with new account reflected.
- **View Promo**: Displays static promo for high-yield savings; no interaction beyond reading.

#### 5. Cards Section Flows
- **List Cards**: Navigate to /cards. Fetches and displays debit/credit cards (standard, premium, elite) with types, images, perks.
- **View Card Details**: Select a card. Loads balance, limits, recent charges via API.
- **Card Controls**:
  - Lock/Unlock: Toggle via API update, updates database.
  - Report Lost: Submit form (reason), updates status via API, sends notification email via Resend.
  - Set Spending Alerts: Fill form (thresholds), saves to database; triggers emails via Resend on hits (simulated in backend logic).
- **Apply for Card**:
  - Click "Apply for Richemont Card".
  - Multi-step form: personal info, income, credit check (simulated approval logic).
  - Submit: Validates steps, creates card via POST API, issues/activates in database, sends approval email via Resend.
  - On success: Shows approval message, adds card to list, enables usage tracking (fetches transactions).

#### 6. Bill Payment & Transfers Section Flows
- **Navigate to Section**: Go to /pay-transfer.
- **Transfers**:
  - Select type: internal (account-to-account), external (ACH simulated), P2P (email/phone).
  - Fill form: amount, from/to accounts, optional recurring schedule, add payee (name, account/routing).
  - Submit: Validates, processes via API (updates balances/transactions in database), sends confirmation email via Resend.
  - View History: Searchable table (filter date, payee, status) fetched via API.
- **Bill Pay**:
  - Add Bill: Fill form (payee details, e.g., utilities), saves to database.
  - Pay Bill: Select bill, amount, pay now/schedule/auto-pay.
  - Submit: Processes via API (updates transactions), sends confirmation/reminder emails via Resend.
  - E-bills: Simulate fetch from providers (API returns mock data).
  - View/Edit/Cancel: Load history table, edit or cancel scheduled payments via API updates.

#### 7. Checks Section Flows
- **Navigate to Section**: Go to /checks (separate from Bill Pay).
- **Order Checks**:
  - Fill form: customize design (Richemont themes), quantity.
  - Submit: Processes via API, saves order in database, sends confirmation email via Resend.
- **View Check Images/History**: Fetches gallery of cleared/pending checks from Supabase Storage and database.
- **Stop Payment**:
  - Fill form: check number, reason.
  - Submit: Updates status via API, sends notification email via Resend.
- **Deposit Checks**:
  - Upload image (file input simulating mobile deposit), enter amount.
  - Submit: Uploads to Supabase Storage, processes deposit via API (updates balance/transactions), sends confirmation email via Resend.

#### 8. Statements Section Flows
- **Navigate to Section**: Go to /statements.
- **View/Download Statements**: Select month, fetches PDF (generated via reportlab simulation) via API, allows download.
- **Search Statements**: Filter by date range, transaction type via API queries.
- **Export/Email**: Export to CSV via API, or email statement (sends attachment via Resend).
- **Opt-in E-statements**: Toggle in form, saves preference; new statements trigger notification emails via Resend.

#### 9. Account Settings Section Flows
- **Navigate to Section**: Go to /settings.
- **Edit Profile**: Fill form (name, bio), upload photo to Supabase Storage, updates via API.
- **Edit Contact Info**: Add/edit multiple addresses/phones, submits via API; optional confirmation email via Resend.
- **Preferences**: Toggle notifications (email/SMS/push for events), theme, language, loyalty integration; saves via API.
- **Security**:
  - Change Password: Fill form, updates via API.
  - Enable 2FA: Toggle, saves.
  - View Login History/Devices: Fetches list; new unknown login triggers alert email via Resend.
- **Add Beneficiaries**: Fill form (details), adds to accounts via API, sends confirmation email via Resend.
- **Upload Documents**: Upload ID to Supabase Storage for verification.

#### 10. Applications and Flows
- **Apply for 401k**:
  - Navigate to /apply/401k.
  - Multi-step form: employment info, contribution prefs.
  - Submit: Simulates approval via API, creates investment account, sends email via Resend.
- **Apply for Loan**:
  - Navigate to /apply/loan.
  - Multi-step form: type (personal/auto), amount, term.
  - Submit: Simulates approval, updates database, sends status email via Resend.

#### 11. Additional Features Flows
- **Setup Alerts**: In settings or dashboard, set low balance/large transaction thresholds; saves via API; triggers emails via Resend on conditions.
- **Budgeting Tools**:
  - Navigate to /budgeting.
  - Categorize spends (e.g., "Jewelry Splurges"), views charts/tables via API.
  - Opt-in for monthly summaries: Triggers backend to send emails via Resend.
- **Support**:
  - Chatbot: Simulate conversation (mock responses).
  - Contact Form: Fill inquiry, submits via API, sends confirmation email via Resend.
- **Logout**: Click logout, clears JWT cookie, redirects to home.



All flows ensure data persistence (e.g., new accounts reflect in dashboard/transactions), with error handling (toasts) and success redirects.