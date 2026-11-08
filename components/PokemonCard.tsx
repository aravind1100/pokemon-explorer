import React, { useState } from 'react';
import Link from 'next/link';
import { PokemonListItem } from '@/types/pokemon';
import { formatDexNumber } from '@/utils/pokeapi';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [imgSrc, setImgSrc] = useState<string>(pokemon.image);

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="group relative flex flex-col bg-white rounded-xl border-2 border-zinc-200 hover:border-zinc-900 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-zinc-100 bg-zinc-50/70">
        <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-red-600 transition-colors">
          {formatDexNumber(pokemon.id)}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-700">
          Inspect →
        </span>
      </div>

      <div className="relative flex items-center justify-center p-6 h-44 bg-gradient-to-b from-zinc-50/40 to-white">
        <div
          aria-hidden="true"
          className="absolute w-28 h-28 rounded-full border-[6px] border-zinc-100 group-hover:border-red-50 transition-colors"
        />
        <img
          src={imgSrc}
          alt={pokemon.displayName}
          loading="lazy"
          onError={() => setImgSrc(pokemon.sprite)}
          className="relative z-10 w-28 h-28 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-200"
        />
      </div>

      <div className="px-4 py-3.5 bg-white border-t border-zinc-100 flex items-center justify-between">
        <h2 className="font-bold text-base text-zinc-900 group-hover:text-red-600 transition-colors truncate">
          {pokemon.displayName}
        </h2>
        <span className="w-2 h-2 rounded-full bg-zinc-300 group-hover:bg-red-600 transition-colors" />
      </div>
    </Link>
  );
};
