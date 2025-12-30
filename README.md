# DevOps Engineer Portfolio

A modern, responsive portfolio website built with Astro, React, and Tailwind CSS.

## Features

- 🚀 Modern and responsive design
- ⚡ Fast performance with Astro
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Mobile-friendly navigation
- 🎯 DevOps-focused content and sections

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

### Build

To build for production:
```bash
pnpm build
```

To preview the production build:
```bash
pnpm preview
```

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Skills.astro
│   │   ├── Projects.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Customization

Update the content in each component file to match your personal information:
- `src/components/Hero.astro` - Hero section
- `src/components/About.astro` - About section
- `src/components/Skills.astro` - Skills and technologies
- `src/components/Projects.astro` - Project showcase
- `src/components/Contact.astro` - Contact information

## Technologies Used

- [Astro](https://astro.build/) - Web framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [pnpm](https://pnpm.io/) - Package manager

## License

MIT

