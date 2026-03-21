import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Types
export type Equipe = 'CARRELAGE' | 'MACONNERIE' | 'FACADE' | 'ELECTRICITE';
export type StatusChantier = 'OK' | 'ALERTE' | 'PARTIEL';
export type UrgenceMateriau = 'NORMAL' | 'URGENT' | 'CRITIQUE';
export type StatutDemande = 'EN_ATTENTE' | 'APPROUVE' | 'LIVRE' | 'REFUSE';

export interface Chantier {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  equipe: Equipe;
  status: StatusChantier;
  dateDebut: string;
  dateFin?: string;
  actif: boolean;
  notes?: string;
  rapports?: Rapport[];
  alertes?: Alerte[];
  _count?: { rapports: number; alertes: number; demandesMat: number };
}

export interface Rapport {
  id: string;
  chantierId: string;
  equipe: Equipe;
  date: string;
  contenu: string;
  homesJour: number;
  avancement: number;
  problemes?: string;
  source: string;
  chantier?: { nom: string; adresse: string; ville: string };
}

export interface Alerte {
  id: string;
  chantierId: string;
  equipe: Equipe;
  type: string;
  message: string;
  resolue: boolean;
  resolueAt?: string;
  createdAt: string;
  chantier?: { nom: string; adresse: string };
}

export interface DemandeMateriau {
  id: string;
  chantierId: string;
  equipe: Equipe;
  materiau: string;
  quantite: number;
  unite: string;
  urgence: UrgenceMateriau;
  statut: StatutDemande;
  notes?: string;
  demandeLe: string;
  chantier?: { nom: string; adresse: string; ville: string };
}

export interface DashboardKpis {
  kpis: {
    chantiersActifs: number;
    alertesOuvertes: number;
    rapportsAujourdhui: number;
    demandesUrgentes: number;
    homesJourMois: number;
  };
  chantiersByStatus: Record<string, number>;
  chantiersByEquipe: Record<string, number>;
  alertesByEquipe: Record<string, number>;
  chantiersAlerte: Chantier[];
  dernieresUrgences: DemandeMateriau[];
  rapports7j: Rapport[];
}

// Helper: return mock data when backend is unreachable or IS_DEMO is active
async function withFallback<T>(apiCall: () => Promise<T>, mockFn: () => Promise<T>): Promise<T> {
  if (IS_DEMO) return mockFn();
  try {
    return await apiCall();
  } catch {
    console.warn('[ChantierOps] Backend unreachable — using demo data');
    return mockFn();
  }
}

// API calls
export const dashboardApi = {
  getKpis: () =>
    withFallback(
      () => api.get<DashboardKpis>('/dashboard/kpis').then(r => r.data),
      async () => { const { MOCK_DASHBOARD_KPIS } = await import('./mockData'); return MOCK_DASHBOARD_KPIS; }
    ),
};

export const chantiersApi = {
  getAll: (params?: { equipe?: string; actif?: boolean }) =>
    withFallback(
      () => api.get<Chantier[]>('/chantiers', { params }).then(r => r.data),
      async () => {
        const { MOCK_CHANTIERS } = await import('./mockData');
        let result = MOCK_CHANTIERS;
        if (params?.equipe) result = result.filter(c => c.equipe === params.equipe);
        if (params?.actif !== undefined) result = result.filter(c => c.actif === params.actif);
        return result;
      }
    ),
  getOne: (id: string) =>
    withFallback(
      () => api.get<Chantier>(`/chantiers/${id}`).then(r => r.data),
      async () => {
        const { MOCK_CHANTIERS, MOCK_RAPPORTS, MOCK_ALERTES } = await import('./mockData');
        const c = MOCK_CHANTIERS.find(c => c.id === id) || MOCK_CHANTIERS[0];
        return { ...c, rapports: MOCK_RAPPORTS.filter(r => r.chantierId === c.id), alertes: MOCK_ALERTES.filter(a => a.chantierId === c.id) };
      }
    ),
  create: (data: any) => api.post<Chantier>('/chantiers', data).then(r => r.data),
  update: (id: string, data: any) => api.put<Chantier>(`/chantiers/${id}`, data).then(r => r.data),
  updateStatus: (id: string, status: string) =>
    api.put(`/chantiers/${id}/status`, { status }).then(r => r.data),
  delete: (id: string) => api.delete(`/chantiers/${id}`).then(r => r.data),
};

export const rapportsApi = {
  getAll: (params?: any) =>
    withFallback(
      () => api.get<Rapport[]>('/rapports', { params }).then(r => r.data),
      async () => {
        const { MOCK_RAPPORTS } = await import('./mockData');
        let result = MOCK_RAPPORTS;
        if (params?.equipe) result = result.filter(r => r.equipe === params.equipe);
        if (params?.chantierId) result = result.filter(r => r.chantierId === params.chantierId);
        return result;
      }
    ),
  getToday: (equipe?: string) =>
    withFallback(
      () => api.get<Rapport[]>('/rapports/today', { params: { equipe } }).then(r => r.data),
      async () => {
        const { MOCK_RAPPORTS } = await import('./mockData');
        const todayStr = new Date().toDateString();
        let result = MOCK_RAPPORTS.filter(r => new Date(r.date).toDateString() === todayStr);
        if (equipe) result = result.filter(r => r.equipe === equipe);
        return result;
      }
    ),
  create: (data: any) => api.post<Rapport>('/rapports', data).then(r => r.data),
};

export const alertesApi = {
  getAll: (params?: { equipe?: string; resolue?: boolean }) =>
    withFallback(
      () => api.get<Alerte[]>('/alertes', { params }).then(r => r.data),
      async () => {
        const { MOCK_ALERTES } = await import('./mockData');
        let result = MOCK_ALERTES;
        if (params?.equipe) result = result.filter(a => a.equipe === params.equipe);
        if (params?.resolue !== undefined) result = result.filter(a => a.resolue === params.resolue);
        return result;
      }
    ),
  resoudre: (id: string) => api.post(`/alertes/${id}/resoudre`).then(r => r.data),
};

export const materiauxApi = {
  getAll: (params?: any) =>
    withFallback(
      () => api.get<DemandeMateriau[]>('/materiaux', { params }).then(r => r.data),
      async () => {
        const { MOCK_MATERIAUX } = await import('./mockData');
        let result = MOCK_MATERIAUX;
        if (params?.equipe) result = result.filter(m => m.equipe === params.equipe);
        if (params?.statut) result = result.filter(m => m.statut === params.statut);
        if (params?.urgence) result = result.filter(m => m.urgence === params.urgence);
        return result;
      }
    ),
  create: (data: any) => api.post<DemandeMateriau>('/materiaux', data).then(r => r.data),
  updateStatut: (id: string, statut: string) =>
    api.put(`/materiaux/${id}/statut`, { statut }).then(r => r.data),
};

export const whatsappApi = {
  envoyerInstruction: (equipe: string, message: string) =>
    withFallback(
      () => api.post('/whatsapp/instruction', { equipe, message }).then(r => r.data),
      async () => ({ success: true, equipe, simulated: true })
    ),
};

const MOCK_EQUIPES = [
  { equipe: 'CARRELAGE', chefNom: 'Jean Müller', numeroWhatsApp: '+352691000001', heureRapport: '17:00' },
  { equipe: 'MACONNERIE', chefNom: 'Pierre Schmit', numeroWhatsApp: '+352691000002', heureRapport: '17:30' },
  { equipe: 'FACADE', chefNom: 'Marc Weber', numeroWhatsApp: '+352691000003', heureRapport: '17:00' },
  { equipe: 'ELECTRICITE', chefNom: 'Paul Klein', numeroWhatsApp: '+352691000004', heureRapport: '18:00' },
];

export const equipesApi = {
  getAll: () =>
    withFallback(
      () => api.get('/equipes').then(r => r.data),
      async () => MOCK_EQUIPES
    ),
  getStats: (equipe: string) => api.get(`/equipes/${equipe}/stats`).then(r => r.data),
  saveConfig: (equipe: string, data: any) =>
    withFallback(
      () => api.post(`/equipes/${equipe}/config`, data).then(r => r.data),
      async () => ({ equipe, ...data })
    ),
};
