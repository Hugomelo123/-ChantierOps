'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <title>ChantierOps — Gestion des Chantiers Luxembourg</title>
        <meta name="description" content="Gestion opérationnelle des chantiers de construction" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-50">
              {children}
            </main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
