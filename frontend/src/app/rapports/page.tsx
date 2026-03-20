'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rapportsApi } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { FileText, Download, AlertTriangle, MessageSquare, User } from 'lucide-react';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

export default function RapportsPage() {
  const [equipeFilter, setEquipeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const { data: rapports, isLoading } = useQuery({
    queryKey: ['rapports', equipeFilter, dateFilter],
    queryFn: () => rapportsApi.getAll({ equipe: equipeFilter || undefined, date: dateFilter }),
  });

  const downloadPdf = (type: 'semaine' | 'mois') => {
    const base = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/rapports/pdf/${type}`;
    const params = equipeFilter ? `?equipe=${equipeFilter}` : '';
    window.open(base + params, '_blank');
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rapports?.length || 0} rapport(s)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadPdf('semaine')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> PDF Semaine
          </button>
          <button
            onClick={() => downloadPdf('mois')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> PDF Mois
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={equipeFilter}
          onChange={e => setEquipeFilter(e.target.value)}
        >
          <option value="">Toutes les équipes</option>
          {EQUIPES.map(e => <option key={e} value={e}>{EQUIPE_LABELS[e]}</option>)}
        </select>
      </div>

      {/* Rapports */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent" />
        </div>
      ) : rapports?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <FileText className="w-12 h-12 mb-3" />
          <p className="text-sm">Aucun rapport pour cette période</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rapports?.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.chantier?.nom}</h3>
                  <p className="text-xs text-gray-500">{r.chantier?.adresse}, {r.chantier?.ville}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {r.source === 'WHATSAPP' && (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </span>
                  )}
                  {r.source === 'MANUEL' && (
                    <span className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
                      <User className="w-3 h-3" /> Manuel
                    </span>
                  )}
                  <Badge variant="default">{EQUIPE_LABELS[r.equipe]}</Badge>
                </div>
              </div>

              <div className="flex gap-4 mb-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Avancement</span>
                    <span className="text-sm font-semibold text-gray-900">{r.avancement}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.avancement}%`,
                        backgroundColor: r.avancement >= 75 ? '#27ae60' : r.avancement >= 50 ? '#f39c12' : '#e74c3c',
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">H·Jour</div>
                    <div className="text-sm font-semibold">{r.homesJour}</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700">{r.contenu}</p>

              {r.problemes && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{r.problemes}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {new Date(r.date).toLocaleDateString('fr-FR', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
