# ChantierOps

> Savoir ce qui se passe sur vos chantiers, en temps réel — sans changer les habitudes de vos équipes.

**Démo en ligne :** [chantierops-production.up.railway.app](https://chantierops-production.up.railway.app/)

---

## Le problème que vous connaissez bien

Vous gérez plusieurs chantiers. En fin de journée, vous ne savez pas vraiment ce qui s'est passé sur chacun d'eux.

Vous appelez. Le chef d'équipe répond "ça avance". Vous raccrochez sans vraiment être plus avancé.

Les rapports arrivent le lendemain matin — quand ils arrivent. Un retard de livraison, un problème de sécurité, une équipe qui manque de matériaux : vous l'apprenez trop tard pour réagir.

---

## Ce que fait ChantierOps

Vos chefs d'équipe envoient leur compte-rendu de fin de journée **via WhatsApp**, comme ils le feraient avec n'importe quel message. ChantierOps reçoit ce message, le traite automatiquement, et met à jour votre tableau de bord en temps réel.

Vous ouvrez l'application — vous voyez l'état de tous vos chantiers, les alertes, les demandes de matériaux, les équipes qui n'ont pas encore rendu leur rapport.

Rien à installer pour vos équipes. Aucune formation nécessaire.

---

## Un rapport de chantier en 30 secondes

Le chef d'équipe envoie simplement :

```
Avancement: 75%
HJ: 4
Travaux: pose carrelage niveau 2
Problème: livraison béton en retard
```

C'est tout. ChantierOps fait le reste.

---

## Ce que vous y gagnez

**Vous arrêtez de courir après l'information.**
Le tableau de bord se met à jour dès que le rapport arrive. Vous savez, sans appeler.

**Vous êtes alerté avant que ça devienne un problème.**
Si un rapport n'est pas arrivé à 17h05, ChantierOps envoie automatiquement un rappel WhatsApp au chef d'équipe concerné.

**Vous avez tout par écrit, automatiquement.**
Chaque rapport, chaque alerte, chaque demande de matériau est enregistré. Un clic pour générer le rapport PDF de la semaine ou du mois — prêt à envoyer à votre client ou à archiver.

**Vos équipes ne changent rien.**
Ils utilisent WhatsApp qu'ils ont déjà sur leur téléphone. Pas d'application supplémentaire, pas de mot de passe, pas de formation.

---

## Ce que vous voyez dans le tableau de bord

- L'avancement de chaque chantier et de chaque équipe
- Les alertes actives (rapport manquant, problème signalé, matériau urgent)
- Le nombre d'hommes/jour par chantier cette semaine et ce mois
- Les demandes de matériaux en attente d'approbation
- L'historique complet de chaque chantier

---

## Essayer

La démo est accessible en ligne, sans inscription, avec des données réelles de démonstration.

**[Accéder au tableau de bord →](https://chantierops-production.up.railway.app/dashboard)**

---

<details>
<summary>Informations techniques (pour votre équipe IT)</summary>

### Stack
- Frontend : Next.js 14, Tailwind CSS
- Backend : NestJS, Prisma, PostgreSQL
- Messagerie : Twilio WhatsApp Business API
- Déploiement : Railway / Docker

### Installation locale

```bash
git clone https://github.com/Hugomelo123/-ChantierOps.git
cd -ChantierOps
cp backend/.env.example backend/.env
# Remplir les variables (DATABASE_URL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

cd backend && npm install && npx prisma migrate dev && npm run seed && npm run start:dev
cd frontend && npm install && npm run dev
```

### Variables d'environnement requises

```env
DATABASE_URL=postgresql://...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

</details>
