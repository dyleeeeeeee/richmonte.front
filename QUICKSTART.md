# 🚀 Concierge Bank - Quick Start Guide

## ✅ Dependencies Fixed

All dependency issues resolved:
- ✅ Updated Next.js to **14.2.33** (verified working version)
- ✅ Fixed Lenis package: Changed from deprecated `@studio-freight/lenis` → `lenis@1.1.13`
- ✅ Updated all Radix UI packages to latest stable versions
- ✅ TypeScript configured with proper types
- ✅ 462 packages installed, **0 vulnerabilities**

## 📋 Project Ready Status

### ✅ Completed Components
```
✓ Canvas particle sphere (3D spherical coordinates)
✓ Scroll-triggered animations (GSAP)
✓ Smooth scrolling (Lenis)
✓ Banking sections (cards, concierge, services)
✓ API integration layer (Richemont backend)
✓ WebSocket notifications
✓ Full TypeScript setup
```

## 🎯 How to Run

### 1. Start the Frontend
```bash
cd c:\Users\User\Documents\Projects\sites\ilab
npm run dev
```
**URL:** http://localhost:3000

### 2. Start the Backend (in separate terminal)
```bash
cd C:\Users\User\Documents\Projects\sites\richemont\backend
& c:/Users/User/Documents/Projects/sites/.venv/Scripts/Activate.ps1
python run.py
```
**API:** http://localhost:5000

### 3. Create .env.local (optional)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws/notifications
```

## 🎨 What You'll See

### Landing Experience
1. **Hero Section** - Living golden particle sphere rotating in 3D space
2. **Scroll Effect** - Camera zooms through sphere core as you scroll
3. **Content Reveal** - Banking sections fade in with GSAP animations
4. **Elite Cards** - Gold, Platinum, Black tier showcase
5. **Concierge Features** - AI assistant, instant transfers, notifications
6. **Services Grid** - Private banking, wealth management, digital services

## 📐 Technical Highlights

### Canvas Math
```typescript
// Particle positioning using spherical coordinates
θ = random * 2π    // Azimuthal angle (0 to 360°)
φ = acos(2 * random - 1)  // Polar angle (uniform distribution)

x = r * sin(φ) * cos(θ)
y = r * sin(φ) * sin(θ)
z = r * cos(φ)

// Perspective projection
fov = 1000 / (1000 + z + cameraDistance)
screenX = x * fov + width/2
screenY = y * fov + height/2
```

### Scroll Integration
- **0-100vh**: Particle sphere intro with auto-rotation
- **Scroll down**: Camera moves through sphere (z = -1000 → +800)
- **>60% scroll**: Particles fade out, content takes over
- **All sections**: GSAP ScrollTrigger animations

## 🔗 Backend Integration

### Available APIs (from lib/api.ts)
```typescript
// Authentication
authAPI.login({ email, password })
authAPI.register({ email, password, name })
authAPI.getCurrentUser()

// Accounts
accountAPI.getAccounts()
accountAPI.createAccount(currency)

// Transactions
transactionAPI.getTransactions()
transactionAPI.createTransfer({ from, to, amount })

// Cards
cardAPI.getCards()
cardAPI.requestCard("Gold" | "Platinum" | "Black")
cardAPI.lockCard(cardId, locked)

// Concierge
conciergeAPI.sendMessage(message)
conciergeAPI.createRequest({ type, details })
```

## 🎭 Animation System

### Particle Sphere
- **Count**: 2,500 particles (throttled on mobile)
- **Rendering**: HTML5 Canvas 2D with requestAnimationFrame
- **Performance**: ~60 FPS with viewport culling
- **Effects**: Golden glow, mouse parallax, auto-rotation

### Scroll Animations
- **Library**: GSAP 3.12.5 + ScrollTrigger plugin
- **Easing**: power3.out, power4.out (smooth luxury feel)
- **Triggers**: Sections animate as they enter viewport
- **Types**: Fade, slide, scale, stagger effects

## 🛠️ Development Commands

```bash
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## 📁 Key Files

```
ilab/
├── app/
│   ├── page.tsx           ← Main landing page
│   ├── layout.tsx         ← Root layout
│   └── globals.css        ← Global styles
├── components/
│   ├── CanvasScene.tsx    ← Particle sphere (1,000+ lines of math)
│   ├── ScrollSection.tsx  ← GSAP wrapper
│   ├── Navbar.tsx         ← Navigation
│   └── Footer.tsx         ← Footer
├── hooks/
│   ├── useLenisScroll.ts  ← Smooth scroll
│   └── useGsapScroll.ts   ← Animation hook
├── lib/
│   ├── api.ts             ← Backend integration
│   └── websocket.ts       ← Real-time notifications
└── utils/
    └── mathHelpers.ts     ← 3D math functions
```

## 🎯 Next Steps

### Immediate
1. Run `npm run dev` to see the cinematic experience
2. Test scroll behavior through particle sphere
3. Verify GSAP animations trigger correctly

### Enhancement Ideas
1. **Dashboard Pages** - Full banking dashboard with charts
2. **Login/Register** - Authentication flow with backend
3. **Account Management** - View balances, transactions
4. **Card Showcase** - Interactive 3D card models
5. **Concierge Chat** - Real-time AI chat interface
6. **Mobile Optimization** - Touch gestures, reduced particles

## 💡 Tips

- **Scroll slowly** through hero to see particle transition
- **Move mouse** during intro for parallax effect
- **Resize window** - canvas auto-adjusts
- **Check console** - Animation frame rate logged

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript Errors
```bash
# Rebuild types
rm -rf .next
npm run dev
```

### Canvas Not Showing
- Check browser console for errors
- Verify canvas element rendered
- Try hard refresh (Ctrl+Shift+R)

---

**Ready to experience luxury banking in motion!** 🌟
