'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertesApi } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const TYPE_LABELS: Record<string, string> = {
  NON_RAPPORT: 'Rapport manquant',
  MATERIAU_MANQUANT: 'Matériau manquant',
  PROBLEME_SECURITE: 'Problème sécurité',
};

export default function AlertesPage() {
  const queryClient = useQueryClient();
  const [equipeFilter, setEquipeFilter] = useState('');
  const [showResolues, setShowResolues] = useState(false);

  const { data: alertes, isLoading } = useQuery({
    queryKey: ['alertes', equipeFilter, showResolues],
    queryFn: () => alertesApi.getAll({
      equipe: equipeFilter || undefined,
      resolue: showResolues ? undefined : false,
    }),
  });

  const resoudreMutation = useMutation({
    mutationFn: alertesApi.resoudre,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alertes'] }),
  });

  const ouvertes = alertes?.filter(a => !a.resolue).length || 0;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {ouvertes} alerte{ouvertes !== 1 ? 's' : ''} ouverte{ouvertes !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={equipeFilter}
          onChange={e => setEquipeFilter(e.target.value)}
        >
          <option value="">Toutes les équipes</option>
          {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
        </select>
        <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={showResolues}
            onChange={e => setShowResolues(e.target.checked)}
            className="rounded"
          />
          Afficher résolues
        </label>
      </div>

      {/* Alertes */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent" />
        </div>
      ) : alertes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
          <p className="text-sm">Aucune alerte active</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertes?.map(alerte => (
            <div
              key={alerte.id}
              className={`bg-white rounded-xl shadow-sm border p-5 ${
                alerte.resolue ? 'border-gray-100 opacity-70' : 'border-red-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    alerte.resolue ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {alerte.resolue
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <AlertTriangle className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        {TYPE_LABELS[alerte.type] || alerte.type}
                      </span>
                      <Badge variant="default">{EQUIPE_LABELS[alerte.equipe] || alerte.equipe}</Badge>
                      {alerte.resolue && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">Résolue</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800">{alerte.message}</p>
                    {alerte.chantier && (
                      <p className="text-xs text-gray-500 mt-1">{alerte.chantier.nom} — {alerte.chantier.adresse}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(alerte.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                      {alerte.resolueAt && (
                        <span className="ml-2 text-green-600">
                          · Résolue le {new Date(alerte.resolueAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!alerte.resolue && (
                  <button
                    onClick={() => resoudreMutation.mutate(alerte.id)}
                    disabled={resoudreMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 flex-shrink-0"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Résoudre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
