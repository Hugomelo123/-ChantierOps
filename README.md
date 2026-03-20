# ChantierOps 🏗️

Gestion opérationnelle des chantiers de construction au Luxembourg.

## Stack technique
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + Tailwind CSS + Recharts
- **Messaging**: Twilio WhatsApp API

## Équipes
- Carrelage
- Maçonnerie
- Façade
- Électricité

## Démarrage rapide

### Prérequis
- Node.js 20+
- PostgreSQL 15+
- (Optionnel) Docker & Docker Compose

### 1. Configuration
```bash
cp backend/.env.example backend/.env
# Éditez backend/.env avec vos paramètres
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed          # Données de démonstration
npm run start:dev     # Port 3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev           # Port 3000
```

### Avec Docker
```bash
docker-compose up --build
```

## URLs
| Service | URL |
|---------|-----|
| Application | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |

## Fonctionnalités

### Dashboard
- KPIs en temps réel: chantiers actifs, alertes, rapports, matériaux, hommes·jour
- Graphiques: H/J par jour, statut des chantiers, vue par équipe
- Alertes et demandes urgentes en temps réel

### Gestion des chantiers
- Création et modification de chantiers par équipe
- Statuts: OK / Alerte / Partiel
- Historique des rapports et alertes par chantier

### Rapports quotidiens
- Saisie manuelle ou via WhatsApp
- Avancement %, hommes·jour, problèmes
- Export PDF hebdomadaire et mensuel

### Alertes automatiques
- Détection des rapports manquants à 17h05 (lun-ven)
- Notification WhatsApp automatique aux chefs d'équipe
- Résolution manuelle des alertes

### WhatsApp (Twilio)
- Réception des rapports des équipes
- Envoi d'instructions aux équipes
- Confirmation automatique de réception
- Format libre ou structuré:
  ```
  Avancement: 75%
  HJ: 4
  Travaux effectués: pose carrelage R2
  Problème: livraison en retard
  ```

### Matériaux
- Demandes avec niveaux d'urgence (Normal/Urgent/Critique)
- Suivi des statuts (En attente/Approuvé/Livré/Refusé)
- Rapports PDF hebdomadaires et mensuels

## Configuration Twilio WhatsApp

1. Créez un compte Twilio: https://www.twilio.com
2. Activez le WhatsApp Sandbox dans la console Twilio
3. Configurez le webhook: `https://votre-domaine.com/api/whatsapp/webhook`
4. Copiez Account SID et Auth Token dans `backend/.env`

## Variables d'environnement (backend/.env)

```env
DATABASE_URL="postgresql://chantierops:chantierops_secret@localhost:5432/chantierops"
PORT=3001
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
JWT_SECRET=your_secret_here
```
# -ChantierOps
