'use client';

import { usePathname, useRouter } from 'next/navigation';
import { X, HardHat, LayoutDashboard, Building2, MessageSquare, Package, AlertTriangle, FileText, Calendar, Clock, Settings } from 'lucide-react';
import clsx from 'clsx';

const EQUIPES = [
  { key: 'CARRELAGE', label: 'Carrelage', color: '#3b82f6' },
  { key: 'MACONNERIE', label: 'Maçonnerie', color: '#16a34a' },
  { key: 'FACADE', label: 'Façade', color: '#d97706' },
  { key: 'ELECTRICITE', label: 'Électricité', color: '#7c3aed' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavLink({
  label, icon: Icon, badge, badgeColor = 'red', active, onClick,
}: {
  label: string; icon: any; badge?: number; badgeColor?: 'red' | 'blue'; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left',
        active ? 'text-blue-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      )}
      style={active ? { background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.22)' } : {}}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="text-white text-[10px] font-bold px-1.5 py-px rounded-full flex-shrink-0"
          style={{ background: badgeColor === 'red' ? '#dc2626' : '#2563eb', fontFamily: 'monospace' }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
        style={{ fontFamily: 'monospace' }}
      >
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-60 h-screen flex flex-col transition-transform duration-300',
          'md:relative md:translate-x-0 md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: '#1a2f4a', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#2563eb', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
          >
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base leading-tight">ChantierOps</div>
            <div className="text-slate-400 text-xs mt-0.5">Gestion terrain · bureau</div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <NavGroup label="Vue principale">
            <NavLink label="Tableau de bord" icon={LayoutDashboard} active={isActive('/dashboard')} onClick={() => navigate('/dashboard')} />
            <NavLink label="Chantiers" icon={Building2} badge={6} badgeColor="blue" active={isActive('/chantiers')} onClick={() => navigate('/chantiers')} />
          </NavGroup>

          <NavGroup label="Équipes">
            {EQUIPES.map(eq => (
              <button
                key={eq.key}
                onClick={() => navigate(`/chantiers?equipe=${eq.key}`)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: eq.color }} />
                {eq.label}
              </button>
            ))}
          </NavGroup>

          <NavGroup label="Opérations">
            <NavLink label="WhatsApp Bot" icon={MessageSquare} badge={3} badgeColor="blue" active={isActive('/whatsapp')} onClick={() => navigate('/whatsapp')} />
            <NavLink label="Matériaux" icon={Package} badge={4} badgeColor="red" active={isActive('/materiaux')} onClick={() => navigate('/materiaux')} />
            <NavLink label="Alertes" icon={AlertTriangle} badge={4} badgeColor="red" active={isActive('/alertes')} onClick={() => navigate('/alertes')} />
          </NavGroup>

          <NavGroup label="Rapports">
            <NavLink label="Journaliers" icon={FileText} active={isActive('/rapports')} onClick={() => navigate('/rapports')} />
            <NavLink label="Hebdomadaire" icon={Calendar} active={false} onClick={() => navigate('/rapports?periode=semaine')} />
            <NavLink label="Mensuel" icon={Clock} active={false} onClick={() => navigate('/rapports?periode=mois')} />
          </NavGroup>
        </nav>

        {/* Footer */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <NavLink label="Paramètres" icon={Settings} active={isActive('/settings')} onClick={() => navigate('/settings')} />

          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mt-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: '#2563eb' }}
            >
              CM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-100 text-sm font-semibold leading-tight truncate">Chef de chantier</div>
              <div className="text-slate-500 text-xs">Administrateur</div>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
            <div
              className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-300">Mode démonstration</span>
            </div>
          )}
          <div className="text-xs text-slate-600 px-1 mt-1.5">v1.0.0 · © 2026 ChantierOps</div>
        </div>
      </aside>
    </>
  );
}
