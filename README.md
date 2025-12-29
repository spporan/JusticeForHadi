# 🎨 Photocard Generator

A fully client-side web app for creating beautiful quote photocards. Built with Next.js, optimized for GitHub Pages.

## ✨ Features

- **Image Selection**: Upload your own images or choose from vibrant presets
- **Custom Quotes**: Write your own or select from inspiring preset quotes
- **Text Customization**:
  - Drag and position text anywhere on the image
  - Change font family, size, color, and opacity
  - Add text shadows for better readability
  - Adjust text alignment (left, center, right)
- **High-Quality Export**: Download as 1080x1080 PNG
- **Social Sharing**: Share directly via Web Share API (with download fallback)
- **Fully Responsive**: Mobile-first design with touch-friendly controls
- **Works Offline**: No backend required, runs entirely in browser

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Build for GitHub Pages

```bash
npm run build
```

This generates a static export in the `out` directory.

### Deploy to GitHub Pages

1. Create a GitHub repository
2. Update `next.config.mjs` basePath to match your repo name:
   ```js
   basePath: '/your-repo-name';
   ```
3. Push code to GitHub
4. In repo Settings → Pages, set source to "GitHub Actions"
5. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 🛠️ Tech Stack

- **Next.js 16** - Static export for GitHub Pages
- **React 19** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **react-draggable** - Drag functionality
- **Canvas API** - Image rendering and export

## 📝 Customization

### Adding Preset Images

Edit `lib/constants.ts`:

```tsx
export const PRESET_IMAGES: PresetImage[] = [
  {
    id: '7',
    name: 'Your Image',
    url: '/images/your-image.jpg',
  },
];
```

### Adding Preset Quotes

Edit `lib/constants.ts`:

```tsx
export const PRESET_QUOTES: PresetQuote[] = [
  {
    id: '9',
    text: 'Your inspiring quote here',
    category: 'custom',
  },
];
```

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

Web Share API requires HTTPS in production.

## 📄 License

MIT License - feel free to use for any project!

## 🤝 Contributing

Contributions welcome! Feel free to open issues or PRs.

---

Built with ❤️ using v0.dev
