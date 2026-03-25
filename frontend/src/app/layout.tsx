'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Menu, HardHat } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ChantierOps — Gestion des Chantiers Luxembourg</title>
        <meta name="description" content="Gestion opérationnelle des chantiers de construction" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Mobile top bar */}
              <div
                className="md:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0 border-b border-white/10"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-white p-1 -ml-1"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-base">ChantierOps</span>
                </div>
              </div>
              <main className="flex-1 overflow-auto bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
