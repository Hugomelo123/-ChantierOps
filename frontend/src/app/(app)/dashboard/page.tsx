'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  dashboardApi, chantiersApi, materiauxApi, alertesApi, whatsappApi,
  type Chantier, type DemandeMateriau, type Alerte,
} from '@/lib/api';
import { Zap, Send, CheckCircle } from 'lucide-react';

const EQUIPE_INFO: Record<string, { color: string; label: string; initials: string }> = {
  CARRELAGE:   { color: '#3b82f6', label: 'Carrelage',  initials: 'CA' },
  MACONNERIE:  { color: '#16a34a', label: 'Maçonnerie', initials: 'MA' },
  FACADE:      { color: '#d97706', label: 'Façade',     initials: 'FA' },
  ELECTRICITE: { color: '#7c3aed', label: 'Électricité',initials: 'EL' },
};

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];

// ── WA simulation data ──────────────────────────────────────────────────────

type WaMsg = { id: string; ini: string; color: string; who: string; where: string; time: string; text: string; photo: boolean };

const WA_INITIAL: WaMsg[] = [
  { id: 'i1', ini: 'JM', color: '#1d4ed8', who: 'Jean Müller',    where: 'Carrelage · Les Cèdres',    time: 'il y a 47 min', text: 'Pose carrelage salle de bain R2 terminée. 3 hommes. Début cuisine demain matin.', photo: false },
  { id: 'i2', ini: 'MW', color: '#15803d', who: 'Marc Weber',     where: 'Façade · Villa Strassen',    time: 'il y a 1h10',   text: 'Enduit façade nord appliqué 80m². Conditions météo ok. 4 hommes. On continue demain.', photo: true },
  { id: 'i3', ini: 'AW', color: '#7c3aed', who: 'André Wagner',   where: 'Maçonnerie · Bertrange',     time: 'il y a 1h45',   text: 'Dalle béton zone C coulée et vibrée. 6 hommes. Reprise dans 48h.', photo: false },
  { id: 'i4', ini: 'PK', color: '#b45309', who: 'Paul Klein',     where: 'Électricité · Windhof',      time: 'il y a 2h20',   text: 'Tirage câbles HTA terminé zone A. 4 hommes. RAS côté sécurité.', photo: true },
];

const WA_POOL: WaMsg[] = [
  { id: 'p1', ini: 'PS', color: '#15803d', who: 'Pierre Schmit',  where: 'Maçonnerie · Les Cèdres',    time: 'maintenant', text: 'Murs refend R+1 montés. Pose linteaux terminée. 5 hommes. Bon avancement.', photo: false },
  { id: 'p2', ini: 'TK', color: '#1d4ed8', who: 'Thomas Klein',   where: 'Carrelage · Esch-Belval',    time: 'maintenant', text: 'Couloir niveau 0 posé. 4 hommes. Découpe carrelage escaliers en cours.', photo: true },
  { id: 'p3', ini: 'DL', color: '#b45309', who: 'David Lux',      where: 'Électricité · Kirchberg',    time: 'maintenant', text: 'Tableau électrique bloc B terminé. 2 hommes. Contrôle qualité ok.', photo: false },
  { id: 'p4', ini: 'LH', color: '#7c3aed', who: 'Luc Hoffmann',   where: 'Façade · Differdange',       time: 'maintenant', text: 'Inspection façade arrière terminée. Photos envoyées. 2 hommes présents.', photo: true },
  { id: 'p5', ini: 'FB', color: '#15803d', who: 'François Becker', where: 'Maçonnerie · Hesperange',   time: 'maintenant', text: 'Chape salon terminée. 3 hommes. Séchage 48h. Prêt mardi.', photo: false },
  { id: 'p6', ini: 'SB', color: '#1d4ed8', who: 'Stefan Braun',   where: 'Carrelage · Hôtel Limpertsberg', time: 'maintenant', text: 'Hall principal terminé. 5 hommes. Début corridors étage 1 demain.', photo: true },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function statusPill(status: string) {
  if (status === 'OK')     return <span className="sp-ok">OK</span>;
  if (status === 'ALERTE') return <span className="sp-alerte">ALERTE</span>;
  return <span className="sp-partiel">PARTIEL</span>;
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  return `il y a ${h}h`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, valueColor }: { label: string; value: string | number; sub: string; valueColor: string }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400" style={{ fontFamily: 'monospace' }}>{label}</div>
      <div className="text-4xl font-extrabold leading-none tracking-tight" style={{ color: valueColor }}>{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}

function EquipeCard({ equipe, chantiers, onSendInstruction }: {
  equipe: string;
  chantiers: Chantier[];
  onSendInstruction: (equipe: string) => void;
}) {
  const info = EQUIPE_INFO[equipe];
  const hasAlerte = chantiers.some(c => c.status === 'ALERTE');
  const hasPartiel = chantiers.some(c => c.status === 'PARTIEL');
  const overallStatus = hasAlerte ? 'ALERTE' : hasPartiel ? 'PARTIEL' : 'OK';
  const totalWorkers = chantiers.reduce((sum, c) => {
    const lastRapport = c.rapports?.[0];
    return sum + (lastRapport?.homesJour || 0);
  }, 0);

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: info.color }} />
          <span className="text-sm font-bold text-slate-100">{info.label}</span>
        </div>
        {statusPill(overallStatus)}
      </div>

      {/* Chantiers list */}
      <div className="flex-1 px-3 py-3 space-y-2">
        {chantiers.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Aucun chantier actif</p>
        ) : (
          chantiers.slice(0, 3).map(c => {
            const lastRapport = c.rapports?.[0];
            return (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{c.nom}</div>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500">
                    {lastRapport && <span>{lastRapport.homesJour} hommes</span>}
                    <span>{c.ville}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                  <span className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                    {lastRapport ? relativeTime(lastRapport.date) : 'Aucun rapport'}
                  </span>
                  {statusPill(c.status)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-xs text-slate-400">{totalWorkers} hommes · {chantiers.length} chantier{chantiers.length > 1 ? 's' : ''}</span>
        <button
          onClick={() => onSendInstruction(equipe)}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Envoyer instruction →
        </button>
      </div>
    </div>
  );
}

function WaFeedPanel({ feed, onSimulate, instrEquipe, instrMsg, setInstrEquipe, setInstrMsg, onSend, toast }: {
  feed: WaMsg[];
  onSimulate: () => void;
  instrEquipe: string;
  instrMsg: string;
  setInstrEquipe: (v: string) => void;
  setInstrMsg: (v: string) => void;
  onSend: () => void;
  toast: string | null;
}) {
  return (
    <div className="rounded-xl flex flex-col overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-sm font-bold text-slate-100">Rapports WhatsApp</span>
        <button
          onClick={onSimulate}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded"
          style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
        >
          <Zap className="w-3 h-3" /> Simuler
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mx-3 mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-green-300 animate-fadeup" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> {toast}
        </div>
      )}

      {/* Feed */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: '260px' }}>
        {feed.map(m => (
          <div key={m.id} className="px-4 py-3 animate-fadeup" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: m.color }}
              >
                {m.ini}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200">{m.who}</div>
                <div className="text-xs text-slate-500">{m.where}</div>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0" style={{ fontFamily: 'monospace' }}>{m.time}</span>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed pl-9">{m.text}</div>
            {m.photo && (
              <div className="pl-9 mt-1">
                <span className="text-xs text-slate-500 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', fontFamily: 'monospace' }}>
                  📷 photo_terrain.jpg
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2" style={{ fontFamily: 'monospace' }}>
          Envoyer instruction via WhatsApp
        </div>
        <div className="flex gap-2">
          <select
            className="dk-select text-xs flex-shrink-0"
            style={{ width: '120px' }}
            value={instrEquipe}
            onChange={e => setInstrEquipe(e.target.value)}
          >
            {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_INFO[e].label}</option>)}
          </select>
          <input
            className="dk-input text-xs flex-1"
            placeholder="Instructions pour demain..."
            value={instrMsg}
            onChange={e => setInstrMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
          />
          <button
            onClick={onSend}
            className="flex-shrink-0 px-3 rounded-lg text-sm font-bold text-white transition-colors"
            style={{ background: '#2563eb' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MateriauxPanel({ items }: { items: DemandeMateriau[] }) {
  const emojis: Record<string, string> = { CARRELAGE: '🪨', MACONNERIE: '🧱', FACADE: '🏠', ELECTRICITE: '⚡' };
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-sm font-bold text-slate-100">Demandes matériaux</span>
        <span className="text-xs text-slate-500">{items.filter(i => i.statut === 'EN_ATTENTE').length} en attente</span>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: '340px' }}>
        {items.slice(0, 6).map(item => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              {emojis[item.equipe] || '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{item.materiau}</div>
              <div className="text-xs text-slate-500 truncate">{EQUIPE_INFO[item.equipe]?.label} · {item.chantier?.ville || ''}</div>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
              style={{
                background: item.urgence === 'CRITIQUE' || item.urgence === 'URGENT' ? 'rgba(220,38,38,0.15)' : 'rgba(22,163,74,0.15)',
                color: item.urgence === 'CRITIQUE' || item.urgence === 'URGENT' ? '#f87171' : '#4ade80',
                fontFamily: 'monospace',
              }}
            >
              {item.urgence}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-xs">Aucune demande en attente</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertesPanel({ items }: { items: Alerte[] }) {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-sm font-bold text-slate-100">Alertes actives</span>
        <span className="text-xs text-slate-500">{items.length} ouverte{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: '340px' }}>
        {items.slice(0, 5).map(a => (
          <div key={a.id} className="flex gap-3 items-start px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{
                background: a.type === 'PROBLEME_SECURITE' ? '#ef4444' : a.type === 'NON_RAPPORT' ? '#ef4444' : '#fbbf24',
                boxShadow: a.type !== 'MATERIAU_MANQUANT' ? '0 0 6px rgba(239,68,68,0.7)' : 'none',
                animation: a.type !== 'MATERIAU_MANQUANT' ? 'pulsedot 1.5s infinite' : 'none',
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 mb-0.5">
                {a.chantier?.nom} — {EQUIPE_INFO[a.equipe]?.label}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">{a.message}</div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-xs">Aucune alerte active</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RapportsTable({ materiaux }: { materiaux: DemandeMateriau[] }) {
  const [periode, setPeriode] = useState<'semaine' | 'mois'>('semaine');
  const now = new Date();
  const cutoff = new Date(now);
  if (periode === 'semaine') cutoff.setDate(cutoff.getDate() - 7);
  else cutoff.setMonth(cutoff.getMonth() - 1);
  const filtered = materiaux.filter(m => new Date(m.demandeLe) >= cutoff);

  const statutColors: Record<string, { bg: string; color: string }> = {
    EN_ATTENTE: { bg: 'rgba(220,38,38,0.15)', color: '#f87171' },
    APPROUVE:   { bg: 'rgba(37,99,235,0.15)', color: '#60a5fa' },
    LIVRE:      { bg: 'rgba(22,163,74,0.15)', color: '#4ade80' },
    REFUSE:     { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
  };
  const statutLabels: Record<string, string> = {
    EN_ATTENTE: 'EN ATTENTE', APPROUVE: 'APPROUVÉ', LIVRE: 'LIVRÉ', REFUSE: 'REFUSÉ',
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-100">Rapport matériaux</span>
        </div>
        <div className="flex gap-2">
          {(['semaine', 'mois'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                periode === p
                  ? { background: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.25)' }
                  : { background: 'transparent', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {p === 'semaine' ? 'Cette semaine' : 'Ce mois'}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Matériau', 'Équipe', 'Chantier', 'Qté', 'Date', 'Statut'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600" style={{ fontFamily: 'monospace' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const sc = statutColors[m.statut] || statutColors.EN_ATTENTE;
              return (
                <tr key={m.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-3 text-xs font-semibold text-slate-200">{m.materiau}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{EQUIPE_INFO[m.equipe]?.label}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{m.chantier?.nom}</td>
                  <td className="px-5 py-3 text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>{m.quantite} {m.unite}</td>
                  <td className="px-5 py-3 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>{new Date(m.demandeLe).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: sc.bg, color: sc.color, fontFamily: 'monospace' }}>
                      {statutLabels[m.statut] || m.statut}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-600">Aucune donnée pour cette période</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'equipes' | 'rapports'>('equipes');
  const [waFeed, setWaFeed] = useState<WaMsg[]>(WA_INITIAL);
  const [waIdx, setWaIdx] = useState(0);
  const [instrEquipe, setInstrEquipe] = useState('CARRELAGE');
  const [instrMsg, setInstrMsg] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const { data: kpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: dashboardApi.getKpis,
    refetchInterval: 60000,
  });

  const { data: chantiers = [] } = useQuery({
    queryKey: ['chantiers-actifs'],
    queryFn: () => chantiersApi.getAll({ actif: true }),
  });

  const { data: materiaux = [] } = useQuery({
    queryKey: ['mat-attente'],
    queryFn: () => materiauxApi.getAll({ statut: 'EN_ATTENTE' }),
  });

  const { data: alertes = [] } = useQuery({
    queryKey: ['alertes-open'],
    queryFn: () => alertesApi.getAll({ resolue: false }),
  });

  const allMateriaux = useQuery({
    queryKey: ['mat-all'],
    queryFn: () => materiauxApi.getAll({}),
  });

  const instrMutation = useMutation({
    mutationFn: ({ equipe, message }: { equipe: string; message: string }) =>
      whatsappApi.envoyerInstruction(equipe, message),
    onSuccess: () => {
      showToast(`Instruction envoyée → ${EQUIPE_INFO[instrEquipe]?.label} via WhatsApp`);
    },
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const simWA = () => {
    const m = { ...WA_POOL[waIdx % WA_POOL.length], id: `sim-${Date.now()}`, time: 'maintenant' };
    setWaFeed(prev => [m, ...prev]);
    setWaIdx(i => i + 1);
    showToast(`Rapport reçu — ${m.who} · ${m.where.split('·')[1]?.trim()}`);
  };

  const sendInstruction = () => {
    if (!instrMsg.trim()) return;
    instrMutation.mutate({ equipe: instrEquipe, message: instrMsg });
    setInstrMsg('');
  };

  const handleSendInstructionFromCard = (equipe: string) => {
    setInstrEquipe(equipe);
    setActiveTab('equipes');
    showToast(`Instruction envoyée → ${EQUIPE_INFO[equipe]?.label} via WhatsApp`);
  };

  // Group chantiers by équipe type
  const chantiersByEquipe: Record<string, Chantier[]> = {};
  for (const eq of EQUIPES) chantiersByEquipe[eq] = [];
  for (const c of chantiers) {
    for (const link of (c.equipes || [])) {
      const type = link.configEquipe.type;
      if (chantiersByEquipe[type]) chantiersByEquipe[type].push(c);
    }
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dateCapitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div className="p-5 md:p-6 space-y-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-slate-100">Tableau de bord — {dateCapitalized}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mis à jour automatiquement · {kpis?.kpis.chantiersActifs || 0} chantiers actifs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {kpis?.kpis.chantiersActifs || 0} chantiers actifs
          </div>
          {(kpis?.kpis.alertesOuvertes || 0) > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" style={{ animation: 'pulsedot 1.5s infinite' }} />
              {kpis?.kpis.alertesOuvertes} alerte{(kpis?.kpis.alertesOuvertes || 0) > 1 ? 's' : ''}
            </div>
          )}
          <button
            onClick={simWA}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
            style={{ background: '#2563eb' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            <Zap className="w-3.5 h-3.5" /> Simuler rapport WA
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="Équipes actives"
          value={kpis?.kpis.chantiersActifs || 0}
          sub="sur 12 planifiées aujourd'hui"
          valueColor="#4ade80"
        />
        <KpiCard
          label="Sans rapport"
          value={kpis?.kpis.alertesOuvertes || 0}
          sub="alertes WA envoyées auto"
          valueColor="#f87171"
        />
        <KpiCard
          label="Matériaux demandés"
          value={kpis?.kpis.demandesUrgentes || 0}
          sub="demandes terrain en attente"
          valueColor="#fbbf24"
        />
        <KpiCard
          label="Hommes · jour"
          value={kpis?.kpis.rapportsAujourdhui ? kpis.kpis.rapportsAujourdhui * 4 : 0}
          sub="enregistrés via WhatsApp"
          valueColor="#60a5fa"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['equipes', 'Équipes & Chantiers'], ['rapports', 'Rapports']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={
              activeTab === key
                ? { background: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.25)' }
                : { background: 'transparent', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Équipes */}
      {activeTab === 'equipes' && (
        <>
          {/* 2x2 team grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EQUIPES.map(eq => (
              <EquipeCard
                key={eq}
                equipe={eq}
                chantiers={chantiersByEquipe[eq] || []}
                onSendInstruction={handleSendInstructionFromCard}
              />
            ))}
          </div>

          {/* Bottom 3 panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <WaFeedPanel
              feed={waFeed}
              onSimulate={simWA}
              instrEquipe={instrEquipe}
              instrMsg={instrMsg}
              setInstrEquipe={setInstrEquipe}
              setInstrMsg={setInstrMsg}
              onSend={sendInstruction}
              toast={toast}
            />
            <MateriauxPanel items={materiaux} />
            <AlertesPanel items={alertes} />
          </div>
        </>
      )}

      {/* Tab: Rapports */}
      {activeTab === 'rapports' && (
        <RapportsTable materiaux={allMateriaux.data || []} />
      )}

    </div>
  );
}
