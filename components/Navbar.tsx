import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  totalCount?: number;
  scrollProgress?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCount = 386,
  scrollProgress = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-900 text-white border-b-4 border-red-600 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[3.75rem] sm:h-16 py-2 sm:py-0 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 group focus:outline-none"
        >
          <div className="relative shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 border-2 border-white shadow-inner group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white truncate">
                POKÉDEX
              </span>
            
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div
            className="hidden md:flex items-center gap-1.5"
            aria-hidden="true"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="text-right font-mono text-[11px] sm:text-xs bg-zinc-800 border border-zinc-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap">
            <span className="text-zinc-400">INDEXED: </span>
            <span className="text-white font-bold">{totalCount}</span>
          </div>
        </div>
      </div>

      {scrollProgress > 0 && (
        <div className="w-full h-1 bg-zinc-800">
          <div
            className="h-full bg-red-500 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, scrollProgress))}%` }}
          />
        </div>
      )}
    </header>
  );
};
