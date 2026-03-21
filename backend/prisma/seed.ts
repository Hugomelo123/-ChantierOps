import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ChantierOps...');

  // Skip if data already exists
  const existingCount = await prisma.chantier.count();
  if (existingCount > 0) {
    console.log('Données déjà présentes, seed ignoré.');
    return;
  }

  // ─── Config équipes ───────────────────────────────────────────────
  const equipes = [
    { equipe: 'CARRELAGE', chefNom: 'Jean Müller', numeroWhatsApp: '+352691000001', heureRapport: '17:00' },
    { equipe: 'MACONNERIE', chefNom: 'Pierre Schmit', numeroWhatsApp: '+352691000002', heureRapport: '17:30' },
    { equipe: 'FACADE', chefNom: 'Marc Weber', numeroWhatsApp: '+352691000003', heureRapport: '17:00' },
    { equipe: 'ELECTRICITE', chefNom: 'Paul Klein', numeroWhatsApp: '+352691000004', heureRapport: '18:00' },
  ];
  for (const e of equipes) {
    await prisma.configEquipe.upsert({
      where: { equipe: e.equipe as any },
      create: e as any,
      update: e as any,
    });
  }

  // ─── Chantiers ────────────────────────────────────────────────────
  const chantiersData = [
    { nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg', codePostal: 'L-1234', equipe: 'CARRELAGE', status: 'OK', dateDebut: new Date('2026-01-15'), notes: 'Projet résidentiel haut de gamme, 24 appartements' },
    { nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg', codePostal: 'L-1855', equipe: 'MACONNERIE', status: 'ALERTE', dateDebut: new Date('2026-02-01'), notes: 'Tour de bureaux 12 étages, livraison prévue juin 2026' },
    { nom: 'Villa Strassen Premium', adresse: '8 Rue de l\'Église', ville: 'Strassen', codePostal: 'L-8030', equipe: 'FACADE', status: 'OK', dateDebut: new Date('2026-01-20'), notes: 'Villa individuelle, façade pierre naturelle' },
    { nom: 'Bureaux Cloche d\'Or', adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg', codePostal: 'L-2721', equipe: 'ELECTRICITE', status: 'PARTIEL', dateDebut: new Date('2026-02-10'), notes: 'Rénovation complète installations électriques' },
    { nom: 'Appartements Esch-Belval', adresse: '5 Place de l\'Université', ville: 'Esch-sur-Alzette', codePostal: 'L-4365', equipe: 'CARRELAGE', status: 'OK', dateDebut: new Date('2026-03-01'), notes: '18 appartements étudiants, livraison août 2026' },
    { nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy', ville: 'Bertrange', codePostal: 'L-8080', equipe: 'MACONNERIE', status: 'OK', dateDebut: new Date('2026-02-15'), notes: 'Extension galerie marchande 2 400 m²' },
    { nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark', ville: 'Differdange', codePostal: 'L-4620', equipe: 'FACADE', status: 'ALERTE', dateDebut: new Date('2026-01-10'), notes: 'Rénovation thermique façades, bâtiment classé' },
    { nom: 'Hôtel Limpertsberg', adresse: '14 Boulevard de la Pétrusse', ville: 'Luxembourg', codePostal: 'L-2320', equipe: 'CARRELAGE', status: 'OK', dateDebut: new Date('2026-02-20'), notes: '4 étoiles, 86 chambres, ouverture septembre 2026' },
    { nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof', codePostal: 'L-8399', equipe: 'ELECTRICITE', status: 'OK', dateDebut: new Date('2026-03-05'), notes: 'Installation électrique industrielle 5 000 m²' },
    { nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville', ville: 'Hesperange', codePostal: 'L-5884', equipe: 'MACONNERIE', status: 'PARTIEL', dateDebut: new Date('2026-01-25'), notes: '60 logements adaptés, normes PMR strictes' },
  ];

  const chantiers: any[] = [];
  for (const c of chantiersData) {
    const ch = await prisma.chantier.create({ data: c as any });
    chantiers.push(ch);
  }

  // ─── Rapports (14 jours d'historique) ────────────────────────────
  const daysAgo = (n: number, h = 16, m = 30) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(h, m, 0, 0);
    return d;
  };

  await prisma.rapport.createMany({
    data: [
      // Aujourd'hui
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', contenu: 'Pose carrelage salle de bain R2 terminée. Début cuisine demain matin.', homesJour: 3, avancement: 65, date: daysAgo(0, 16, 45), source: 'WHATSAPP' },
      { chantierId: chantiers[2].id, equipe: 'FACADE', contenu: 'Enduit façade nord appliqué sur 80 m². Conditions météo favorables, on continue demain.', homesJour: 4, avancement: 40, date: daysAgo(0, 17, 10), source: 'WHATSAPP' },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', contenu: 'Câblage tableau électrique R1 en cours. Attente livraison disjoncteurs bloque avancement.', homesJour: 2, avancement: 30, problemes: 'Livraison disjoncteurs repoussée au 25/03', date: daysAgo(0, 17, 0), source: 'MANUEL' },
      { chantierId: chantiers[7].id, equipe: 'CARRELAGE', contenu: 'Hall principal terminé. Début corridors étage 1. Qualité excellente, client satisfait.', homesJour: 5, avancement: 22, date: daysAgo(0, 16, 30), source: 'WHATSAPP' },
      { chantierId: chantiers[8].id, equipe: 'ELECTRICITE', contenu: 'Tirage câbles HTA terminé zone A. Zone B demain. RAS côté sécurité.', homesJour: 4, avancement: 35, date: daysAgo(0, 17, 30), source: 'WHATSAPP' },

      // Hier
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', contenu: 'Salle de bain R1 terminée. Début R2 en cours. 3 ouvriers sur place.', homesJour: 3, avancement: 60, date: daysAgo(1, 17, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[4].id, equipe: 'CARRELAGE', contenu: 'Couloir niveau 0 posé. Découpe carrelage pour escaliers en cours. Pas de problèmes.', homesJour: 4, avancement: 18, date: daysAgo(1, 16, 50), source: 'WHATSAPP' },
      { chantierId: chantiers[5].id, equipe: 'MACONNERIE', contenu: 'Dalle béton zone C coulée et vibrée. Cure en cours. Reprise dans 48h.', homesJour: 6, avancement: 55, date: daysAgo(1, 17, 15), source: 'MANUEL' },
      { chantierId: chantiers[9].id, equipe: 'MACONNERIE', contenu: 'Murs refend R+1 montés. Pose linteaux terminée. Bon avancement malgré chaleur.', homesJour: 5, avancement: 42, date: daysAgo(1, 17, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[2].id, equipe: 'FACADE', contenu: 'Échafaudage façade est monté. Protection bâche posée. Début enduit demain.', homesJour: 3, avancement: 35, date: daysAgo(1, 16, 30), source: 'WHATSAPP' },

      // J-2
      { chantierId: chantiers[1].id, equipe: 'MACONNERIE', contenu: 'Coffrage colonnes R+4 en place. Ferraillage 60% fait. Coulée prévue lundi.', homesJour: 7, avancement: 48, date: daysAgo(2, 17, 30), source: 'WHATSAPP' },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', contenu: 'Passage gaines R0 et R1 terminé. Tirage câbles démarré section principale.', homesJour: 3, avancement: 25, date: daysAgo(2, 17, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[7].id, equipe: 'CARRELAGE', contenu: 'Réception carrelage restaurant. Mise en œuvre démarrée, 40 m² posés.', homesJour: 4, avancement: 15, date: daysAgo(2, 16, 45), source: 'MANUEL' },

      // J-3
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', contenu: 'Préparation support R1. Ragréage appliqué. Séchage 24h avant pose.', homesJour: 2, avancement: 52, date: daysAgo(3, 17, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[5].id, equipe: 'MACONNERIE', contenu: 'Fondations zone B terminées. Début élévation murs zone C. Bonne progression équipe.', homesJour: 8, avancement: 48, date: daysAgo(3, 17, 30), source: 'WHATSAPP' },
      { chantierId: chantiers[6].id, equipe: 'FACADE', contenu: 'Inspection façade arrière. Fissures identifiées niveau R+2, rapport photos envoyé au bureau d\'études.', homesJour: 2, avancement: 20, problemes: 'Fissures façade R+2 à expertiser avant continuation', date: daysAgo(3, 16, 0), source: 'MANUEL' },
      { chantierId: chantiers[8].id, equipe: 'ELECTRICITE', contenu: 'Arrivée TGBT installée. Tests isolement OK. Début distribution générale.', homesJour: 5, avancement: 28, date: daysAgo(3, 17, 15), source: 'WHATSAPP' },

      // J-4
      { chantierId: chantiers[4].id, equipe: 'CARRELAGE', contenu: 'Livraison carrelage reçue et contrôlée. Début pose niveau 0 demain.', homesJour: 2, avancement: 10, date: daysAgo(4, 16, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[9].id, equipe: 'MACONNERIE', contenu: 'Coulée dalle RDC terminée. Épaisseur et planéité conformes. Cure 7 jours.', homesJour: 6, avancement: 35, date: daysAgo(4, 17, 0), source: 'MANUEL' },

      // J-5
      { chantierId: chantiers[1].id, equipe: 'MACONNERIE', contenu: 'Bétonnage poteaux R+3 effectué. Décoffrage dans 72h. Progression conforme au planning.', homesJour: 6, avancement: 42, date: daysAgo(5, 17, 15), source: 'WHATSAPP' },
      { chantierId: chantiers[2].id, equipe: 'FACADE', contenu: 'Nettoyage façade ouest au karcher terminé. Pose primaire d\'accrochage en cours.', homesJour: 3, avancement: 28, date: daysAgo(5, 16, 45), source: 'WHATSAPP' },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', contenu: 'Plan as-built mis à jour. Réunion de chantier avec maître d\'ouvrage, points bloquants discutés.', homesJour: 2, avancement: 20, date: daysAgo(5, 18, 0), source: 'MANUEL' },

      // J-7
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', contenu: 'Terasses extérieures R0 posées, 65 m². Joints à faire demain matin.', homesJour: 4, avancement: 45, date: daysAgo(7, 17, 0), source: 'WHATSAPP' },
      { chantierId: chantiers[5].id, equipe: 'MACONNERIE', contenu: 'Coffrages zone B retirés. Béton conforme. Début zone C prévu lundi.', homesJour: 5, avancement: 38, date: daysAgo(7, 16, 30), source: 'WHATSAPP' },
      { chantierId: chantiers[8].id, equipe: 'ELECTRICITE', contenu: 'Fouilles pour câbles enterrés terminées. Pose gaine TPC démarrée.', homesJour: 4, avancement: 18, date: daysAgo(7, 17, 0), source: 'WHATSAPP' },

      // J-10
      { chantierId: chantiers[7].id, equipe: 'CARRELAGE', contenu: 'Démarrage chantier hôtel. Réception plans et état des lieux. Commandes passées.', homesJour: 1, avancement: 5, date: daysAgo(10, 14, 0), source: 'MANUEL' },
      { chantierId: chantiers[9].id, equipe: 'MACONNERIE', contenu: 'Implantation et piquetage terminés. Fouilles démarrées, terrain conforme aux études de sol.', homesJour: 4, avancement: 12, date: daysAgo(10, 17, 0), source: 'WHATSAPP' },

      // J-14
      { chantierId: chantiers[1].id, equipe: 'MACONNERIE', contenu: 'Début chantier. Installation base vie et clôture de chantier. Premières fondations.', homesJour: 5, avancement: 8, date: daysAgo(14, 15, 0), source: 'MANUEL' },
    ],
  });

  // ─── Alertes ──────────────────────────────────────────────────────
  await prisma.alerte.createMany({
    data: [
      // Actives
      { chantierId: chantiers[1].id, equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Aucun rapport reçu aujourd\'hui pour Immeuble Kirchberg Tower — équipe non joignable', resolue: false },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', type: 'MATERIAU_MANQUANT', message: 'Disjoncteurs 63A en rupture — chantier Cloche d\'Or bloqué depuis 2 jours', resolue: false },
      { chantierId: chantiers[6].id, equipe: 'FACADE', type: 'PROBLEME_SECURITE', message: 'Fissures structurelles détectées façade R+2, Lycée Differdange — expertise requise', resolue: false },
      { chantierId: chantiers[9].id, equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Rapport manquant hier pour Résidence Seniors Hesperange', resolue: false },

      // Résolues récemment
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', type: 'MATERIAU_MANQUANT', message: 'Stock carrelage insuffisant — réappro effectuée', resolue: true, resolueAt: daysAgo(2, 9, 0) },
      { chantierId: chantiers[5].id, equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Rapport manquant J-4 — oubli chef d\'équipe, régularisé', resolue: true, resolueAt: daysAgo(3, 8, 30) },
      { chantierId: chantiers[2].id, equipe: 'FACADE', type: 'PROBLEME_SECURITE', message: 'Échafaudage non homologué — remplacé immédiatement', resolue: true, resolueAt: daysAgo(5, 14, 0) },
    ],
  });

  // ─── Demandes matériaux ───────────────────────────────────────────
  await prisma.demandeMateriau.createMany({
    data: [
      // En attente urgentes
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', materiau: 'Carrelage grès cérame 60x60 gris anthracite', quantite: 45, unite: 'm²', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Référence ATLAS GR6060A — délai max 3 jours' },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', materiau: 'Disjoncteurs différentiels 63A 30mA type A', quantite: 12, unite: 'pcs', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: 'Chantier à l\'arrêt sans ces pièces — commander en URGENCE' },
      { chantierId: chantiers[6].id, equipe: 'FACADE', materiau: 'Filet de protection chantier 2m x 50m', quantite: 4, unite: 'rouleaux', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: 'Sécurité obligatoire suite fissures détectées' },
      { chantierId: chantiers[7].id, equipe: 'CARRELAGE', materiau: 'Colle carrelage flexible C2S1 25kg', quantite: 30, unite: 'sacs', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Pour zones humides hôtel' },
      { chantierId: chantiers[9].id, equipe: 'MACONNERIE', materiau: 'Béton prêt à l\'emploi C25/30', quantite: 18, unite: 'm³', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Coulée dalle R+1 prévue vendredi' },

      // Approuvées
      { chantierId: chantiers[2].id, equipe: 'FACADE', materiau: 'Enduit de façade minéral blanc 25kg', quantite: 80, unite: 'sacs', urgence: 'NORMAL', statut: 'APPROUVE', notes: 'Livraison programmée lundi matin' },
      { chantierId: chantiers[4].id, equipe: 'CARRELAGE', materiau: 'Carrelage grès émaillé 30x60 blanc mat', quantite: 120, unite: 'm²', urgence: 'NORMAL', statut: 'APPROUVE', notes: 'Pour appartements niveaux 2 et 3' },
      { chantierId: chantiers[8].id, equipe: 'ELECTRICITE', materiau: 'Câble U1000R2V 3x6mm² rouge', quantite: 500, unite: 'm', urgence: 'URGENT', statut: 'APPROUVE', notes: 'Distribution générale entrepôt' },

      // Livrées
      { chantierId: chantiers[5].id, equipe: 'MACONNERIE', materiau: 'Parpaings creux 20x20x50', quantite: 2000, unite: 'pcs', urgence: 'NORMAL', statut: 'LIVRE', livreeLe: daysAgo(3, 8, 0) },
      { chantierId: chantiers[1].id, equipe: 'MACONNERIE', materiau: 'Acier HA Fe500 diamètre 16mm', quantite: 2500, unite: 'kg', urgence: 'NORMAL', statut: 'LIVRE', livreeLe: daysAgo(5, 7, 30) },
      { chantierId: chantiers[0].id, equipe: 'CARRELAGE', materiau: 'Carrelage terrasse antidérapant R11 40x40', quantite: 85, unite: 'm²', urgence: 'NORMAL', statut: 'LIVRE', livreeLe: daysAgo(7, 9, 0) },
      { chantierId: chantiers[3].id, equipe: 'ELECTRICITE', materiau: 'Tableau électrique 36 modules encastré', quantite: 8, unite: 'pcs', urgence: 'NORMAL', statut: 'LIVRE', livreeLe: daysAgo(8, 8, 0) },
    ],
  });

  console.log(`✓ ${chantiersData.length} chantiers créés`);
  console.log('✓ 27 rapports créés (14 jours d\'historique)');
  console.log('✓ 7 alertes créées (4 actives, 3 résolues)');
  console.log('✓ 12 demandes matériaux créées');
  console.log('Seed terminé avec succès!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
