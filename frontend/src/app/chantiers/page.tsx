'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chantiersApi, type Chantier } from '@/lib/api';
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

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const STATUS_LABELS: Record<string, string> = {
  OK: 'OK',
  ALERTE: 'Alerte',
  PARTIEL: 'Partiel',
};

function CreateChantierModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    equipe: 'CARRELAGE',
    dateDebut: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: chantiersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.equipe}
                onChange={e => setForm(f => ({ ...f, equipe: e.target.value }))}
              >
                {EQUIPES.map(e => (
                  <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>
                ))}
              </select>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
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
    <div className="p-6 space-y-5">
      {showCreate && <CreateChantierModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chantiers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} chantier(s)</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800"
        >
          <Plus className="w-4 h-4" />
          Nouveau chantier
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
  const alertesCount = chantier.alertes?.filter(a => !a.resolue).length || 0;

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
          {STATUS_LABELS[chantier.status]}
        </Badge>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <Badge variant="default" className="text-xs">
          {EQUIPE_LABELS[chantier.equipe]}
        </Badge>
        {alertesCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
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
