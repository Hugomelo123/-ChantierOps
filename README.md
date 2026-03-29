# ChantierOps

**Démo en ligne :** [chantierops-production.up.railway.app](https://chantierops-production.up.railway.app/)

---

## Comment j'ai eu l'idée

En travaillant dans le secteur de la construction au Luxembourg, j'ai observé quelque chose qui se répète sur tous les chantiers : le directeur de travaux ne sait jamais vraiment ce qui s'est passé dans la journée.

Il appelle. Le chef d'équipe répond "ça avance". Le directeur raccroche, note mentalement que "la Carrelage avance", et passe au prochain appel.

Le soir, il a fait 8 à 10 appels. Il a une vague idée de l'état de ses chantiers. Mais rien par écrit. Rien de précis. Et si quelque chose s'est mal passé dans la journée, il le sait souvent trop tard — le lendemain matin, quand il reçoit le rapport papier, si rapport il y a.

---

## Le vrai problème

Ce n'est pas que les chefs d'équipe ne veulent pas communiquer. C'est que **les outils existants ne correspondent pas à leur réalité**.

Les applications de gestion de chantier demandent une connexion, un compte, une saisie dans un formulaire. Sur un chantier, à 17h, avec les mains sales et la journée qui s'est terminée en retard, personne ne va ouvrir une application pour remplir un formulaire.

Alors rien n'est envoyé. Ou un message WhatsApp rapide est tapé au chef, qui le transmet au directeur, qui ne sait pas trop quoi en faire.

**Le problème n'est pas le manque de volonté. C'est le manque de fluidité.**

---

## Comment j'ai pensé la solution

La première question que je me suis posée : qu'est-ce que les chefs d'équipe font déjà naturellement ?

Ils envoient des messages WhatsApp.

Pas dans une application spécialisée. Pas par email. Sur WhatsApp, comme avec leur famille, leurs amis, leurs collègues. C'est le seul outil qu'ils utilisent sans effort.

Alors j'ai décidé de partir de là. **Ne pas leur demander de changer leurs habitudes. Aller là où ils sont déjà.**

L'idée : ils envoient un message WhatsApp en fin de journée, comme ils le feraient de toute façon. Le système reçoit ce message, le comprend, et met à jour un tableau de bord en temps réel pour le directeur.

---

## Ce que j'ai construit

ChantierOps se compose de deux parties :

**Pour les chefs d'équipe :** rien de nouveau. Ils envoient un message WhatsApp au numéro du système. C'est tout.

```
Avancement: 75%
HJ: 4
Travaux: pose carrelage niveau 2
Problème: livraison béton en retard
```

**Pour le directeur de travaux :** un tableau de bord qui reçoit ces rapports en temps réel, affiche l'état de chaque chantier, envoie des alertes automatiques si un rapport manque, et génère les PDF de bilan en un clic.

### Les fonctionnalités qui découlent directement du problème

**Alertes automatiques à 17h05**
Si un chef d'équipe n'a pas envoyé son rapport, le système lui envoie automatiquement un rappel WhatsApp. Le directeur ne court plus après personne.

**Tableau de bord en temps réel**
Dès qu'un rapport arrive, l'avancement, les hommes/jour et les alertes se mettent à jour. Le directeur voit l'état de tous ses chantiers depuis son téléphone, sans appeler.

**Gestion des demandes de matériaux**
Un chef d'équipe signale un besoin urgent. Le directeur approuve en un clic, l'équipe reçoit la confirmation automatiquement sur WhatsApp.

**Rapports PDF hebdomadaires et mensuels**
Le bilan de la semaine ou du mois se génère en un clic, par chantier ou par équipe. Prêt à envoyer au client ou à archiver.

**Historique complet**
Chaque rapport, chaque alerte, chaque événement est enregistré. Utile en cas de litige, pour les bilans de fin de chantier, ou pour suivre l'évolution dans le temps.

---

## Ce que j'ai appris en le construisant

Le plus difficile n'a pas été la technique. C'est de comprendre que **la vraie résistance à l'adoption d'un outil, c'est le changement de comportement qu'il exige**.

Un outil qui demande même 2 minutes de plus par jour sera abandonné sur un chantier. Un outil qui se greffe sur ce que les gens font déjà a une chance d'être utilisé.

C'est pour ça que WhatsApp était la bonne entrée. Et c'est pour ça que le tableau de bord est pensé pour être consulté rapidement, depuis un téléphone, entre deux réunions.

---

## Essayer

La démo est accessible en ligne, avec des données réelles de démonstration, sans inscription.

**[Accéder au tableau de bord →](https://chantierops-production.up.railway.app/dashboard)**

---

<details>
<summary>Informations techniques</summary>

### Architecture

- **Frontend :** Next.js 14, Tailwind CSS, Recharts, TanStack Query
- **Backend :** NestJS, Prisma ORM, PostgreSQL
- **Messagerie :** Twilio WhatsApp Business API
- **Déploiement :** Railway, Docker

### Flux WhatsApp

1. Chef d'équipe envoie message WhatsApp → Twilio webhook `/api/whatsapp/webhook`
2. Backend parse le message (avancement, H/J, problèmes)
3. Rapport créé, statut du chantier mis à jour (OK / ALERTE)
4. Confirmation WhatsApp renvoyée à l'équipe
5. Dashboard mis à jour (polling 60s)

Cron job NestJS (`@Cron('5 17 * * 1-5', Europe/Luxembourg)`) — vérifie les rapports manquants chaque jour à 17h05.

### Installation locale

```bash
git clone https://github.com/Hugomelo123/-ChantierOps.git
cd -ChantierOps
cp backend/.env.example backend/.env

cd backend && npm install
npx prisma migrate dev --name init
npm run seed
npm run start:dev

# Autre terminal
cd frontend && npm install && npm run dev
```

Docker :

```bash
docker-compose up --build
```

### Variables d'environnement

```env
DATABASE_URL=postgresql://...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

</details>
