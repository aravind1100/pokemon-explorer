import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import { Navbar } from '@/components/Navbar';

/**
 * Custom 500 Server Error Page (`pages/500.tsx`)
 * Automatically rendered by Next.js if an unexpected server or API error occurs.
 */
const ServerErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>500 — System Error | Pokédex Explorer</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-pokedex-grid">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
            <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-amber-500">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  Error Code: 500
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">SYS_FAULT</span>
            </div>

            <div className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center">
                <span className="font-mono text-2xl font-extrabold text-amber-600">
                  !
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-zinc-900 mb-2">
                PokéAPI Connection Interrupted
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                The Pokédex server encountered an unexpected error while
                communicating with the remote archive. Please refresh or return
                to the homepage.
              </p>

              <Link
                href="/"
                className="inline-block w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-red-600 transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ServerErrorPage;