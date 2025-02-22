# Quest - A Modern Puzzle Game Platform

Quest is a modern web application built with Next.js that offers engaging puzzle games with a sleek, responsive interface. Currently featuring a sliding puzzle game, the platform is designed to expand with more puzzle types in the future.

## Features

- **Sliding Puzzle Game**
  - 4x4 grid sliding puzzle
  - Move tracking and star rating system
  - Rewards system with achievements
  - Clean, intuitive interface

- **Modern Tech Stack**
  - Next.js 14 with React 18
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Radix UI primitives for accessible components

- **User Experience**
  - Responsive design for all devices
  - Dark/light theme support
  - Smooth animations and transitions
  - Mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm 9.8.0 or later

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd quest
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
quest/
├── app/               # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── puzzles/      # Puzzle games
├── components/       # Reusable React components
│   ├── ui/          # UI component library
│   └── ...
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.