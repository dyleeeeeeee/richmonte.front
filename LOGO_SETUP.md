# 🎨 Logo Integration Guide

## 📁 File Placement

Place your logo files in the following location:

```
public/logos/
├── emblem.png    (Square/circular logo)
└── banner.png    (Horizontal banner logo)
```

## 🖼️ Logo Specifications

### Emblem Logo (`emblem.png`)
- **Type**: Square or circular emblem
- **Recommended Size**: 512x512px minimum (1024x1024px preferred for retina)
- **Format**: PNG with transparent background
- **Usage**:
  - Navbar (48px × 48px display)
  - Footer (40px × 40px display)
  - Favicon generation
  - Mobile app icon

### Banner Logo (`banner.png`)
- **Type**: Horizontal banner/wordmark
- **Recommended Size**: 1200×400px or similar aspect ratio
- **Format**: PNG with transparent background
- **Usage**:
  - About section (max-width: 448px, height: 128px)
  - Marketing materials
  - Email signatures

## ✅ Current Integration

The logos are already integrated in:

### 1. **Navbar** (`components/Navbar.tsx`)
- Uses `emblem.png` at 48×48px
- Scales to 105% on hover
- High priority loading for above-the-fold content

### 2. **About Section** (`app/page.tsx`)
- Displays `banner.png` prominently
- Centered with max-width constraint
- Responsive sizing

### 3. **Footer** (`components/Footer.tsx`)
- Uses `emblem.png` at 40×40px
- Alongside brand name

## 🚀 Next Steps

1. **Add your logo files** to `public/logos/`
2. **Build the project**: `npm run build`
3. **Test locally**: `npm run dev`
4. **Verify logos appear** on homepage, navbar, and footer

## 🎨 Design Tips

- Ensure logos work on both light and dark backgrounds
- Use transparent backgrounds (alpha channel)
- Optimize file size (use tools like TinyPNG or ImageOptim)
- Test at 2x scale for retina displays
- Maintain brand consistency with gold accent colors (#EBA420)

## 🔧 Troubleshooting

**Logo not appearing?**
- Check file names exactly match: `emblem.png` and `banner.png`
- Ensure files are in `public/logos/` directory
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

**Logo quality issues?**
- Use higher resolution source files (2x or 3x)
- Ensure PNG format with proper compression
- Check for transparency artifacts

## 📝 Brand Text Updates

Updated all references from "Richemont Geneva" to:
**"Compagnie Financière Richemont SA"**

Locations updated:
- Homepage about section
- Footer copyright
- All subsidiary references
