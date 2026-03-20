import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

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

// API calls
export const dashboardApi = {
  getKpis: () => api.get<DashboardKpis>('/dashboard/kpis').then(r => r.data),
};

export const chantiersApi = {
  getAll: (params?: { equipe?: string; actif?: boolean }) =>
    api.get<Chantier[]>('/chantiers', { params }).then(r => r.data),
  getOne: (id: string) => api.get<Chantier>(`/chantiers/${id}`).then(r => r.data),
  create: (data: any) => api.post<Chantier>('/chantiers', data).then(r => r.data),
  update: (id: string, data: any) => api.put<Chantier>(`/chantiers/${id}`, data).then(r => r.data),
  updateStatus: (id: string, status: string) =>
    api.put(`/chantiers/${id}/status`, { status }).then(r => r.data),
  delete: (id: string) => api.delete(`/chantiers/${id}`).then(r => r.data),
};

export const rapportsApi = {
  getAll: (params?: any) => api.get<Rapport[]>('/rapports', { params }).then(r => r.data),
  getToday: (equipe?: string) =>
    api.get<Rapport[]>('/rapports/today', { params: { equipe } }).then(r => r.data),
  create: (data: any) => api.post<Rapport>('/rapports', data).then(r => r.data),
};

export const alertesApi = {
  getAll: (params?: { equipe?: string; resolue?: boolean }) =>
    api.get<Alerte[]>('/alertes', { params }).then(r => r.data),
  resoudre: (id: string) => api.post(`/alertes/${id}/resoudre`).then(r => r.data),
};

export const materiauxApi = {
  getAll: (params?: any) =>
    api.get<DemandeMateriau[]>('/materiaux', { params }).then(r => r.data),
  create: (data: any) => api.post<DemandeMateriau>('/materiaux', data).then(r => r.data),
  updateStatut: (id: string, statut: string) =>
    api.put(`/materiaux/${id}/statut`, { statut }).then(r => r.data),
};

export const whatsappApi = {
  envoyerInstruction: (equipe: string, message: string) =>
    api.post('/whatsapp/instruction', { equipe, message }).then(r => r.data),
};

export const equipesApi = {
  getAll: () => api.get('/equipes').then(r => r.data),
  getStats: (equipe: string) => api.get(`/equipes/${equipe}/stats`).then(r => r.data),
};
