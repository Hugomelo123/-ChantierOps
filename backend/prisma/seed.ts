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

  // Config équipes
  const equipes = [
    { equipe: 'CARRELAGE', chefNom: 'Jean Müller', numeroWhatsApp: '+352691000001' },
    { equipe: 'MACONNERIE', chefNom: 'Pierre Schmit', numeroWhatsApp: '+352691000002' },
    { equipe: 'FACADE', chefNom: 'Marc Weber', numeroWhatsApp: '+352691000003' },
    { equipe: 'ELECTRICITE', chefNom: 'Paul Klein', numeroWhatsApp: '+352691000004' },
  ];

  for (const e of equipes) {
    await prisma.configEquipe.upsert({
      where: { equipe: e.equipe as any },
      create: e as any,
      update: e,
    });
  }

  // Chantiers exemples
  const chantiers = [
    {
      nom: 'Résidence Les Cèdres',
      adresse: '12 Rue de la Paix',
      ville: 'Luxembourg',
      codePostal: 'L-1234',
      equipe: 'CARRELAGE',
      status: 'OK',
      dateDebut: new Date('2026-01-15'),
    },
    {
      nom: 'Immeuble Kirchberg',
      adresse: '45 Avenue J.F. Kennedy',
      ville: 'Luxembourg',
      codePostal: 'L-1855',
      equipe: 'MACONNERIE',
      status: 'ALERTE',
      dateDebut: new Date('2026-02-01'),
    },
    {
      nom: 'Villa Strassen',
      adresse: '8 Rue de l\'Église',
      ville: 'Strassen',
      codePostal: 'L-8030',
      equipe: 'FACADE',
      status: 'OK',
      dateDebut: new Date('2026-01-20'),
    },
    {
      nom: 'Bureaux Cloche d\'Or',
      adresse: '2 Rue Alphonse Weicker',
      ville: 'Luxembourg',
      codePostal: 'L-2721',
      equipe: 'ELECTRICITE',
      status: 'PARTIEL',
      dateDebut: new Date('2026-02-10'),
    },
    {
      nom: 'Appartements Esch-Belval',
      adresse: '5 Place de l\'Université',
      ville: 'Esch-sur-Alzette',
      codePostal: 'L-4365',
      equipe: 'CARRELAGE',
      status: 'OK',
      dateDebut: new Date('2026-03-01'),
    },
    {
      nom: 'Centre Commercial Bertrange',
      adresse: '1 Route de Longwy',
      ville: 'Bertrange',
      codePostal: 'L-8080',
      equipe: 'MACONNERIE',
      status: 'OK',
      dateDebut: new Date('2026-02-15'),
    },
  ];

  const createdChantiers: any[] = [];
  for (const c of chantiers) {
    const ch = await prisma.chantier.create({ data: c as any });
    createdChantiers.push(ch);
  }

  // Rapports exemples
  const today = new Date();
  today.setHours(14, 30, 0, 0);

  await prisma.rapport.createMany({
    data: [
      {
        chantierId: createdChantiers[0].id,
        equipe: 'CARRELAGE',
        contenu: 'Pose carrelage salle de bain R2 terminée. Début cuisine demain.',
        homesJour: 3,
        avancement: 65,
        date: today,
        source: 'WHATSAPP',
      },
      {
        chantierId: createdChantiers[2].id,
        equipe: 'FACADE',
        contenu: 'Enduit façade nord appliqué. Conditions météo favorables.',
        homesJour: 4,
        avancement: 40,
        date: today,
        source: 'WHATSAPP',
      },
      {
        chantierId: createdChantiers[3].id,
        equipe: 'ELECTRICITE',
        contenu: 'Câblage tableau électrique R1 en cours. Attente livraison disjoncteurs.',
        homesJour: 2,
        avancement: 30,
        problemes: 'Livraison disjoncteurs en retard',
        date: today,
        source: 'MANUEL',
      },
    ],
  });

  // Alertes exemples
  await prisma.alerte.createMany({
    data: [
      {
        chantierId: createdChantiers[1].id,
        equipe: 'MACONNERIE',
        type: 'NON_RAPPORT',
        message: 'Aucun rapport reçu aujourd\'hui pour Immeuble Kirchberg',
        resolue: false,
      },
      {
        chantierId: createdChantiers[3].id,
        equipe: 'ELECTRICITE',
        type: 'MATERIAU_MANQUANT',
        message: 'Disjoncteurs 63A en rupture de stock',
        resolue: false,
      },
    ],
  });

  // Demandes matériaux
  await prisma.demandeMateriau.createMany({
    data: [
      {
        chantierId: createdChantiers[0].id,
        equipe: 'CARRELAGE',
        materiau: 'Carrelage grès cérame 60x60 gris anthracite',
        quantite: 45,
        unite: 'm²',
        urgence: 'URGENT',
        statut: 'EN_ATTENTE',
        notes: 'Référence ATLAS GR6060A',
      },
      {
        chantierId: createdChantiers[3].id,
        equipe: 'ELECTRICITE',
        materiau: 'Disjoncteurs différentiels 63A 30mA',
        quantite: 12,
        unite: 'pcs',
        urgence: 'CRITIQUE',
        statut: 'EN_ATTENTE',
        notes: 'Chantier bloqué sans ces pièces',
      },
      {
        chantierId: createdChantiers[2].id,
        equipe: 'FACADE',
        materiau: 'Enduit de façade blanc 25kg',
        quantite: 20,
        unite: 'sacs',
        urgence: 'NORMAL',
        statut: 'APPROUVE',
      },
      {
        chantierId: createdChantiers[5].id,
        equipe: 'MACONNERIE',
        materiau: 'Parpaings 20x20x50',
        quantite: 500,
        unite: 'pcs',
        urgence: 'NORMAL',
        statut: 'LIVRE',
        livreeLe: new Date(),
      },
    ],
  });

  console.log('Seed terminé avec succès!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
