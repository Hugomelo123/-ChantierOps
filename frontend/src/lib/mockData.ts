/**
 * Données de démonstration — ChantierOps
 * Activées via NEXT_PUBLIC_DEMO_MODE=true
 */

import type { Chantier, Rapport, Alerte, DemandeMateriau, DashboardKpis } from './api';

const today = new Date();
const daysAgo = (n: number, h = 16, m = 30) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const MOCK_CHANTIERS: Chantier[] = [
  { id: 'ch1', nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg', codePostal: 'L-1234', equipe: 'CARRELAGE', status: 'OK', dateDebut: '2026-01-15', actif: true, notes: 'Projet résidentiel haut de gamme, 24 appartements', _count: { rapports: 8, alertes: 0, demandesMat: 2 } },
  { id: 'ch2', nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg', codePostal: 'L-1855', equipe: 'MACONNERIE', status: 'ALERTE', dateDebut: '2026-02-01', actif: true, notes: 'Tour de bureaux 12 étages, livraison prévue juin 2026', _count: { rapports: 5, alertes: 1, demandesMat: 1 } },
  { id: 'ch3', nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen', codePostal: 'L-8030', equipe: 'FACADE', status: 'OK', dateDebut: '2026-01-20', actif: true, notes: 'Villa individuelle, façade pierre naturelle', _count: { rapports: 6, alertes: 0, demandesMat: 1 } },
  { id: 'ch4', nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg', codePostal: 'L-2721', equipe: 'ELECTRICITE', status: 'PARTIEL', dateDebut: '2026-02-10', actif: true, notes: 'Rénovation complète installations électriques', _count: { rapports: 4, alertes: 1, demandesMat: 2 } },
  { id: 'ch5', nom: 'Appartements Esch-Belval', adresse: "5 Place de l'Université", ville: 'Esch-sur-Alzette', codePostal: 'L-4365', equipe: 'CARRELAGE', status: 'OK', dateDebut: '2026-03-01', actif: true, notes: '18 appartements étudiants, livraison août 2026', _count: { rapports: 3, alertes: 0, demandesMat: 1 } },
  { id: 'ch6', nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy', ville: 'Bertrange', codePostal: 'L-8080', equipe: 'MACONNERIE', status: 'OK', dateDebut: '2026-02-15', actif: true, notes: 'Extension galerie marchande 2 400 m²', _count: { rapports: 7, alertes: 0, demandesMat: 2 } },
  { id: 'ch7', nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark', ville: 'Differdange', codePostal: 'L-4620', equipe: 'FACADE', status: 'ALERTE', dateDebut: '2026-01-10', actif: true, notes: 'Rénovation thermique façades, bâtiment classé', _count: { rapports: 4, alertes: 2, demandesMat: 2 } },
  { id: 'ch8', nom: 'Hôtel Limpertsberg', adresse: 'Boulevard de la Pétrusse 14', ville: 'Luxembourg', codePostal: 'L-2320', equipe: 'CARRELAGE', status: 'OK', dateDebut: '2026-02-20', actif: true, notes: '4 étoiles, 86 chambres, ouverture septembre 2026', _count: { rapports: 5, alertes: 0, demandesMat: 1 } },
  { id: 'ch9', nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof', codePostal: 'L-8399', equipe: 'ELECTRICITE', status: 'OK', dateDebut: '2026-03-05', actif: true, notes: 'Installation électrique industrielle 5 000 m²', _count: { rapports: 4, alertes: 0, demandesMat: 1 } },
  { id: 'ch10', nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville', ville: 'Hesperange', codePostal: 'L-5884', equipe: 'MACONNERIE', status: 'PARTIEL', dateDebut: '2026-01-25', actif: true, notes: '60 logements adaptés, normes PMR strictes', _count: { rapports: 6, alertes: 1, demandesMat: 1 } },
];

export const MOCK_RAPPORTS: Rapport[] = [
  { id: 'r1', chantierId: 'ch1', equipe: 'CARRELAGE', date: daysAgo(0, 16, 45), contenu: 'Pose carrelage salle de bain R2 terminée. Début cuisine demain matin.', homesJour: 3, avancement: 65, source: 'WHATSAPP', chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'r2', chantierId: 'ch3', equipe: 'FACADE', date: daysAgo(0, 17, 10), contenu: 'Enduit façade nord appliqué sur 80 m². Conditions météo favorables, on continue demain.', homesJour: 4, avancement: 40, source: 'WHATSAPP', chantier: { nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen' } },
  { id: 'r3', chantierId: 'ch4', equipe: 'ELECTRICITE', date: daysAgo(0, 17, 0), contenu: "Câblage tableau électrique R1 en cours. Attente livraison disjoncteurs bloque avancement.", homesJour: 2, avancement: 30, problemes: 'Livraison disjoncteurs repoussée au 25/03', source: 'MANUEL', chantier: { nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg' } },
  { id: 'r4', chantierId: 'ch8', equipe: 'CARRELAGE', date: daysAgo(0, 16, 30), contenu: 'Hall principal terminé. Début corridors étage 1. Qualité excellente, client satisfait.', homesJour: 5, avancement: 22, source: 'WHATSAPP', chantier: { nom: 'Hôtel Limpertsberg', adresse: 'Boulevard de la Pétrusse 14', ville: 'Luxembourg' } },
  { id: 'r5', chantierId: 'ch9', equipe: 'ELECTRICITE', date: daysAgo(0, 17, 30), contenu: 'Tirage câbles HTA terminé zone A. Zone B demain. RAS côté sécurité.', homesJour: 4, avancement: 35, source: 'WHATSAPP', chantier: { nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof' } },

  // Hier
  { id: 'r6', chantierId: 'ch1', equipe: 'CARRELAGE', date: daysAgo(1, 17, 0), contenu: 'Salle de bain R1 terminée. Début R2 en cours. 3 ouvriers sur place.', homesJour: 3, avancement: 60, source: 'WHATSAPP', chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'r7', chantierId: 'ch5', equipe: 'CARRELAGE', date: daysAgo(1, 16, 50), contenu: 'Couloir niveau 0 posé. Découpe carrelage pour escaliers en cours. Pas de problèmes.', homesJour: 4, avancement: 18, source: 'WHATSAPP', chantier: { nom: 'Appartements Esch-Belval', adresse: "5 Place de l'Université", ville: 'Esch-sur-Alzette' } },
  { id: 'r8', chantierId: 'ch6', equipe: 'MACONNERIE', date: daysAgo(1, 17, 15), contenu: 'Dalle béton zone C coulée et vibrée. Cure en cours. Reprise dans 48h.', homesJour: 6, avancement: 55, source: 'MANUEL', chantier: { nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy', ville: 'Bertrange' } },
  { id: 'r9', chantierId: 'ch10', equipe: 'MACONNERIE', date: daysAgo(1, 17, 0), contenu: 'Murs refend R+1 montés. Pose linteaux terminée. Bon avancement malgré chaleur.', homesJour: 5, avancement: 42, source: 'WHATSAPP', chantier: { nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville', ville: 'Hesperange' } },
  { id: 'r10', chantierId: 'ch3', equipe: 'FACADE', date: daysAgo(1, 16, 30), contenu: 'Échafaudage façade est monté. Protection bâche posée. Début enduit demain.', homesJour: 3, avancement: 35, source: 'WHATSAPP', chantier: { nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen' } },

  // J-2
  { id: 'r11', chantierId: 'ch2', equipe: 'MACONNERIE', date: daysAgo(2, 17, 30), contenu: 'Coffrage colonnes R+4 en place. Ferraillage 60% fait. Coulée prévue lundi.', homesJour: 7, avancement: 48, source: 'WHATSAPP', chantier: { nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg' } },
  { id: 'r12', chantierId: 'ch4', equipe: 'ELECTRICITE', date: daysAgo(2, 17, 0), contenu: 'Passage gaines R0 et R1 terminé. Tirage câbles démarré section principale.', homesJour: 3, avancement: 25, source: 'WHATSAPP', chantier: { nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg' } },

  // J-3
  { id: 'r13', chantierId: 'ch1', equipe: 'CARRELAGE', date: daysAgo(3, 17, 0), contenu: 'Préparation support R1. Ragréage appliqué. Séchage 24h avant pose.', homesJour: 2, avancement: 52, source: 'WHATSAPP', chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'r14', chantierId: 'ch7', equipe: 'FACADE', date: daysAgo(3, 16, 0), contenu: "Inspection façade arrière. Fissures identifiées niveau R+2, rapport photos envoyé au bureau d'études.", homesJour: 2, avancement: 20, problemes: 'Fissures façade R+2 à expertiser avant continuation', source: 'MANUEL', chantier: { nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark', ville: 'Differdange' } },

  // J-5
  { id: 'r15', chantierId: 'ch2', equipe: 'MACONNERIE', date: daysAgo(5, 17, 15), contenu: 'Bétonnage poteaux R+3 effectué. Décoffrage dans 72h. Progression conforme au planning.', homesJour: 6, avancement: 42, source: 'WHATSAPP', chantier: { nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg' } },
  { id: 'r16', chantierId: 'ch3', equipe: 'FACADE', date: daysAgo(5, 16, 45), contenu: "Nettoyage façade ouest au karcher terminé. Pose primaire d'accrochage en cours.", homesJour: 3, avancement: 28, source: 'WHATSAPP', chantier: { nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen' } },

  // J-7
  { id: 'r17', chantierId: 'ch1', equipe: 'CARRELAGE', date: daysAgo(7, 17, 0), contenu: 'Terrasses extérieures R0 posées, 65 m². Joints à faire demain matin.', homesJour: 4, avancement: 45, source: 'WHATSAPP', chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'r18', chantierId: 'ch9', equipe: 'ELECTRICITE', date: daysAgo(7, 17, 0), contenu: 'Fouilles pour câbles enterrés terminées. Pose gaine TPC démarrée.', homesJour: 4, avancement: 18, source: 'WHATSAPP', chantier: { nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof' } },
];

export const MOCK_ALERTES: Alerte[] = [
  { id: 'a1', chantierId: 'ch2', equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: "Aucun rapport reçu aujourd'hui pour Immeuble Kirchberg Tower — équipe non joignable", resolue: false, createdAt: daysAgo(0, 17, 30), chantier: { nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy' } },
  { id: 'a2', chantierId: 'ch4', equipe: 'ELECTRICITE', type: 'MATERIAU_MANQUANT', message: "Disjoncteurs 63A en rupture — chantier Cloche d'Or bloqué depuis 2 jours", resolue: false, createdAt: daysAgo(2, 9, 0), chantier: { nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker' } },
  { id: 'a3', chantierId: 'ch7', equipe: 'FACADE', type: 'PROBLEME_SECURITE', message: 'Fissures structurelles détectées façade R+2, Lycée Differdange — expertise requise', resolue: false, createdAt: daysAgo(3, 8, 0), chantier: { nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark' } },
  { id: 'a4', chantierId: 'ch10', equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Rapport manquant hier pour Résidence Seniors Hesperange', resolue: false, createdAt: daysAgo(1, 17, 45), chantier: { nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville' } },

  // Résolues
  { id: 'a5', chantierId: 'ch1', equipe: 'CARRELAGE', type: 'MATERIAU_MANQUANT', message: 'Stock carrelage insuffisant — réappro effectuée', resolue: true, resolueAt: daysAgo(2, 9, 0), createdAt: daysAgo(4, 10, 0), chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix' } },
  { id: 'a6', chantierId: 'ch6', equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: "Rapport manquant J-4 — oubli chef d'équipe, régularisé", resolue: true, resolueAt: daysAgo(3, 8, 30), createdAt: daysAgo(5, 17, 0), chantier: { nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy' } },
  { id: 'a7', chantierId: 'ch3', equipe: 'FACADE', type: 'PROBLEME_SECURITE', message: 'Échafaudage non homologué — remplacé immédiatement', resolue: true, resolueAt: daysAgo(5, 14, 0), createdAt: daysAgo(7, 9, 0), chantier: { nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église" } },
];

export const MOCK_MATERIAUX: DemandeMateriau[] = [
  { id: 'm1', chantierId: 'ch1', equipe: 'CARRELAGE', materiau: 'Carrelage grès cérame 60x60 gris anthracite', quantite: 45, unite: 'm²', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Référence ATLAS GR6060A — délai max 3 jours', demandeLe: daysAgo(1, 8, 0), chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'm2', chantierId: 'ch4', equipe: 'ELECTRICITE', materiau: 'Disjoncteurs différentiels 63A 30mA type A', quantite: 12, unite: 'pcs', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: "Chantier à l'arrêt sans ces pièces — commander en URGENCE", demandeLe: daysAgo(2, 9, 0), chantier: { nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg' } },
  { id: 'm3', chantierId: 'ch7', equipe: 'FACADE', materiau: 'Filet de protection chantier 2m x 50m', quantite: 4, unite: 'rouleaux', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: 'Sécurité obligatoire suite fissures détectées', demandeLe: daysAgo(3, 7, 30), chantier: { nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark', ville: 'Differdange' } },
  { id: 'm4', chantierId: 'ch8', equipe: 'CARRELAGE', materiau: 'Colle carrelage flexible C2S1 25kg', quantite: 30, unite: 'sacs', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Pour zones humides hôtel', demandeLe: daysAgo(1, 10, 0), chantier: { nom: 'Hôtel Limpertsberg', adresse: 'Boulevard de la Pétrusse 14', ville: 'Luxembourg' } },
  { id: 'm5', chantierId: 'ch10', equipe: 'MACONNERIE', materiau: 'Béton prêt à l\'emploi C25/30', quantite: 18, unite: 'm³', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Coulée dalle R+1 prévue vendredi', demandeLe: daysAgo(0, 14, 0), chantier: { nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville', ville: 'Hesperange' } },

  // Approuvées
  { id: 'm6', chantierId: 'ch3', equipe: 'FACADE', materiau: 'Enduit de façade minéral blanc 25kg', quantite: 80, unite: 'sacs', urgence: 'NORMAL', statut: 'APPROUVE', notes: 'Livraison programmée lundi matin', demandeLe: daysAgo(3, 9, 0), chantier: { nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen' } },
  { id: 'm7', chantierId: 'ch5', equipe: 'CARRELAGE', materiau: 'Carrelage grès émaillé 30x60 blanc mat', quantite: 120, unite: 'm²', urgence: 'NORMAL', statut: 'APPROUVE', notes: 'Pour appartements niveaux 2 et 3', demandeLe: daysAgo(4, 10, 0), chantier: { nom: 'Appartements Esch-Belval', adresse: "5 Place de l'Université", ville: 'Esch-sur-Alzette' } },
  { id: 'm8', chantierId: 'ch9', equipe: 'ELECTRICITE', materiau: 'Câble U1000R2V 3x6mm² rouge', quantite: 500, unite: 'm', urgence: 'URGENT', statut: 'APPROUVE', notes: 'Distribution générale entrepôt', demandeLe: daysAgo(2, 11, 0), chantier: { nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof' } },

  // Livrées
  { id: 'm9', chantierId: 'ch6', equipe: 'MACONNERIE', materiau: 'Parpaings creux 20x20x50', quantite: 2000, unite: 'pcs', urgence: 'NORMAL', statut: 'LIVRE', demandeLe: daysAgo(7, 8, 0), chantier: { nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy', ville: 'Bertrange' } },
  { id: 'm10', chantierId: 'ch2', equipe: 'MACONNERIE', materiau: 'Acier HA Fe500 diamètre 16mm', quantite: 2500, unite: 'kg', urgence: 'NORMAL', statut: 'LIVRE', demandeLe: daysAgo(8, 7, 30), chantier: { nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg' } },
  { id: 'm11', chantierId: 'ch1', equipe: 'CARRELAGE', materiau: 'Carrelage terrasse antidérapant R11 40x40', quantite: 85, unite: 'm²', urgence: 'NORMAL', statut: 'LIVRE', demandeLe: daysAgo(10, 9, 0), chantier: { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg' } },
  { id: 'm12', chantierId: 'ch4', equipe: 'ELECTRICITE', materiau: 'Tableau électrique 36 modules encastré', quantite: 8, unite: 'pcs', urgence: 'NORMAL', statut: 'LIVRE', demandeLe: daysAgo(11, 8, 0), chantier: { nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg' } },
];

// Calculs dashboard à partir des mocks
const todayStr = today.toDateString();
const rapportsAujourd = MOCK_RAPPORTS.filter(r => new Date(r.date).toDateString() === todayStr).length;
const homesJourMois = MOCK_RAPPORTS
  .filter(r => new Date(r.date).getMonth() === today.getMonth())
  .reduce((sum, r) => sum + r.homesJour, 0);

export const MOCK_DASHBOARD_KPIS: DashboardKpis = {
  kpis: {
    chantiersActifs: 10,
    alertesOuvertes: 4,
    rapportsAujourdhui: rapportsAujourd,
    demandesUrgentes: 5,
    homesJourMois,
  },
  chantiersByStatus: { OK: 6, ALERTE: 2, PARTIEL: 2 },
  chantiersByEquipe: { CARRELAGE: 4, MACONNERIE: 3, FACADE: 2, ELECTRICITE: 2 },
  alertesByEquipe: { MACONNERIE: 2, ELECTRICITE: 1, FACADE: 1 },
  chantiersAlerte: MOCK_CHANTIERS.filter(c => c.status === 'ALERTE'),
  dernieresUrgences: MOCK_MATERIAUX.filter(m => m.urgence !== 'NORMAL' && m.statut === 'EN_ATTENTE').slice(0, 4),
  rapports7j: MOCK_RAPPORTS.filter(r => {
    const d = new Date(r.date);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 7);
    return d >= cutoff;
  }),
};
