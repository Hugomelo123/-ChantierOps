import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ChantierOps (multi-équipes)...');

  const existing = await prisma.chantier.count();
  if (existing > 0) {
    console.log('Données déjà présentes, seed ignoré.');
    return;
  }

  // ─── ConfigEquipe — plusieurs équipes par type ────────────────────
  const equipesData = [
    // CARRELAGE
    { type: 'CARRELAGE', nom: 'Carrelage A', chefNom: 'Jean Müller',    numeroWhatsApp: '+352691000001', heureRapport: '17:00' },
    { type: 'CARRELAGE', nom: 'Carrelage B', chefNom: 'Kurt Fischer',   numeroWhatsApp: '+352691000002', heureRapport: '17:00' },
    { type: 'CARRELAGE', nom: 'Carrelage C', chefNom: 'André Braun',    numeroWhatsApp: '+352691000003', heureRapport: '17:30' },
    // MACONNERIE
    { type: 'MACONNERIE', nom: 'Maçonnerie A', chefNom: 'Pierre Schmit',  numeroWhatsApp: '+352691000004', heureRapport: '17:30' },
    { type: 'MACONNERIE', nom: 'Maçonnerie B', chefNom: 'René Hoffman',   numeroWhatsApp: '+352691000005', heureRapport: '17:30' },
    { type: 'MACONNERIE', nom: 'Maçonnerie C', chefNom: 'Luc Becker',     numeroWhatsApp: '+352691000006', heureRapport: '18:00' },
    // FACADE
    { type: 'FACADE', nom: 'Façade A', chefNom: 'Marc Weber',    numeroWhatsApp: '+352691000007', heureRapport: '17:00' },
    { type: 'FACADE', nom: 'Façade B', chefNom: 'Stefan Koch',   numeroWhatsApp: '+352691000008', heureRapport: '17:00' },
    // ELECTRICITE
    { type: 'ELECTRICITE', nom: 'Électricité A', chefNom: 'Paul Klein',   numeroWhatsApp: '+352691000009', heureRapport: '18:00' },
    { type: 'ELECTRICITE', nom: 'Électricité B', chefNom: 'Yves Simon',   numeroWhatsApp: '+352691000010', heureRapport: '18:00' },
  ];

  const createdEquipes: Record<string, any> = {};
  for (const e of equipesData) {
    const eq = await prisma.configEquipe.create({ data: e as any });
    createdEquipes[e.nom] = eq;
  }

  // ─── Chantiers ────────────────────────────────────────────────────
  const chantiersData = [
    {
      nom: 'Résidence Les Cèdres', adresse: '12 Rue de la Paix', ville: 'Luxembourg', codePostal: 'L-1234',
      status: 'OK', dateDebut: new Date('2026-01-15'), notes: '24 appartements haut de gamme',
      teams: ['Carrelage A', 'Maçonnerie A'],
    },
    {
      nom: 'Immeuble Kirchberg Tower', adresse: '45 Avenue J.F. Kennedy', ville: 'Luxembourg', codePostal: 'L-1855',
      status: 'ALERTE', dateDebut: new Date('2026-02-01'), notes: 'Tour de bureaux 12 étages',
      teams: ['Maçonnerie B', 'Façade A', 'Électricité A'],
    },
    {
      nom: 'Villa Strassen Premium', adresse: "8 Rue de l'Église", ville: 'Strassen', codePostal: 'L-8030',
      status: 'OK', dateDebut: new Date('2026-01-20'), notes: 'Villa individuelle, façade pierre naturelle',
      teams: ['Façade A', 'Carrelage B'],
    },
    {
      nom: "Bureaux Cloche d'Or", adresse: '2 Rue Alphonse Weicker', ville: 'Luxembourg', codePostal: 'L-2721',
      status: 'PARTIEL', dateDebut: new Date('2026-02-10'), notes: 'Rénovation installations électriques',
      teams: ['Électricité A', 'Électricité B'],
    },
    {
      nom: 'Appartements Esch-Belval', adresse: "5 Place de l'Université", ville: 'Esch-sur-Alzette', codePostal: 'L-4365',
      status: 'OK', dateDebut: new Date('2026-03-01'), notes: '18 appartements étudiants',
      teams: ['Carrelage B', 'Carrelage C'],
    },
    {
      nom: 'Centre Commercial Bertrange', adresse: '1 Route de Longwy', ville: 'Bertrange', codePostal: 'L-8080',
      status: 'OK', dateDebut: new Date('2026-02-15'), notes: 'Extension galerie marchande 2 400 m²',
      teams: ['Maçonnerie A', 'Maçonnerie C', 'Façade B'],
    },
    {
      nom: 'Lycée de Differdange', adresse: '23 Rue Émile Mark', ville: 'Differdange', codePostal: 'L-4620',
      status: 'ALERTE', dateDebut: new Date('2026-01-10'), notes: 'Rénovation thermique façades, bâtiment classé',
      teams: ['Façade A', 'Façade B'],
    },
    {
      nom: 'Hôtel Limpertsberg', adresse: '14 Boulevard de la Pétrusse', ville: 'Luxembourg', codePostal: 'L-2320',
      status: 'OK', dateDebut: new Date('2026-02-20'), notes: '4 étoiles, 86 chambres',
      teams: ['Carrelage A', 'Carrelage C', 'Maçonnerie B'],
    },
    {
      nom: 'Entrepôt Logistique Windhof', adresse: '8 Rue des Trois Cantons', ville: 'Windhof', codePostal: 'L-8399',
      status: 'OK', dateDebut: new Date('2026-03-05'), notes: 'Installation électrique industrielle 5 000 m²',
      teams: ['Électricité A', 'Électricité B'],
    },
    {
      nom: 'Résidence Seniors Hesperange', adresse: '32 Route de Thionville', ville: 'Hesperange', codePostal: 'L-5884',
      status: 'PARTIEL', dateDebut: new Date('2026-01-25'), notes: '60 logements adaptés, normes PMR',
      teams: ['Maçonnerie A', 'Maçonnerie C'],
    },
  ];

  const chantiers: any[] = [];
  for (const { teams, ...data } of chantiersData) {
    const ch = await prisma.chantier.create({ data: data as any });
    chantiers.push(ch);
    for (const teamNom of teams) {
      const eq = createdEquipes[teamNom];
      if (eq) {
        await prisma.chantierEquipe.create({
          data: { chantierId: ch.id, configEquipeId: eq.id },
        });
      }
    }
  }

  const daysAgo = (n: number, h = 16, m = 30) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // ─── Rapports ────────────────────────────────────────────────────
  const rapports = [
    // Aujourd'hui
    { chantierId: chantiers[0].id, configEquipeId: createdEquipes['Carrelage A'].id, equipe: 'CARRELAGE', contenu: 'Pose carrelage salle de bain R2 terminée. Début cuisine demain.', homesJour: 3, avancement: 65, date: daysAgo(0, 16, 45), source: 'WHATSAPP' },
    { chantierId: chantiers[0].id, configEquipeId: createdEquipes['Maçonnerie A'].id, equipe: 'MACONNERIE', contenu: 'Cloisons R3 montées. Enduits en cours, 60% fait.', homesJour: 4, avancement: 58, date: daysAgo(0, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[2].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', contenu: 'Enduit façade nord appliqué 80 m². Météo favorable.', homesJour: 4, avancement: 40, date: daysAgo(0, 17, 10), source: 'WHATSAPP' },
    { chantierId: chantiers[3].id, configEquipeId: createdEquipes['Électricité A'].id, equipe: 'ELECTRICITE', contenu: 'Câblage tableau R1 en cours. Attente disjoncteurs.', homesJour: 2, avancement: 30, problemes: 'Livraison disjoncteurs repoussée au 25/03', date: daysAgo(0, 17, 0), source: 'MANUEL' },
    { chantierId: chantiers[7].id, configEquipeId: createdEquipes['Carrelage A'].id, equipe: 'CARRELAGE', contenu: 'Hall principal terminé. Corridors étage 1 démarrés.', homesJour: 5, avancement: 22, date: daysAgo(0, 16, 30), source: 'WHATSAPP' },
    { chantierId: chantiers[7].id, configEquipeId: createdEquipes['Carrelage C'].id, equipe: 'CARRELAGE', contenu: 'Restaurant: 40 m² posés. Reste zones humides.', homesJour: 3, avancement: 15, date: daysAgo(0, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[8].id, configEquipeId: createdEquipes['Électricité B'].id, equipe: 'ELECTRICITE', contenu: 'Tirage câbles HTA zone A terminé. Zone B demain.', homesJour: 4, avancement: 35, date: daysAgo(0, 17, 30), source: 'WHATSAPP' },

    // Hier
    { chantierId: chantiers[0].id, configEquipeId: createdEquipes['Carrelage A'].id, equipe: 'CARRELAGE', contenu: 'Salle de bain R1 terminée. Début R2.', homesJour: 3, avancement: 60, date: daysAgo(1, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[4].id, configEquipeId: createdEquipes['Carrelage B'].id, equipe: 'CARRELAGE', contenu: 'Couloir niveau 0 posé. Découpe pour escaliers.', homesJour: 4, avancement: 18, date: daysAgo(1, 16, 50), source: 'WHATSAPP' },
    { chantierId: chantiers[4].id, configEquipeId: createdEquipes['Carrelage C'].id, equipe: 'CARRELAGE', contenu: 'Appartements T2 niveau 1: 3 salles de bain posées.', homesJour: 3, avancement: 12, date: daysAgo(1, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[5].id, configEquipeId: createdEquipes['Maçonnerie A'].id, equipe: 'MACONNERIE', contenu: 'Dalle béton zone C coulée et vibrée. Cure en cours.', homesJour: 6, avancement: 55, date: daysAgo(1, 17, 15), source: 'MANUEL' },
    { chantierId: chantiers[9].id, configEquipeId: createdEquipes['Maçonnerie A'].id, equipe: 'MACONNERIE', contenu: 'Murs refend R+1 montés. Linteaux posés.', homesJour: 5, avancement: 42, date: daysAgo(1, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[2].id, configEquipeId: createdEquipes['Carrelage B'].id, equipe: 'CARRELAGE', contenu: 'Salle de bain RDC terminée. Pose cuisine demain.', homesJour: 2, avancement: 25, date: daysAgo(1, 16, 30), source: 'WHATSAPP' },

    // J-2
    { chantierId: chantiers[1].id, configEquipeId: createdEquipes['Maçonnerie B'].id, equipe: 'MACONNERIE', contenu: 'Coffrage colonnes R+4. Ferraillage 60%.', homesJour: 7, avancement: 48, date: daysAgo(2, 17, 30), source: 'WHATSAPP' },
    { chantierId: chantiers[3].id, configEquipeId: createdEquipes['Électricité B'].id, equipe: 'ELECTRICITE', contenu: 'Passage gaines R0 et R1 terminé.', homesJour: 3, avancement: 25, date: daysAgo(2, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[5].id, configEquipeId: createdEquipes['Maçonnerie C'].id, equipe: 'MACONNERIE', contenu: 'Zone B fondations terminées. Murs zone C démarrés.', homesJour: 5, avancement: 48, date: daysAgo(2, 17, 0), source: 'WHATSAPP' },

    // J-3
    { chantierId: chantiers[6].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', contenu: 'Inspection façade arrière. Fissures R+2 identifiées.', homesJour: 2, avancement: 20, problemes: 'Fissures façade R+2 à expertiser', date: daysAgo(3, 16, 0), source: 'MANUEL' },
    { chantierId: chantiers[6].id, configEquipeId: createdEquipes['Façade B'].id, equipe: 'FACADE', contenu: 'Façade avant: primaire appliqué, enduit demain.', homesJour: 3, avancement: 30, date: daysAgo(3, 17, 0), source: 'WHATSAPP' },
    { chantierId: chantiers[8].id, configEquipeId: createdEquipes['Électricité A'].id, equipe: 'ELECTRICITE', contenu: 'TGBT installé. Tests isolement OK. Distribution générale.', homesJour: 5, avancement: 28, date: daysAgo(3, 17, 15), source: 'WHATSAPP' },

    // J-5
    { chantierId: chantiers[1].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', contenu: 'Bardage façade est: 120 m² posés.', homesJour: 4, avancement: 22, date: daysAgo(5, 16, 45), source: 'WHATSAPP' },
    { chantierId: chantiers[7].id, configEquipeId: createdEquipes['Maçonnerie B'].id, equipe: 'MACONNERIE', contenu: 'Cloisons chambres R+2 terminées. R+3 démarré.', homesJour: 5, avancement: 40, date: daysAgo(5, 17, 0), source: 'WHATSAPP' },
  ];

  await prisma.rapport.createMany({ data: rapports as any });

  // ─── Alertes ─────────────────────────────────────────────────────
  await prisma.alerte.createMany({
    data: [
      { chantierId: chantiers[1].id, configEquipeId: createdEquipes['Maçonnerie B'].id, equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Aucun rapport reçu aujourd\'hui — Maçonnerie B, Kirchberg Tower', resolue: false },
      { chantierId: chantiers[3].id, configEquipeId: createdEquipes['Électricité A'].id, equipe: 'ELECTRICITE', type: 'MATERIAU_MANQUANT', message: "Disjoncteurs 63A en rupture — Électricité A, Cloche d'Or bloqué", resolue: false },
      { chantierId: chantiers[6].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', type: 'PROBLEME_SECURITE', message: 'Fissures structurelles R+2 — Façade A, Lycée Differdange', resolue: false },
      { chantierId: chantiers[9].id, configEquipeId: createdEquipes['Maçonnerie C'].id, equipe: 'MACONNERIE', type: 'NON_RAPPORT', message: 'Rapport manquant — Maçonnerie C, Résidence Seniors Hesperange', resolue: false },
      { chantierId: chantiers[0].id, configEquipeId: createdEquipes['Carrelage A'].id, equipe: 'CARRELAGE', type: 'MATERIAU_MANQUANT', message: 'Stock carrelage insuffisant — réappro effectuée', resolue: true, resolueAt: new Date(Date.now() - 2 * 86400000) },
    ] as any,
  });

  // ─── Demandes matériaux ──────────────────────────────────────────
  await prisma.demandeMateriau.createMany({
    data: [
      { chantierId: chantiers[0].id, configEquipeId: createdEquipes['Carrelage A'].id, equipe: 'CARRELAGE', materiau: 'Carrelage grès cérame 60x60 gris anthracite', quantite: 45, unite: 'm²', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Référence ATLAS GR6060A' },
      { chantierId: chantiers[3].id, configEquipeId: createdEquipes['Électricité A'].id, equipe: 'ELECTRICITE', materiau: 'Disjoncteurs différentiels 63A 30mA', quantite: 12, unite: 'pcs', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: 'Chantier bloqué' },
      { chantierId: chantiers[6].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', materiau: 'Filet protection chantier 2m x 50m', quantite: 4, unite: 'rouleaux', urgence: 'CRITIQUE', statut: 'EN_ATTENTE', notes: 'Sécurité obligatoire' },
      { chantierId: chantiers[7].id, configEquipeId: createdEquipes['Carrelage C'].id, equipe: 'CARRELAGE', materiau: 'Colle carrelage flexible C2S1 25kg', quantite: 30, unite: 'sacs', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Zones humides hôtel' },
      { chantierId: chantiers[9].id, configEquipeId: createdEquipes['Maçonnerie A'].id, equipe: 'MACONNERIE', materiau: "Béton prêt à l'emploi C25/30", quantite: 18, unite: 'm³', urgence: 'URGENT', statut: 'EN_ATTENTE', notes: 'Coulée dalle R+1' },
      { chantierId: chantiers[2].id, configEquipeId: createdEquipes['Façade A'].id, equipe: 'FACADE', materiau: 'Enduit façade minéral blanc 25kg', quantite: 80, unite: 'sacs', urgence: 'NORMAL', statut: 'APPROUVE', notes: 'Livraison lundi' },
      { chantierId: chantiers[4].id, configEquipeId: createdEquipes['Carrelage B'].id, equipe: 'CARRELAGE', materiau: 'Carrelage grès émaillé 30x60 blanc mat', quantite: 120, unite: 'm²', urgence: 'NORMAL', statut: 'APPROUVE' },
      { chantierId: chantiers[8].id, configEquipeId: createdEquipes['Électricité B'].id, equipe: 'ELECTRICITE', materiau: 'Câble U1000R2V 3x6mm²', quantite: 500, unite: 'm', urgence: 'URGENT', statut: 'APPROUVE' },
      { chantierId: chantiers[5].id, configEquipeId: createdEquipes['Maçonnerie C'].id, equipe: 'MACONNERIE', materiau: 'Parpaings creux 20x20x50', quantite: 2000, unite: 'pcs', urgence: 'NORMAL', statut: 'LIVRE' },
      { chantierId: chantiers[1].id, configEquipeId: createdEquipes['Maçonnerie B'].id, equipe: 'MACONNERIE', materiau: 'Acier HA Fe500 diamètre 16mm', quantite: 2500, unite: 'kg', urgence: 'NORMAL', statut: 'LIVRE' },
    ] as any,
  });

  console.log(`✓ ${chantiersData.length} chantiers`);
  console.log('✓ 10 équipes (3 Carrelage, 3 Maçonnerie, 2 Façade, 2 Électricité)');
  console.log('✓ 21 rapports (multi-équipes par chantier)');
  console.log('✓ 5 alertes');
  console.log('✓ 10 demandes matériaux');
  console.log('Seed terminé!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
