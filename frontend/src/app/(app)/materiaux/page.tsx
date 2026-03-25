'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materiauxApi, chantiersApi } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { Package, Plus, Download, X, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  LIVRE: 'Livré',
  REFUSE: 'Refusé',
};

const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  APPROUVE: 'bg-blue-100 text-blue-800',
  LIVRE: 'bg-green-100 text-green-800',
  REFUSE: 'bg-red-100 text-red-800',
};

function CreateDemandeModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    chantierId: '',
    equipe: 'CARRELAGE',
    materiau: '',
    quantite: 1,
    unite: 'm²',
    urgence: 'NORMAL',
    notes: '',
  });

  const { data: chantiers } = useQuery({
    queryKey: ['chantiers-select'],
    queryFn: () => chantiersApi.getAll({ actif: true }),
  });

  const mutation = useMutation({
    mutationFn: materiauxApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiaux'] });
      onClose();
    },
  });

  const filteredChantiers = chantiers?.filter(c =>
    !form.equipe || c.equipes?.some(e => e.configEquipe.type === form.equipe)
  ) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Demande de matériau</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.equipe}
                onChange={e => setForm(f => ({ ...f, equipe: e.target.value, chantierId: '' }))}
              >
                {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chantier *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.chantierId}
                onChange={e => setForm(f => ({ ...f, chantierId: e.target.value }))}
              >
                <option value="">Sélectionner...</option>
                {filteredChantiers.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matériau *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.materiau}
              onChange={e => setForm(f => ({ ...f, materiau: e.target.value }))}
              placeholder="Ex: Carrelage grès cérame 60x60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.quantite}
                onChange={e => setForm(f => ({ ...f, quantite: +e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.unite}
                onChange={e => setForm(f => ({ ...f, unite: e.target.value }))}
              >
                {['m²', 'm³', 'ml', 'kg', 't', 'pcs', 'sacs', 'boîtes', 'palettes'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.urgence}
                onChange={e => setForm(f => ({ ...f, urgence: e.target.value }))}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITIQUE">Critique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Référence, informations supplémentaires..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={!form.materiau || !form.chantierId || mutation.isPending}
            className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
          >
            {mutation.isPending ? 'Création...' : 'Créer la demande'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MateriauxPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [equipeFilter, setEquipeFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [urgenceFilter, setUrgenceFilter] = useState('');
  const [toast, setToast] = useState<{ id: string; materiau: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const { data: demandes, isLoading } = useQuery({
    queryKey: ['materiaux', equipeFilter, statutFilter, urgenceFilter],
    queryFn: () => materiauxApi.getAll({
      equipe: equipeFilter || undefined,
      statut: statutFilter || undefined,
      urgence: urgenceFilter || undefined,
    }),
  });

  const statutMutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: string }) =>
      materiauxApi.updateStatut(id, statut),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materiaux'] });
      if (variables.statut === 'APPROUVE') {
        const d = demandes?.find(d => d.id === variables.id);
        if (d) setToast({ id: d.id, materiau: d.materiau });
      }
    },
  });

  const downloadPdf = (type: 'semaine' | 'mois' | 'chantier') => {
    const params: Record<string, string> = {};
    if (equipeFilter) params.equipe = equipeFilter;
    window.open(materiauxApi.pdfUrl(type, Object.keys(params).length ? params : undefined), '_blank');
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {showCreate && <CreateDemandeModal onClose={() => setShowCreate(false)} />}

      {/* Toast WhatsApp confirmation */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Demande approuvée</p>
            <p className="text-xs text-green-100">WhatsApp envoyé à l'équipe · {toast.materiau}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-2 text-green-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Matériaux</h1>
          <p className="text-sm text-gray-500 mt-0.5">{demandes?.length || 0} demande(s)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadPdf('semaine')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF </span>Semaine
          </button>
          <button
            onClick={() => downloadPdf('mois')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF </span>Mois
          </button>
          <button
            onClick={() => downloadPdf('chantier')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <Building2 className="w-4 h-4" /> PDF Chantier
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nouvelle </span>Demande
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={equipeFilter}
          onChange={e => setEquipeFilter(e.target.value)}
        >
          <option value="">Toutes les équipes</option>
          {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={statutFilter}
          onChange={e => setStatutFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={urgenceFilter}
          onChange={e => setUrgenceFilter(e.target.value)}
        >
          <option value="">Toutes urgences</option>
          <option value="CRITIQUE">Critique</option>
          <option value="URGENT">Urgent</option>
          <option value="NORMAL">Normal</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent" />
        </div>
      ) : demandes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <Package className="w-12 h-12 mb-3" />
          <p className="text-sm">Aucune demande de matériau</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Matériau</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Chantier</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Équipe</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Qté</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Urgence</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demandes?.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-gray-900">{d.materiau}</div>
                    {d.notes && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-48">{d.notes}</div>}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {d.chantier?.nom}
                    <div className="text-xs text-gray-400">{d.chantier?.ville}</div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="default" className="text-xs">{EQUIPE_LABELS[d.equipe]}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                    {d.quantite} {d.unite}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      d.urgence === 'CRITIQUE' ? 'bg-red-100 text-red-800' :
                      d.urgence === 'URGENT' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {d.urgence === 'CRITIQUE' && <AlertTriangle className="w-3 h-3" />}
                      {d.urgence}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${STATUT_COLORS[d.statut]}`}
                      value={d.statut}
                      onChange={e => statutMutation.mutate({ id: d.id, statut: e.target.value })}
                    >
                      {Object.entries(STATUT_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {new Date(d.demandeLe).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-4" />
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
