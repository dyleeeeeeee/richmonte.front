# Concierge Bank — Cinematic Scroll Experience

**A Richemont Financial Institution**

**Luxury Banking. Crafted by Motion.**

A mathematically-animated, scroll-driven banking platform that merges elegance and motion, inspired by the ilabsolutions.it design DNA. Built on the heritage of Richemont Geneva, serving clients who appreciate Swiss precision and Maison craftsmanship.

## 🌟 Features

- **Living Particle Sphere Animation** - 3D canvas particle system using spherical coordinates and parametric functions
- **Scroll-Synchronized Storytelling** - GSAP ScrollTrigger animations that respond to user scroll
- **Smooth Scrolling** - Lenis smooth scroll with inertia physics
- **Banking Functionality** - Full-featured banking platform for Richemont clientele
- **Responsive Design** - Optimized for all devices
- **Type-Safe** - Built with TypeScript for reliability

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **GSAP + ScrollTrigger** - Professional animation library
- **Lenis** - Smooth scroll library
- **HTML5 Canvas** - Procedural 3D particle animations

### Backend (Richemont Financial Services)
- **Location**: `C:\Users\User\Documents\Projects\sites\richemont\backend`
- **Framework**: Quart (Python async)
- **Database**: Supabase PostgreSQL
- **Auth**: JWT with HttpOnly cookies
- **Institution**: Concierge Bank, a Richemont subsidiary

## 📐 Mathematical Foundations

The particle sphere uses:
- Spherical coordinates `(r, θ, φ)` → Cartesian `(x, y, z)`
- 3D rotation matrices for X, Y, Z axes
- Perspective projection: `fov = perspective / (perspective + z + distance)`
- Parametric wave functions: `amplitude * sin(frequency * t + phase)`

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Setup

Ensure the Richemont backend is running:
```bash
cd C:\Users\User\Documents\Projects\sites\richemont\backend
python run.py
```

The backend powers Concierge Bank's Swiss banking infrastructure.

## 📂 Project Structure

```
ilab/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── CanvasScene.tsx     # 3D particle sphere animation
│   ├── ScrollSection.tsx   # GSAP scroll wrapper
│   ├── Navbar.tsx          # Navigation header
│   └── Footer.tsx          # Site footer
├── hooks/
│   ├── useLenisScroll.ts   # Smooth scroll hook
│   └── useGsapScroll.ts    # GSAP animation hook
├── lib/
│   └── api.ts              # Backend API integration
├── utils/
│   └── mathHelpers.ts      # Mathematical functions
└── www.ilabsolutions.it/   # Original cloned site reference
```

## 🎨 Animation System

### Particle Sphere
- 2,500 particles positioned on sphere surface
- Auto-rotation with mouse parallax influence
- Scroll-controlled camera movement through sphere
- Fade-out effect as user scrolls past intro

### Scroll Triggers
Each section uses GSAP ScrollTrigger with:
- Custom easing functions (power3, power4)
- Stagger animations for text
- Fade, slide, and scale transitions

### Performance Optimizations
- RequestAnimationFrame for smooth 60fps
- Particle count throttled on mobile
- Viewport culling for off-screen particles
- Efficient 2D canvas rendering

## 🎯 Motion Philosophy

> "Every animation is an equation.
> Every frame is intentional.
> Wealth in motion should feel like precision in gold."

## 🔗 API Integration

The frontend connects to these backend endpoints:

### Authentication
- `POST /api/auth/register` - New user registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Banking
- `GET /api/accounts` - List user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id/transactions` - Transaction history for specific account

### Transfers
- `POST /api/transfers` - Execute fund transfer (internal/external/p2p)

### Cards
- `GET /api/cards` - User's cards
- `POST /api/cards/apply` - Apply for new elite card
- `POST /api/cards/:id/lock` - Lock/unlock card

### Bills
- `GET /api/bills` - List saved bill payees
- `POST /api/bills` - Add bill payee
- `POST /api/bills/:id/pay` - Pay bill

### Checks
- `GET /api/checks` - List checks
- `POST /api/checks/deposit` - Deposit check
- `POST /api/checks/order` - Order checkbook

### Settings & Notifications
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `GET /api/notifications` - User notifications

## 🛠️ Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 Code Style

- **Type hints** used consistently
- **Modular components** for reusability
- **Inline comments** for complex math
- **PEP8-style** variable naming (where applicable)
- **Functional approach** for utilities

## 🎓 Learning Resources

To understand the mathematical animations:
1. Study `utils/mathHelpers.ts` for 3D math
2. Review `components/CanvasScene.tsx` for rendering
3. Check GSAP docs: https://gsap.com/docs/v3/
4. Lenis docs: https://github.com/studio-freight/lenis

## 📄 License

Private project - All rights reserved

---

Built with mathematical precision and artistic elegance.
