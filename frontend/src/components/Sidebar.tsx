'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  AlertTriangle,
  Package,
  MessageSquare,
  Settings,
  HardHat,
} from 'lucide-react';
import clsx from 'clsx';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];

const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const EQUIPE_COLORS: Record<string, string> = {
  CARRELAGE: 'bg-blue-500',
  MACONNERIE: 'bg-amber-600',
  FACADE: 'bg-emerald-600',
  ELECTRICITE: 'bg-yellow-500',
};

const navItems = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/chantiers', label: 'Chantiers', icon: Building2 },
  { href: '/rapports', label: 'Rapports', icon: FileText },
  { href: '/alertes', label: 'Alertes', icon: AlertTriangle },
  { href: '/materiaux', label: 'Matériaux', icon: Package },
  { href: '/whatsapp', label: 'WhatsApp', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 h-screen flex flex-col" style={{ backgroundColor: '#1e3a5f' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-tight">ChantierOps</div>
          <div className="text-blue-300 text-xs">Luxembourg</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
              pathname === href
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}

        {/* Équipes section */}
        <div className="pt-4">
          <div className="px-4 pb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Équipes
          </div>
          {EQUIPES.map((equipe) => (
            <button
              key={equipe}
              onClick={() => router.push(`/chantiers?equipe=${equipe}`)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              <div className={clsx('w-2.5 h-2.5 rounded-full', EQUIPE_COLORS[equipe])} />
              {EQUIPE_LABELS[equipe]}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </button>
        <div className="mt-2 px-4 py-2">
          <div className="text-xs text-blue-400">v1.0.0 · © 2026 ChantierOps</div>
        </div>
      </div>
    </aside>
  );
}
