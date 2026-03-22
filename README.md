# ChantierOps 🏗️

> **Plataforma operacional de gestão de obras em tempo real — Luxemburgo**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chantierops.railway.app-blue?style=for-the-badge&logo=railway)](https://chantierops-production.up.railway.app/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![WhatsApp](https://img.shields.io/badge/Messaging-WhatsApp%20API-25D366?style=flat-square&logo=whatsapp)](https://www.twilio.com/)

---

## O Problema que o ChantierOps Resolve

Empresas de construção no Luxemburgo perdem horas por dia tentando saber **o que está a acontecer nas obras**: os chefes de equipa ligam, mandam mensagens dispersas, os relatórios chegam tarde ou não chegam. O director de obra fica cego.

**O ChantierOps resolve isso com uma plataforma simples, rápida e integrada com WhatsApp.**

---

## Demo ao Vivo

**[https://chantierops-production.up.railway.app/](https://chantierops-production.up.railway.app/)**

---

## Funcionalidades Principais

### Dashboard em Tempo Real
- KPIs instantâneos: obras ativas, alertas, homens/dia, materiais pendentes
- Gráficos de evolução (homens·dia por semana, status por equipa)
- Alertas e pedidos urgentes visíveis à primeira vista

### Relatórios via WhatsApp
Os chefes de equipa enviam o relatório do dia diretamente pelo WhatsApp — sem app, sem login, sem formação. O sistema processa automaticamente:

```
Avancement: 75%
HJ: 4
Travaux: pose carrelage R2
Problème: livraison en retard
```

### Alertas Automáticos
- Deteção automática de relatórios em falta às **17h05** (seg-sex)
- WhatsApp automático ao chefe de equipa em falta
- Histórico completo de alertas por obra

### Gestão de Materiais
- Pedidos com prioridade (Normal / Urgente / Crítico)
- Aprovação rápida pelo director de obra
- Exportação em PDF semanal e mensal

### Relatórios PDF
- Relatórios semanais e mensais por obra ou por equipa
- Prontos para enviar ao cliente ou para arquivo

---

## Stack Técnica

```
Frontend          Backend           Infra
─────────────     ─────────────     ─────────────
Next.js 14        NestJS            Railway (deploy)
Tailwind CSS      Prisma ORM        PostgreSQL 15
Recharts          REST API          Docker
TypeScript        Swagger/OpenAPI   Twilio WhatsApp
```

---

## Arquitectura

```
┌─────────────┐     WhatsApp      ┌──────────────┐
│  Chefe de   │ ─────────────────▶│    Twilio    │
│   equipa    │                   │   Webhook    │
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

| Funcionalidade | Odoo | ChantierOps |
|---|:---:|:---:|
| Faturação / Contabilidade | ✅ | — |
| Gestão de RH e salários | ✅ | — |
| Relatórios diários de obra | ❌ | ✅ |
| WhatsApp integrado | ❌ | ✅ |
| Alertas automáticos de falta de relatório | ❌ | ✅ |
| Dashboard operacional em tempo real | ⚠️ fraco | ✅ |
| Interface rápida no telemóvel | ⚠️ pesado | ✅ |

> **O ChantierOps não substitui o Odoo — complementa-o.** O Odoo gere o back-office, o ChantierOps gere o chão de obra.

---

## Instalação Local

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- (Opcional) Docker & Docker Compose

### 1. Configuração
```bash
git clone https://github.com/Hugomelo123/-ChantierOps.git
cd -ChantierOps
cp backend/.env.example backend/.env
# Editar backend/.env com as suas credenciais
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed        # Dados de demonstração
npm run start:dev   # Porta 3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev         # Porta 3000
```

### Com Docker
```bash
docker-compose up --build
```

### URLs locais
| Serviço | URL |
|---------|-----|
| Aplicação | http://localhost:3000 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |

---

## Variáveis de Ambiente

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

## Configuração Twilio WhatsApp

1. Criar conta em [twilio.com](https://www.twilio.com)
2. Ativar WhatsApp Sandbox na consola Twilio
3. Configurar webhook: `https://seu-dominio.com/api/whatsapp/webhook`
4. Copiar Account SID e Auth Token para `backend/.env`

---

## Roadmap

- [ ] App mobile nativa (React Native)
- [ ] Integração com Odoo via API REST
- [ ] Reconhecimento de voz para relatórios
- [ ] Multi-empresa / multi-tenant
- [ ] Módulo de planning de equipas

---

## Autor

Desenvolvido por **Hugo Melo** · [GitHub](https://github.com/Hugomelo123)

> Projeto desenvolvido para resolver um problema real de gestão de obras no Luxemburgo.
