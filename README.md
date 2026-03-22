# ChantierOps 🏗️

> **Real-time construction site operations management — Luxembourg**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chantierops.railway.app-blue?style=for-the-badge&logo=railway)](https://chantierops-production.up.railway.app/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![WhatsApp](https://img.shields.io/badge/Messaging-WhatsApp%20API-25D366?style=flat-square&logo=whatsapp)](https://www.twilio.com/)

---

## The Problem ChantierOps Solves

Construction companies in Luxembourg lose hours every day trying to know **what is happening on their sites**: team leaders call, send scattered messages, reports arrive late or not at all. The site manager is flying blind.

**ChantierOps fixes this with a simple, fast platform integrated directly with WhatsApp.**

---

## Live Demo

**[https://chantierops-production.up.railway.app/](https://chantierops-production.up.railway.app/)**

---

## Key Features

### Real-Time Dashboard
- Live KPIs: active sites, alerts, man-days, pending materials
- Charts: man-days per week, site status, team breakdown
- Urgent alerts and material requests at a glance

### Reports via WhatsApp
Team leaders send their daily report straight from WhatsApp — no app, no login, no training needed. The system parses it automatically:

```
Avancement: 75%
HJ: 4
Travaux: pose carrelage R2
Problème: livraison en retard
```

### Automatic Alerts
- Detects missing reports at **17:05** (Mon–Fri)
- Sends automatic WhatsApp reminder to the team leader
- Full alert history per site

### Materials Management
- Requests with priority levels (Normal / Urgent / Critical)
- One-click approval by the site manager
- Weekly and monthly PDF exports

### PDF Reports
- Weekly and monthly reports per site or per team
- Ready to send to clients or for archiving

---

## Tech Stack

```
Frontend          Backend           Infrastructure
─────────────     ─────────────     ──────────────
Next.js 14        NestJS            Railway (deploy)
Tailwind CSS      Prisma ORM        PostgreSQL 15
Recharts          REST API          Docker
TypeScript        Swagger/OpenAPI   Twilio WhatsApp
```

---

## Architecture

```
┌─────────────┐     WhatsApp      ┌──────────────┐
│  Team       │ ─────────────────▶│    Twilio    │
│  Leader     │                   │   Webhook    │
└─────────────┘                   └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
┌─────────────┐   REST API        │   NestJS     │
│  Dashboard  │ ◀────────────────▶│   Backend    │
│  (Next.js)  │                   │   + Prisma   │
└─────────────┘                   └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
                                  │  PostgreSQL  │
                                  └──────────────┘
```

---

## ChantierOps vs Odoo

| Feature | Odoo | ChantierOps |
|---|:---:|:---:|
| Invoicing / Accounting | ✅ | — |
| HR & Payroll | ✅ | — |
| Daily site reports | ❌ | ✅ |
| WhatsApp integration | ❌ | ✅ |
| Automatic missing-report alerts | ❌ | ✅ |
| Real-time operational dashboard | ⚠️ weak | ✅ |
| Fast mobile interface | ⚠️ heavy | ✅ |

> **ChantierOps doesn't replace Odoo — it complements it.** Odoo handles back-office, ChantierOps handles the field.

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- (Optional) Docker & Docker Compose

### 1. Setup
```bash
git clone https://github.com/Hugomelo123/-ChantierOps.git
cd -ChantierOps
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed        # Demo data
npm run start:dev   # Port 3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev         # Port 3000
```

### With Docker
```bash
docker-compose up --build
```

### Local URLs
| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |

---

## Environment Variables

```env
# backend/.env
DATABASE_URL="postgresql://chantierops:chantierops_secret@localhost:5432/chantierops"
PORT=3001
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
JWT_SECRET=your_secret_here
```

---

## Twilio WhatsApp Setup

1. Create a [Twilio](https://www.twilio.com) account
2. Enable the WhatsApp Sandbox in the Twilio console
3. Set the webhook URL: `https://your-domain.com/api/whatsapp/webhook`
4. Copy Account SID and Auth Token to `backend/.env`

---

## Roadmap

- [ ] Native mobile app (React Native)
- [ ] Odoo integration via REST API
- [ ] Voice-to-report (speech recognition)
- [ ] Multi-company / multi-tenant support
- [ ] Team scheduling module

---

## Author

Built by **Hugo Melo** · [GitHub](https://github.com/Hugomelo123)

> Built to solve a real operational problem for construction companies in Luxembourg.
