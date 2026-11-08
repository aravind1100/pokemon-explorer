import React, { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { PokemonListItem } from '@/types/pokemon';
import { fetchPokemonList } from '@/utils/pokeapi';
import { useDebounce } from '@/hooks/useDebounce';
import { useThrottledScroll } from '@/hooks/useThrottle';
import { Navbar } from '@/components/Navbar';
import { PokemonCard } from '@/components/PokemonCard';

interface HomePageProps {
  initialPokemonList: PokemonListItem[];
}

const BATCH_SIZE = 36;

const GENERATION_FILTERS = [
  { id: 'all', label: 'All Regions (1–386)', min: 1, max: 386 },
  { id: 'gen1', label: 'Gen I • Kanto (1–151)', min: 1, max: 151 },
  { id: 'gen2', label: 'Gen II • Johto (152–251)', min: 152, max: 251 },
  { id: 'gen3', label: 'Gen III • Hoenn (252–386)', min: 252, max: 386 },
] as const;

const HomePage: NextPage<HomePageProps> = ({ initialPokemonList }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchQuery = useDebounce<string>(searchInput, 300);
  const [selectedGen, setSelectedGen] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const isDebouncing = searchInput.trim() !== debouncedSearchQuery.trim();

  const filteredPokemons = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    const activeGenObj =
      GENERATION_FILTERS.find((g) => g.id === selectedGen) || GENERATION_FILTERS[0];

    return initialPokemonList.filter((pokemon) => {
      const withinGen =
        pokemon.id >= activeGenObj.min && pokemon.id <= activeGenObj.max;
      if (!withinGen) return false;
      if (!query) return true;

      const matchesName = pokemon.name.toLowerCase().includes(query);
      const matchesId =
        String(pokemon.id) === query.replace(/^#0*/, '') ||
        String(pokemon.id).padStart(4, '0').includes(query.replace('#', ''));

      return matchesName || matchesId;
    });
  }, [initialPokemonList, debouncedSearchQuery, selectedGen]);

  const displayedPokemons = useMemo(() => {
    return filteredPokemons.slice(0, visibleCount);
  }, [filteredPokemons, visibleCount]);

  // Updates scroll progress indicator and appends next batch when near page bottom
  const handleWindowScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    setScrollProgress(pct);
    setShowBackToTop(scrollTop > 400);

    const distanceFromBottom =
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

    if (distanceFromBottom < 450) {
      setVisibleCount((prev) =>
        prev < filteredPokemons.length
          ? Math.min(prev + BATCH_SIZE, filteredPokemons.length)
          : prev
      );
    }
  }, [filteredPokemons.length]);

  useThrottledScroll(handleWindowScroll, 150);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setVisibleCount(BATCH_SIZE);
  };

  const handleGenChange = (genId: string) => {
    setSelectedGen(genId);
    setVisibleCount(BATCH_SIZE);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Pokédex</title>
        <meta
          name="description"
          content="Responsive Pokemon Explorer built with Next.js, TypeScript, Tailwind CSS, and PokeAPI."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-pokedex-grid">
        <Navbar
          totalCount={initialPokemonList.length}
          scrollProgress={scrollProgress}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="bg-white rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2 ">
                <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-red-500">
                  Pokémon Specimen Explorer
                </h1>
              </div>
              <div className="lg:col-span-5">
                <label
                  htmlFor="pokemon-search"
                  className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2"
                >
                  Filter by Pokémon Name or #ID
                </label>
                <div className="relative">
                  <input
                    id="pokemon-search"
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="e.g., Charizard, Pikachu, or 0025..."
                    className="w-full pl-11 pr-24 py-3.5 bg-zinc-50 border-2 border-zinc-900 rounded-xl text-zinc-900 placeholder-zinc-400 font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600 transition-all"
                  />
                  <svg
                    className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                    />
                  </svg>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {isDebouncing && (
                      <span className="text-[11px] font-mono text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        Wait...
                      </span>
                    )}
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput('');
                          setVisibleCount(BATCH_SIZE);
                        }}
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-900 bg-zinc-200/70 hover:bg-zinc-200 px-2 py-1 rounded transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {GENERATION_FILTERS.map((gen) => {
                  const active = selectedGen === gen.id;
                  return (
                    <button
                      key={gen.id}
                      type="button"
                      onClick={() => handleGenChange(gen.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        active
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      {gen.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono text-zinc-600">
                Showing{' '}
                <span className="font-bold text-zinc-900">
                  {displayedPokemons.length}
                </span>{' '}
                of{' '}
                <span className="font-bold text-zinc-900">
                  {filteredPokemons.length}
                </span>{' '}
                matching Pokémon
              </div>
            </div>
          </section>

          {displayedPokemons.length > 0 ? (
            <>
              <section
                aria-label="Pokémon Directory"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
              >
                {displayedPokemons.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </section>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 py-6">
                {visibleCount < filteredPokemons.length ? (
                  <>
                    <p className="text-xs font-mono text-zinc-500">
                      Scroll down to load more automatically or click below:
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + BATCH_SIZE, filteredPokemons.length)
                        )
                      }
                      className="px-5 py-2.5 bg-white border-2 border-zinc-900 rounded-xl font-bold text-sm text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
                    >
                      Load Next {Math.min(BATCH_SIZE, filteredPokemons.length - visibleCount)} Pokémon
                    </button>
                  </>
                ) : (
                  <p className="text-xs font-mono text-zinc-400">
                    — End of National Archive ({filteredPokemons.length} specimens displayed) —
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center max-w-lg mx-auto my-8">
              <p className="font-mono text-sm text-red-600 font-bold uppercase mb-1">
                No Specimen Found
              </p>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">
                No Pokémon matched &ldquo;{debouncedSearchQuery}&rdquo;
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Try searching for another Pokémon name (like Bulbasaur, Gengar, or
                Rayquaza) or switch the region filter back to All Regions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSelectedGen('all');
                  setVisibleCount(BATCH_SIZE);
                }}
                className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </main>

        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold border-2 border-white shadow-lg hover:bg-red-600 transition-colors"
          >
            <span>↑ TOP</span>
            <span className="text-zinc-400">({scrollProgress}%)</span>
          </button>
        )}
      </div>
    </>
  );
};

// Pre-renders the Pokémon index at build time with 24-hour ISR revalidation
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const initialPokemonList = await fetchPokemonList(386);

    return {
      props: {
        initialPokemonList,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error in getStaticProps (Homepage):', error);
    return {
      props: {
        initialPokemonList: [],
      },
      revalidate: 60,
    };
  }
};

export default HomePage;
