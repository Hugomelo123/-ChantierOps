'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, alertesApi } from '@/lib/api';
import KpiCard from '@/components/ui/KpiCard';
import Badge from '@/components/ui/Badge';
import {
  Building2,
  AlertTriangle,
  FileText,
  Package,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const EQUIPE_COLORS: Record<string, string> = {
  CARRELAGE: '#3b82f6',
  MACONNERIE: '#d97706',
  FACADE: '#059669',
  ELECTRICITE: '#eab308',
};

const STATUS_COLORS: Record<string, string> = {
  OK: '#27ae60',
  ALERTE: '#e74c3c',
  PARTIEL: '#f39c12',
};

export default function Dashboard() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: dashboardApi.getKpis,
    refetchInterval: 30000,
  });

  const { data: alertes } = useQuery({
    queryKey: ['alertes-ouvertes'],
    queryFn: () => alertesApi.getAll({ resolue: false }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  const statusData = Object.entries(kpis?.chantiersByStatus || {}).map(([k, v]) => ({
    name: k,
    value: v,
    color: STATUS_COLORS[k] || '#666',
  }));

  const equipeData = Object.entries(kpis?.chantiersByEquipe || {}).map(([k, v]) => ({
    name: EQUIPE_LABELS[k] || k,
    chantiers: v,
    alertes: kpis?.alertesByEquipe?.[k] || 0,
  }));

  const rapports7jGrouped: Record<string, { date: string; hj: number }> = {};
  for (const r of kpis?.rapports7j || []) {
    const d = new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    if (!rapports7jGrouped[d]) rapports7jGrouped[d] = { date: d, hj: 0 };
    rapports7jGrouped[d].hj += r.homesJour;
  }
  const rapports7jData = Object.values(rapports7jGrouped);

  const now = new Date();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Mis à jour automatiquement
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Chantiers actifs"
          value={kpis?.kpis.chantiersActifs || 0}
          icon={Building2}
          color="blue"
          subtitle="En cours"
        />
        <KpiCard
          title="Alertes ouvertes"
          value={kpis?.kpis.alertesOuvertes || 0}
          icon={AlertTriangle}
          color="red"
          subtitle="À traiter"
        />
        <KpiCard
          title="Rapports aujourd'hui"
          value={kpis?.kpis.rapportsAujourdhui || 0}
          icon={FileText}
          color="green"
          subtitle="Reçus"
        />
        <KpiCard
          title="Demandes urgentes"
          value={kpis?.kpis.demandesUrgentes || 0}
          icon={Package}
          color="orange"
          subtitle="Matériaux"
        />
        <KpiCard
          title="Hommes·jour / mois"
          value={kpis?.kpis.homesJourMois || 0}
          icon={Users}
          color="yellow"
          subtitle="Ce mois-ci"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* H/J per day chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Hommes·jour — 7 derniers jours</h2>
          {rapports7jData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rapports7jData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hj" name="H/J" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Statut des chantiers</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Aucun chantier actif
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chantiers en alerte */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Chantiers en alerte</h2>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          {kpis?.chantiersAlerte && kpis.chantiersAlerte.length > 0 ? (
            <div className="space-y-3">
              {kpis.chantiersAlerte.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.nom}</p>
                    <p className="text-xs text-gray-500">{c.adresse}, {c.ville}</p>
                    <Badge variant="alerte" className="mt-1">{EQUIPE_LABELS[c.equipe] || c.equipe}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
              <p className="text-sm">Aucune alerte active</p>
            </div>
          )}
        </div>

        {/* Demandes urgentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Matériaux urgents</h2>
            <Package className="w-5 h-5 text-orange-500" />
          </div>
          {kpis?.dernieresUrgences && kpis.dernieresUrgences.length > 0 ? (
            <div className="space-y-3">
              {kpis.dernieresUrgences.map((d) => (
                <div key={d.id} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <Package className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.materiau}</p>
                    <p className="text-xs text-gray-500">
                      {d.quantite} {d.unite} · {d.chantier?.nom}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={d.urgence.toLowerCase() as any}>{d.urgence}</Badge>
                      <Badge variant="default">{EQUIPE_LABELS[d.equipe] || d.equipe}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
              <p className="text-sm">Aucune demande urgente</p>
            </div>
          )}
        </div>
      </div>

      {/* Equipe overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Vue par équipe</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={equipeData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="chantiers" name="Chantiers" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
            <Bar dataKey="alertes" name="Alertes" fill="#e74c3c" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
