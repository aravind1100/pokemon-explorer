import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import { Navbar } from '@/components/Navbar';

/**
 * Custom 404 Page (`pages/404.tsx`)
 * Automatically rendered by Next.js whenever a user visits a non-existent URL
 * (e.g., `/random-page`) or when `getStaticProps` in `pages/pokemon/[id].tsx`
 * returns `{ notFound: true }` for an invalid Pokémon ID (e.g., `/pokemon/99999`).
 */
const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 — Specimen Not Found | Pokédex Explorer</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-pokedex-grid">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
            {/* Top Alert Banner */}
            <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-red-600">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                  Error Code: 404
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">#0000</span>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 text-center">
              {/* MissingNo / Glitch Pokeball Emblem */}
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-red-50 border-2 border-dashed border-red-300 flex items-center justify-center">
                <span className="font-mono text-2xl font-extrabold text-red-600">
                  ?
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">
                Route or Specimen Not Found
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                The page or Pokémon ID you requested does not exist in the
                National Pokédex archive. Check the URL or return to the main
                directory.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-[3px_3px_0px_0px_rgba(24,24,27,0.3)]"
                >
                  ← Return to Pokédex
                </Link>
                <Link
                  href="/pokemon/25"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-800 font-mono text-xs font-bold border border-zinc-300 hover:border-zinc-900 transition-colors"
                >
                  Inspect #0025 (Pikachu)
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFoundPage;