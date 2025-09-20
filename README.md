# Astro + TypeScript + Tailwind + Alpine.js Project

A modern web development starter template built with cutting-edge technologies for optimal performance and developer experience.

## 🚀 Features

- **[Astro](https://astro.build)** - Static Site Generator with component islands
- **[TypeScript](https://www.typescriptlang.org)** - Type safety and better developer experience
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework with custom dark theme
- **[Alpine.js](https://alpinejs.dev)** - Lightweight JavaScript framework for interactivity
- **Custom Dark Theme** - Beautiful dark color scheme with blue accents
- **Mobile-First Design** - Responsive layout optimized for all devices
- **Icon Support** - Material Icons and Font Awesome included
- **SEO Ready** - Proper meta tags and structured data

## 🏗️ Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Hero.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 🛠️ Technology Stack

### Frontend Framework
- **Astro** - Ships zero JavaScript by default, adds interactivity where needed
- **TypeScript** - Strict mode enabled for maximum type safety

### Styling
- **Tailwind CSS** - Utility-first CSS with custom configuration
- **Custom Dark Theme** - GitHub-inspired dark color palette
- **Noto Sans SC** - Primary font family with Chinese support
- **Responsive Design** - Mobile-first approach

### Interactivity
- **Alpine.js** - Lightweight reactive framework
- **Component Islands** - Selective hydration for optimal performance

### Icons & Assets
- **Material Icons** - Google's icon system
- **Font Awesome** - Comprehensive icon library
- **SVG Favicon** - Scalable vector icon

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-astro-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## 🎨 Customization

### Colors
The project uses a custom dark theme defined in `tailwind.config.mjs`:

```javascript
colors: {
  dark: {
    bg: '#0d1117',           // Main background
    surface: '#161b22',      // Card backgrounds
    border: '#30363d',       // Border color
    text: {
      primary: '#f0f6fc',    // Main text
      secondary: '#8b949e',   // Secondary text
      muted: '#656d76',      // Muted text
    }
  },
  accent: {
    // Blue accent colors (50-900)
  }
}
```

### Typography
Primary font stack: `Noto Sans SC, Inter, system-ui, sans-serif`

### Components
All components are built with Astro and styled with Tailwind CSS. Alpine.js is used for interactive elements.

## 🧩 Component Examples

### Interactive Counter
```html
<div x-data="{ count: 0 }">
  <button @click="count++">+</button>
  <span x-text="count"></span>
  <button @click="count--">-</button>
</div>
```

### Modal with Transitions
```html
<div x-data="{ showModal: false }">
  <button @click="showModal = true">Open Modal</button>
  <div x-show="showModal" x-transition>
    <!-- Modal content -->
  </div>
</div>
```

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/start-here)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

Built with ❤️ using modern web technologies