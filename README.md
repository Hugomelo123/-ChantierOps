# ChantierOps

**Savoir ce qui se passe sur vos chantiers, sans passer vos journées au téléphone.**

ChantierOps connecte vos chefs d'équipe — via WhatsApp qu'ils utilisent déjà — à un tableau de bord en temps réel pour les directeurs de travaux.

**Démo en ligne →** [chantierops-production.up.railway.app](https://chantierops-production.up.railway.app/)

---

## Le problème

Vous passez votre journée à appeler vos chefs d'équipe pour savoir où en sont les travaux.
Les rapports arrivent le lendemain, quand ils arrivent.
Un problème sur le chantier — vous l'apprenez trop tard.

## La solution

**1. Le chef d'équipe envoie son rapport sur WhatsApp en fin de journée**

```
Avancement: 75%
HJ: 4
Travaux: pose carrelage R2
Probleme: livraison en retard
```

**2. ChantierOps met à jour le tableau de bord automatiquement**

Avancement, hommes/jour, alertes — tout est mis à jour instantanément.

**3. Vous êtes alerté si quelque chose ne va pas**

Rapport manquant à 17h05 ? Problème signalé ? Vous recevez une alerte immédiatement.

---

## Ce que ça change concrètement

- Fini les appels quotidiens pour avoir un bilan des chantiers
- Visibilité immédiate sur tous vos chantiers depuis n'importe où
- Alertes automatiques si un rapport est manquant ou un problème détecté
- Rapports PDF hebdomadaires et mensuels générés en un clic
- Vos équipes ne changent rien — elles utilisent WhatsApp qu'elles connaissent déjà

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| Tableau de bord temps réel | KPIs par chantier, alertes actives, hommes/jour |
| Rapports via WhatsApp | Les chefs d'équipe envoient un message, le système fait le reste |
| Alertes automatiques | Rappel WhatsApp si rapport manquant à 17h05 (lun–ven) |
| Gestion des matériaux | Demandes avec niveau d'urgence, approbation en un clic |
| Rapports PDF | Hebdomadaires et mensuels par chantier ou par équipe |
| Historique complet | Traçabilité de tous les rapports, alertes et événements |

---

## Installation

### Prérequis
- Node.js 20+
- PostgreSQL 15+
- Compte Twilio (intégration WhatsApp)

### Lancement rapide

```bash
git clone https://github.com/Hugomelo123/-ChantierOps.git
cd -ChantierOps

# Backend
cp backend/.env.example backend/.env
cd backend && npm install
npx prisma migrate dev --name init
npm run seed
npm run start:dev

# Frontend (dans un autre terminal)
cd frontend && npm install
npm run dev
```

Avec Docker :

```bash
docker-compose up --build
```

### Variables d'environnement

```env
DATABASE_URL="postgresql://chantierops:chantierops_secret@localhost:5432/chantierops"
PORT=3001
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Configuration WhatsApp

1. Créer un compte sur [twilio.com](https://www.twilio.com)
2. Activer le WhatsApp Sandbox
3. Configurer le webhook : `https://votre-domaine.com/api/whatsapp/webhook`

---

*Construit pour répondre à un besoin réel du secteur de la construction au Luxembourg.*
