'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chantiersApi, equipesApi, type Chantier, type ConfigEquipe, type Equipe } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building2, Plus, Search, MapPin, Calendar, Users, AlertTriangle, ChevronRight, X } from 'lucide-react';

const EQUIPES: Equipe[] = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};
const EQUIPE_COLORS: Record<string, { bg: string; color: string }> = {
  CARRELAGE:   { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  MACONNERIE:  { bg: 'rgba(217,119,6,0.15)',  color: '#fbbf24' },
  FACADE:      { bg: 'rgba(22,163,74,0.15)',   color: '#4ade80' },
  ELECTRICITE: { bg: 'rgba(124,58,237,0.15)',  color: '#a78bfa' },
};

function CreateChantierModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: allEquipes = [] } = useQuery<ConfigEquipe[]>({
    queryKey: ['equipes-config'],
    queryFn: equipesApi.getAll,
  });

  const [form, setForm] = useState({
    nom: '', adresse: '', ville: '', codePostal: '',
    dateDebut: new Date().toISOString().split('T')[0],
    notes: '', teamIds: [] as string[],
  });

  const toggleTeam = (id: string) => {
    setForm(f => ({
      ...f,
      teamIds: f.teamIds.includes(id) ? f.teamIds.filter(t => t !== id) : [...f.teamIds, id],
    }));
  };

  const mutation = useMutation({
    mutationFn: chantiersApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chantiers'] }); onClose(); },
  });

  const byType = EQUIPES.reduce((acc, type) => {
    acc[type] = (allEquipes as ConfigEquipe[]).filter(e => e.type === type);
    return acc;
  }, {} as Record<Equipe, ConfigEquipe[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg mx-4 rounded-xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#1a2f4a', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-bold text-slate-100">Nouveau chantier</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nom du chantier *</label>
            <input className="dk-input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex: Résidence Les Cèdres" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Adresse *</label>
            <input className="dk-input" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="12 Rue de la Paix" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ville *</label>
              <input className="dk-input" value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} placeholder="Luxembourg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Code postal *</label>
              <input className="dk-input" value={form.codePostal} onChange={e => setForm(f => ({ ...f, codePostal: e.target.value }))} placeholder="L-1234" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date début *</label>
            <input type="date" className="dk-input" value={form.dateDebut} onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Équipes assignées {form.teamIds.length > 0 && <span className="text-blue-400 ml-1">{form.teamIds.length} sélectionnée(s)</span>}
            </label>
            <div
              className="rounded-lg p-3 space-y-2 max-h-52 overflow-y-auto"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {EQUIPES.map(type => {
                const teams = byType[type];
                if (teams.length === 0) return null;
                return (
                  <div key={type}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1" style={{ fontFamily: 'monospace' }}>{EQUIPE_LABELS[type]}</p>
                    <div className="space-y-1 pl-2">
                      {teams.map(eq => (
                        <label key={eq.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.teamIds.includes(eq.id)}
                            onChange={() => toggleTeam(eq.id)}
                            className="rounded"
                          />
                          <span className="text-sm text-slate-300">{eq.nom}</span>
                          <span className="text-xs text-slate-500">{eq.chefNom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              {allEquipes.length === 0 && (
                <p className="text-xs text-slate-500 italic">Aucune équipe configurée — allez dans Paramètres d'abord</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Notes</label>
            <textarea
              className="dk-input resize-none"
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Annuler
          </button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={!form.nom || !form.adresse || !form.ville || mutation.isPending}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: '#2563eb' }}
          >
            {mutation.isPending ? 'Création...' : 'Créer le chantier'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChantiersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [equipeFilter, setEquipeFilter] = useState(searchParams.get('equipe') || '');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: chantiers, isLoading } = useQuery({
    queryKey: ['chantiers', equipeFilter],
    queryFn: () => chantiersApi.getAll({ equipe: equipeFilter || undefined }),
  });

  const filtered = chantiers?.filter(c => {
    const matchSearch = !search || c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.adresse.toLowerCase().includes(search.toLowerCase()) ||
      c.ville.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  }) || [];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {showCreate && <CreateChantierModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">Chantiers</h1>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} chantier(s)</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0 transition-colors"
          style={{ background: '#2563eb' }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau chantier</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="dk-input pl-9"
            placeholder="Rechercher un chantier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="dk-select" value={equipeFilter} onChange={e => setEquipeFilter(e.target.value)}>
          <option value="">Toutes les équipes</option>
          {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
        </select>
        <select className="dk-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="OK">OK</option>
          <option value="ALERTE">Alerte</option>
          <option value="PARTIEL">Partiel</option>
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <Building2 className="w-12 h-12 mb-3" />
          <p className="text-sm">Aucun chantier trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(chantier => (
            <ChantierCard key={chantier.id} chantier={chantier} onClick={() => router.push(`/chantiers/${chantier.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChantiersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" /></div>}>
      <ChantiersContent />
    </Suspense>
  );
}

function ChantierCard({ chantier, onClick }: { chantier: Chantier; onClick: () => void }) {
  const lastRapport = chantier.rapports?.[0];
  const alertesCount = chantier.alertes?.filter(a => !a.resolue).length || chantier._count?.alertes || 0;
  const equipes = chantier.equipes || [];
  const typesSeen = new Set<string>();
  const uniqueTypes = equipes.filter(e => {
    if (typesSeen.has(e.configEquipe.type)) return false;
    typesSeen.add(e.configEquipe.type);
    return true;
  });

  const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
    OK:      { bg: 'rgba(22,163,74,0.12)',   color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
    ALERTE:  { bg: 'rgba(220,38,38,0.1)',    color: '#f87171', border: 'rgba(248,113,113,0.2)' },
    PARTIEL: { bg: 'rgba(217,119,6,0.1)',    color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  };
  const ss = statusStyles[chantier.status] || statusStyles.OK;

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-5 cursor-pointer transition-all"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-100 truncate">{chantier.nom}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 truncate">{chantier.adresse}, {chantier.ville}</p>
          </div>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
          style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}
        >
          {chantier.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {uniqueTypes.map(e => {
          const ec = EQUIPE_COLORS[e.configEquipe.type];
          return (
            <span key={e.configEquipe.type} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ec.bg, color: ec.color }}>
              {EQUIPE_LABELS[e.configEquipe.type]}
            </span>
          );
        })}
        {alertesCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-semibold ml-auto" style={{ color: '#f87171' }}>
            <AlertTriangle className="w-3 h-3" /> {alertesCount} alerte{alertesCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(chantier.dateDebut).toLocaleDateString('fr-FR')}
        </div>
        {lastRapport && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{lastRapport.avancement}%</span>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-slate-700" />
      </div>
    </div>
  );
}
