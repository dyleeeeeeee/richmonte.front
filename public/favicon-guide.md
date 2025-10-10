# Favicon Generation Guide

## Quick Setup

1. Take your `emblem.png` from `public/logos/`
2. Use a favicon generator (recommended tools):
   - https://realfavicongenerator.net/
   - https://favicon.io/
   - https://www.favicon-generator.org/

3. Generate the following sizes:
   - `favicon.ico` (16x16, 32x32, 48x48 multi-resolution)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180)
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

4. Place all files in:
   - `app/favicon.ico` (root favicon)
   - `public/` (all other icon files)

## Automatic Detection

Next.js will automatically detect and use:
- `app/favicon.ico`
- `app/icon.png` or `app/icon.jpg`
- `app/apple-icon.png`

## Manual Setup (Alternative)

If automatic detection doesn't work, the metadata is configured in `app/layout.tsx`.
