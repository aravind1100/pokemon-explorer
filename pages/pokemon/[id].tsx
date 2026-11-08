import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PokemonDetailData } from '@/types/pokemon';
import {
  fetchPokemonDetail,
  formatDexNumber,
  TYPE_BADGE_STYLES,
} from '@/utils/pokeapi';
import { Navbar } from '@/components/Navbar';

interface PokemonDetailPageProps {
  pokemon: PokemonDetailData;
}

const PokemonDetailPage: NextPage<PokemonDetailPageProps> = ({ pokemon }) => {
  const [showShiny, setShowShiny] = useState<boolean>(false);
  const [moveFilter, setMoveFilter] = useState<string>('all');
  const [moveSearch, setMoveSearch] = useState<string>('');

  const primaryType = pokemon.types[0] || 'normal';
  const primaryStyle = TYPE_BADGE_STYLES[primaryType] || TYPE_BADGE_STYLES.normal;

  const filteredMoves = useMemo(() => {
    return pokemon.moves.filter((m) => {
      if (moveFilter === 'level-up' && m.learnMethod !== 'level-up') return false;
      if (moveFilter === 'machine' && m.learnMethod !== 'machine') return false;
      if (
        moveFilter === 'other' &&
        (m.learnMethod === 'level-up' || m.learnMethod === 'machine')
      ) {
        return false;
      }
      if (
        moveSearch.trim() &&
        !m.name.toLowerCase().includes(moveSearch.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [pokemon.moves, moveFilter, moveSearch]);

  return (
    <>
      <Head>
        <title>
          {pokemon.displayName} ({formatDexNumber(pokemon.id)}) | Pokédex Explorer
        </title>
        <meta
          name="description"
          content={`Detailed stats, abilities, types, and moves for ${pokemon.displayName}.`}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-pokedex-grid">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-zinc-900 font-bold text-sm text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]"
            >
              <span>← Back to Pokédex Directory</span>
            </Link>

            <div className="flex items-center gap-2">
              {pokemon.id > 1 && (
                <Link
                  href={`/pokemon/${pokemon.id - 1}`}
                  className="px-3.5 py-2 rounded-xl bg-white border-2 border-zinc-300 hover:border-zinc-900 font-mono text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-colors"
                >
                  ← {formatDexNumber(pokemon.id - 1)}
                </Link>
              )}
              {pokemon.id < 1025 && (
                <Link
                  href={`/pokemon/${pokemon.id + 1}`}
                  className="px-3.5 py-2 rounded-xl bg-white border-2 border-zinc-300 hover:border-zinc-900 font-mono text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-colors"
                >
                  {formatDexNumber(pokemon.id + 1)} →
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] overflow-hidden mb-8">
            <div className="bg-zinc-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b-4 border-red-600">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-red-600 text-white">
                  {formatDexNumber(pokemon.id)}
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {pokemon.displayName}
                  </h1>
                  <p className="text-xs font-mono text-zinc-400">{pokemon.genus}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pokemon.types.map((typeName) => {
                  const style =
                    TYPE_BADGE_STYLES[typeName] || TYPE_BADGE_STYLES.normal;
                  return (
                    <span
                      key={typeName}
                      className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {typeName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 sm:p-8 bg-zinc-50/70 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
                <div>
                  <div className="relative bg-white rounded-2xl border-2 border-zinc-200 p-6 flex flex-col items-center justify-center min-h-[280px]">
                    <div className="absolute top-3 left-3 text-[11px] font-mono text-zinc-400">
                      {showShiny ? '★ SHINY SPECIMEN' : 'STANDARD SPECIMEN'}
                    </div>

                    <img
                      src={
                        showShiny ? pokemon.artworkShiny : pokemon.artworkDefault
                      }
                      alt={pokemon.displayName}
                      className="w-56 h-56 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                    />

                    <div className="mt-4 flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                      <button
                        type="button"
                        onClick={() => setShowShiny(false)}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                          !showShiny
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        Official Art
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowShiny(true)}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                          showShiny
                            ? 'bg-amber-500 text-zinc-950'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        ★ Shiny Form
                      </button>
                    </div>
                  </div>

                  <blockquote className="mt-5 p-4 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-700 leading-relaxed italic">
                    &ldquo;{pokemon.flavorText}&rdquo;
                  </blockquote>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                    <span className="block text-[10px] font-mono uppercase text-zinc-400">
                      Height
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900">
                      {pokemon.heightMeters}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                    <span className="block text-[10px] font-mono uppercase text-zinc-400">
                      Weight
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900">
                      {pokemon.weightKg}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                    <span className="block text-[10px] font-mono uppercase text-zinc-400">
                      Base EXP
                    </span>
                    <span className="font-mono font-bold text-sm text-zinc-900">
                      {pokemon.baseExperience}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                    Documented Abilities ({pokemon.abilities.length})
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.name}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-50 border-2 border-zinc-200"
                      >
                        <span className="font-bold text-sm text-zinc-900">
                          {ability.name}
                        </span>
                        {ability.isHidden ? (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                            Hidden
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
                            Standard
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                      Base Combat Statistics
                    </h2>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-white">
                      TOTAL BST: {pokemon.totalBaseStats}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {pokemon.stats.map((stat) => {
                      const percentage = Math.min(
                        100,
                        Math.round((stat.value / 200) * 100)
                      );
                      return (
                        <div key={stat.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-semibold text-zinc-700">
                              {stat.label}
                            </span>
                            <span className="font-bold text-zinc-900">
                              {stat.value} / 255
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: primaryStyle.accentHex,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900">
                  Compatible Moveset Archive ({filteredMoves.length})
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Complete list of moves learned by {pokemon.displayName} via Level-Up,
                  Technical Machines (TM), or Move Tutors.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `All (${pokemon.moves.length})` },
                  { id: 'level-up', label: 'Level-Up' },
                  { id: 'machine', label: 'TM / Machine' },
                  { id: 'other', label: 'Tutor / Egg' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMoveFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                      moveFilter === tab.id
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-4">
              <input
                type="text"
                value={moveSearch}
                onChange={(e) => setMoveSearch(e.target.value)}
                placeholder={`Filter ${pokemon.displayName}'s moves by name...`}
                className="w-full sm:w-80 px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="max-h-96 overflow-y-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-100 sticky top-0 border-b border-zinc-200 text-[11px] font-mono uppercase text-zinc-600">
                  <tr>
                    <th className="py-2.5 px-4">Move Name</th>
                    <th className="py-2.5 px-4">Learn Method</th>
                    <th className="py-2.5 px-4 text-right">Level Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredMoves.map((move) => (
                    <tr key={`${move.name}-${move.learnMethod}`} className="hover:bg-zinc-50">
                      <td className="py-2.5 px-4 font-semibold text-zinc-900">
                        {move.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs uppercase text-zinc-600">
                        {move.learnMethod.replace('-', ' ')}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-right font-bold text-zinc-800">
                        {move.learnMethod === 'level-up' && move.levelLearnedAt > 0
                          ? `Lv. ${move.levelLearnedAt}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

// Pre-builds top 50 Kanto Pokémon at build time and generates remaining IDs on-demand
export const getStaticPaths: GetStaticPaths = async () => {
  const prebuiltIds = Array.from({ length: 50 }, (_, idx) => String(idx + 1));

  return {
    paths: prebuiltIds.map((id) => ({ params: { id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PokemonDetailPageProps> = async (
  context
) => {
  const idParam = context.params?.id;

  if (!idParam || Array.isArray(idParam)) {
    return { notFound: true };
  }

  try {
    const pokemon = await fetchPokemonDetail(idParam);
    return {
      props: {
        pokemon,
      },
      revalidate: 86400,
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default PokemonDetailPage;
