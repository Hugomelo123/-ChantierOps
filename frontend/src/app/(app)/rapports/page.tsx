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
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">Rapports</h1>
          <p className="text-sm text-slate-400 mt-0.5">{rapports?.length || 0} rapport(s)</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => downloadPdf('semaine')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF </span>Semaine
          </button>
          <button
            onClick={() => downloadPdf('mois')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF </span>Mois
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          className="dk-input"
          style={{ width: 'auto' }}
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <select
          className="dk-select"
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
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : rapports?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <FileText className="w-12 h-12 mb-3" />
          <p className="text-sm">Aucun rapport pour cette période</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rapports?.map(r => (
            <div
              key={r.id}
              className="rounded-xl p-4 md:p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-100 truncate">{r.chantier?.nom}</h3>
                  <p className="text-xs text-slate-500 truncate">{r.chantier?.adresse}, {r.chantier?.ville}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-end flex-shrink-0">
                  {r.source === 'WHATSAPP' && (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80' }}>
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </span>
                  )}
                  {r.source === 'MANUEL' && (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
                      <User className="w-3 h-3" /> Manuel
                    </span>
                  )}
                  <Badge variant="default">
                    {(r as any).configEquipe?.nom || EQUIPE_LABELS[r.equipe]}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-4 mb-3">
                <div className="flex-1 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Avancement</span>
                    <span className="text-sm font-semibold text-slate-200">{r.avancement}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.avancement}%`,
                        background: r.avancement >= 75 ? '#16a34a' : r.avancement >= 50 ? '#d97706' : '#dc2626',
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <User className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs text-slate-500">H·Jour</div>
                    <div className="text-sm font-semibold text-slate-200">{r.homesJour}</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300">{r.contenu}</p>

              {r.problemes && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-400 p-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.1)' }}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{r.problemes}</p>
                </div>
              )}

              <p className="text-xs text-slate-600 mt-3">
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
