'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chantiersApi, equipesApi, type Chantier, type ConfigEquipe, type Equipe } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  ChevronRight,
  X,
} from 'lucide-react';

const EQUIPES: Equipe[] = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};
const EQUIPE_COLORS: Record<string, string> = {
  CARRELAGE: 'bg-blue-50 text-blue-700',
  MACONNERIE: 'bg-orange-50 text-orange-700',
  FACADE: 'bg-green-50 text-green-700',
  ELECTRICITE: 'bg-yellow-50 text-yellow-700',
};

function CreateChantierModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: allEquipes = [] } = useQuery<ConfigEquipe[]>({
    queryKey: ['equipes-config'],
    queryFn: equipesApi.getAll,
  });

  const [form, setForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    dateDebut: new Date().toISOString().split('T')[0],
    notes: '',
    teamIds: [] as string[],
  });

  const toggleTeam = (id: string) => {
    setForm(f => ({
      ...f,
      teamIds: f.teamIds.includes(id)
        ? f.teamIds.filter(t => t !== id)
        : [...f.teamIds, id],
    }));
  };

  const mutation = useMutation({
    mutationFn: chantiersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      onClose();
    },
  });

  const byType = EQUIPES.reduce((acc, type) => {
    acc[type] = (allEquipes as ConfigEquipe[]).filter(e => e.type === type);
    return acc;
  }, {} as Record<Equipe, ConfigEquipe[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Nouveau chantier</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du chantier *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              placeholder="Ex: Résidence Les Cèdres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.adresse}
              onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
              placeholder="12 Rue de la Paix"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.ville}
                onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                placeholder="Luxembourg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.codePostal}
                onChange={e => setForm(f => ({ ...f, codePostal: e.target.value }))}
                placeholder="L-1234"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début *</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.dateDebut}
              onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))}
            />
          </div>

          {/* Multi-select equipes grouped by type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipes assignées
              {form.teamIds.length > 0 && (
                <span className="ml-2 text-xs text-primary-600 font-normal">{form.teamIds.length} sélectionnée(s)</span>
              )}
            </label>
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-52 overflow-y-auto">
              {EQUIPES.map(type => {
                const teams = byType[type];
                if (teams.length === 0) return null;
                return (
                  <div key={type}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{EQUIPE_LABELS[type]}</p>
                    <div className="space-y-1 pl-2">
                      {teams.map(eq => (
                        <label key={eq.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={form.teamIds.includes(eq.id)}
                            onChange={() => toggleTeam(eq.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{eq.nom}</span>
                          <span className="text-xs text-gray-400">{eq.chefNom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
              {allEquipes.length === 0 && (
                <p className="text-xs text-gray-400 italic">Aucune équipe configurée — allez dans Paramètres d'abord</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={!form.nom || !form.adresse || !form.ville || mutation.isPending}
            className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Chantiers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} chantier(s)</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau chantier</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Rechercher un chantier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={equipeFilter}
          onChange={e => setEquipeFilter(e.target.value)}
        >
          <option value="">Toutes les équipes</option>
          {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="OK">OK</option>
          <option value="ALERTE">Alerte</option>
          <option value="PARTIEL">Partiel</option>
        </select>
      </div>

      {/* Chantiers grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <Building2 className="w-12 h-12 mb-3" />
          <p className="text-sm">Aucun chantier trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((chantier) => (
            <ChantierCard
              key={chantier.id}
              chantier={chantier}
              onClick={() => router.push(`/chantiers/${chantier.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChantiersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent" /></div>}>
      <ChantiersContent />
    </Suspense>
  );
}

function ChantierCard({ chantier, onClick }: { chantier: Chantier; onClick: () => void }) {
  const lastRapport = chantier.rapports?.[0];
  const alertesCount = chantier.alertes?.filter(a => !a.resolue).length || chantier._count?.alertes || 0;
  const equipes = chantier.equipes || [];

  // Deduplicate by type for display
  const typesSeen = new Set<string>();
  const uniqueTypes = equipes.filter(e => {
    if (typesSeen.has(e.configEquipe.type)) return false;
    typesSeen.add(e.configEquipe.type);
    return true;
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{chantier.nom}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-500 truncate">{chantier.adresse}, {chantier.ville}</p>
          </div>
        </div>
        <Badge variant={chantier.status.toLowerCase() as any} className="ml-2 flex-shrink-0">
          {chantier.status}
        </Badge>
      </div>

      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        {uniqueTypes.map(e => (
          <span
            key={e.configEquipe.type}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${EQUIPE_COLORS[e.configEquipe.type]}`}
          >
            {EQUIPE_LABELS[e.configEquipe.type]}
          </span>
        ))}
        {equipes.length > uniqueTypes.length && (
          <span className="text-xs text-gray-400">+{equipes.length - uniqueTypes.length} équipe(s)</span>
        )}
        {alertesCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-red-600 font-medium ml-auto">
            <AlertTriangle className="w-3 h-3" />
            {alertesCount} alerte{alertesCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="border-t border-gray-50 pt-3 mt-3 flex items-center justify-between text-xs text-gray-500">
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
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}
