'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Menu, HardHat } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f1c2e' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ backgroundColor: '#1a2f4a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 p-1 -ml-1"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#2563eb' }}
            >
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base">ChantierOps</span>
          </div>
        </div>
        <main className="flex-1 overflow-auto" style={{ background: '#0f1c2e' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
