# Pokédex National Archive — Next.js Pokémon Explorer

A responsive, high-performance **Pokémon Explorer** web application built with **Next.js (Pages Router)**, **TypeScript**, and **Tailwind CSS**, powered by [PokéAPI v2](https://pokeapi.co/).

## Key Features

- **Next.js + TypeScript + Tailwind CSS**: Strictly typed data contracts (`types/pokemon.ts`) and responsive neo-brutalist Pokédex styling.
- **Static Site Generation (SSG) & ISR**: Pre-renders the Pokémon directory on `pages/index.tsx` via `getStaticProps` and pre-builds dynamic detail pages (`pages/pokemon/[id].tsx`) via `getStaticPaths` (`fallback: 'blocking'`).
- **Debounced Search (300ms)**: Custom `useDebounce` hook filters Pokémon by name or National Dex ID without unnecessary re-renders on rapid keystrokes.
- **Throttled Infinite Scroll (150ms)**: Custom `useThrottledScroll` hook powers 60fps incremental batch loading and a live scroll progress bar.
- **Comprehensive Specimen Detail View**: Displays official & shiny artwork toggle, elemental types, standard & hidden abilities, base combat statistics, and a filterable moveset table.

## Project Structure

```text
pokemon-explorer/
├── components/
│   ├── Navbar.tsx           # Responsive header & throttled scroll progress bar
│   └── PokemonCard.tsx      # Individual Pokemon specimen card
├── hooks/
│   ├── useDebounce.ts       # Generic 300ms debounce hook
│   └── useThrottle.ts       # 150ms throttle hook for window scroll events
├── pages/
│   ├── _app.tsx             # Global application wrapper
│   ├── index.tsx            # Homepage directory (SSG)
│   └── pokemon/
│       └── [id].tsx         # Dynamic Pokemon detail route (SSG + ISR)
├── styles/
│   └── globals.css          # Tailwind directives & custom background grid
├── types/
│   └── pokemon.ts           # TypeScript interfaces for PokeAPI responses
└── utils/
    └── pokeapi.ts           # API client helpers & elemental type badge tokens
```

## Getting Started

### Prerequisites

- **Node.js** v18.0 or higher
- **npm** v9.0 or higher

### Installation & Local Development

1. Navigate into the project directory:
   ```bash
   cd pokemon-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
