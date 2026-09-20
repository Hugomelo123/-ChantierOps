'use client';

import Link from 'next/link';
import {
  HardHat,
  MessageSquare,
  Bell,
  BarChart2,
  FileText,
  Package,
  ArrowRight,
  CheckCircle,
  Phone,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
  ExternalLink,
} from 'lucide-react';

const DEMO_URL = '/dashboard';

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-3xl font-extrabold mb-1" style={{ color: '#60a5fa' }}>{value}</div>
      <div className="text-sm font-semibold text-slate-200">{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#475569' }}>{sub}</div>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100" style={{ background: '#0f1c2e', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

      {/* Top notice banner */}
      <div className="w-full text-center py-2 px-4 text-xs font-semibold" style={{ background: 'rgba(217,119,6,0.12)', borderBottom: '1px solid rgba(217,119,6,0.25)', color: '#fbbf24' }}>
        Ceci est une démonstration de méthode — pas un produit commercial.
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: 'rgba(15,28,46,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563eb' }}>
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-base">ChantierOps</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#probleme" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition">Le problème</a>
            <a href="#comment" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition">Comment ça fonctionne</a>
            <a href="#demo" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition">Démo</a>
            <a
              href="https://www.linkedin.com/in/hugomelo1297/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Hugo Melo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-7" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', color: '#93c5fd' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            Prototype — Secteur construction · Luxembourg
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ color: '#f1f5f9' }}>
            Vous gérez des chantiers.<br />
            <span style={{ color: '#60a5fa' }}>Mais l'information ne circule pas.</span>
          </h1>

          <p className="text-lg sm:text-xl mb-4 leading-relaxed" style={{ color: '#94a3b8', maxWidth: '680px' }}>
            ChantierOps est un prototype qui illustre comment structurer le flux d'information
            entre le terrain et le bureau — en utilisant WhatsApp, que vos équipes utilisent déjà.
          </p>

          <p className="text-sm mb-10 italic" style={{ color: '#475569' }}>
            Ce n'est pas un produit commercial. C'est une démonstration de méthode construite à partir de 4 ans de terrain au Luxembourg.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white transition hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              Explorer la démonstration
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#probleme"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Comprendre le problème
            </a>
          </div>
        </div>
      </section>

      {/* Luxembourg market stats */}
      <section className="py-12 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-8" style={{ color: '#475569' }}>
            Le secteur construction au Luxembourg — en chiffres
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="9 852" label="entreprises" sub="secteur construction (2020)" />
            <StatCard value="48 500" label="salariés" sub="après la crise 2022–2024" />
            <StatCard value="€12,7 Mrd" label="chiffre d'affaires" sub="secteur au sens large" />
            <StatCard value="4 500" label="emplois perdus" sub="depuis la crise immobilière" />
          </div>
          <p className="text-center text-xs mt-5" style={{ color: '#334155' }}>
            Sources : European Commission Construction Observatory · STATEC · Chambre des Métiers Luxembourg
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 px-4 sm:px-6" id="probleme">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#475569' }}>
            Le problème
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-3">
            L'information se perd entre le terrain et le bureau
          </h2>
          <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: '#475569' }}>
            Ce n'est pas un problème de motivation. C'est un problème de système.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: Phone,
                title: '8 appels par jour pour savoir où en sont les équipes',
                desc: "Le directeur passe sa matinée au téléphone. L'information arrive fragmentée, souvent trop tard pour agir.",
              },
              {
                icon: Clock,
                title: "Les rapports arrivent le lendemain, quand ce n'est pas jamais",
                desc: "Les décisions se prennent sur des données d'hier. Les problèmes se découvrent trop tard pour agir.",
              },
              {
                icon: AlertTriangle,
                title: "Un problème détecté trop tard coûte plus cher qu'un problème anticipé",
                desc: "Entre le terrain et le bureau, l'information se perd. Personne n'en est responsable — c'est le système qui échoue.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-5" style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(220,38,38,0.1)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#f87171' }} />
                </div>
                <h3 className="font-semibold text-slate-200 mb-2 text-sm leading-snug">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Data points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: '55%+', label: 'des entreprises de construction utilisent WhatsApp pour coordonner leurs équipes', source: 'BauInfoConsult — Kommunikationsmonitor 2025 (n=501)' },
              { value: '48%', label: 'des reprises de travaux sont causées par une mauvaise communication sur le chantier', source: 'Autodesk / FMI — Construction Disconnected' },
              { value: '11h', label: 'perdues par semaine et par travailleur à chercher des informations dans des canaux informels', source: 'Buildingtalk — The WhatsApp Culture Report' },
            ].map(({ value, label, source }) => (
              <div key={value} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl font-extrabold mb-2" style={{ color: '#fbbf24' }}>{value}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{label}</p>
                <p className="text-[10px]" style={{ color: '#334155' }}>{source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market validation — Kraaft */}
      <section className="py-12 px-4 sm:px-6" style={{ background: 'rgba(37,99,235,0.05)', borderTop: '1px solid rgba(37,99,235,0.15)', borderBottom: '1px solid rgba(37,99,235,0.15)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-6" style={{ color: '#3b82f6' }}>
            Validation du marché
          </p>
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.2)' }}>
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-100 text-base">Kraaft — "le WhatsApp du BTP"</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>€13M levés — Jan 2025</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
                  Une startup parisienne a levé <strong className="text-slate-200">13 millions d'euros</strong> en janvier 2025 pour résoudre exactement ce problème.
                  Kraaft se positionne comme un "super-messaging" pour le BTP qui remplace WhatsApp par un canal structuré.
                  Active en <strong className="text-slate-200">France, Belgique et Luxembourg</strong>, avec des clients comme Bouygues et Vinci.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { v: '1 000+', l: 'clients entreprise' },
                    { v: '230 000', l: 'chantiers gérés' },
                    { v: '20 000', l: 'utilisateurs actifs/mois' },
                    { v: '14 pays', l: '5 langues' },
                  ].map(({ v, l }) => (
                    <div key={l} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="font-bold text-blue-300 text-sm">{v}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs italic" style={{ color: '#475569' }}>
                  Ce n'est pas une coïncidence. Le problème est réel, documenté, et assez important pour attirer des investisseurs institutionnels.
                  ChantierOps illustre la même logique — sans la levée de fonds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment j'aborde un problème opérationnel */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#475569' }}>
            Ma démarche
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-3">
            Comment j'aborde un problème opérationnel
          </h2>
          <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: '#64748b' }}>
            Je ne pars pas d'une solution digitale. Je pars de ce que je vois sur le terrain.
          </p>

          <div className="space-y-3 mb-10">
            {[
              { n: '1', text: "Observer ce qui se passe réellement sur le terrain" },
              { n: '2', text: "Identifier où l'information se perd ou où le temps est gaspillé" },
              { n: '3', text: "Comprendre le processus actuel — même s'il est informel ou basé sur WhatsApp" },
              { n: '4', text: "Structurer le problème de façon claire" },
              { n: '5', text: "Proposer une amélioration — digitale ou non" },
              { n: '6', text: "Mesurer si cela apporte un gain réel" },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm" style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>{n}</div>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm leading-relaxed text-center italic" style={{ color: '#64748b' }}>
              ChantierOps n'est qu'un exercice pour pratiquer et illustrer cette façon de penser.
              Ce n'est pas un logiciel à vendre. C'est une démonstration de méthode construite
              à partir de situations réelles rencontrées sur le terrain au Luxembourg.
            </p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-4 sm:px-6 text-center" id="comment">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.15)' }}>
            <HardHat className="w-7 h-7" style={{ color: '#60a5fa' }} />
          </div>
          <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: '#93c5fd' }}>
            "ChantierOps n'est pas un logiciel à vendre. C'est une façon de structurer un problème que je vis tous les jours sur le terrain."
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            La visibilité en temps réel, sans changer les habitudes des équipes
          </h2>
          <p className="leading-relaxed text-sm" style={{ color: '#64748b' }}>
            Vos chefs d'équipe utilisent déjà WhatsApp. Ce prototype montre comment se connecter à WhatsApp Business
            pour recevoir leurs rapports, les analyser automatiquement, et mettre à jour votre tableau de bord instantanément.
            Vous restez informé. Eux ne changent rien.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-10" style={{ color: '#475569' }}>
            Le flux en 3 étapes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                color: '#25D366',
                icon: MessageSquare,
                title: "Le chef d'équipe envoie son rapport sur WhatsApp",
                desc: "En fin de journée, il envoie quelques lignes en langage naturel — avancement, hommes présents, problèmes éventuels. Rien de nouveau pour lui.",
                example: "Chef, on est 3 aujourd'hui.\nR2 est à moitié fait mais le matériel\nn'est toujours pas arrivé.",
              },
              {
                step: '2',
                color: '#2563eb',
                icon: BarChart2,
                title: 'Le système analyse et met à jour le dashboard automatiquement',
                desc: "Le message est analysé, les données extraites, le tableau de bord mis à jour. Instantanément. Sans saisie manuelle.",
                example: null,
              },
              {
                step: '3',
                color: '#f59e0b',
                icon: Bell,
                title: 'Alerte automatique si rapport manquant à 17h05',
                desc: "Si une équipe n'a pas envoyé de rapport en fin de journée, le système envoie automatiquement un rappel WhatsApp au chef d'équipe.",
                example: null,
              },
            ].map(({ step, color, icon: Icon, title, desc, example }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color }}>Étape {step}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2 text-sm leading-snug">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
                  {example && (
                    <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.15)' }}>
                      <p className="text-xs whitespace-pre-line" style={{ color: '#86efac', fontFamily: 'JetBrains Mono, monospace' }}>{example}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6" id="fonctionnalites">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-slate-100">
            Ce que ce prototype structure
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto text-sm" style={{ color: '#475569' }}>
            Six problèmes concrets, six réponses structurées — construites à partir de situations réelles sur le terrain.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: BarChart2, color: '#60a5fa',
                title: 'Tableau de bord en temps réel',
                desc: "Visualiser l'état réel de chaque chantier — avancement, alertes, hommes/jour — sans passer par le téléphone.",
              },
              {
                icon: Bell, color: '#f87171',
                title: 'Alertes automatiques',
                desc: "Identifier immédiatement quand une équipe n'a pas envoyé de rapport. Rappel WhatsApp envoyé automatiquement à 17h05.",
              },
              {
                icon: Package, color: '#fbbf24',
                title: 'Suivi des matériaux',
                desc: "Structurer les demandes de matériaux avec niveau d'urgence. Approbation en un clic depuis le bureau.",
              },
              {
                icon: FileText, color: '#4ade80',
                title: 'Rapports PDF',
                desc: "Générer en un clic un rapport complet par chantier ou par équipe — hebdomadaire ou mensuel.",
              },
              {
                icon: TrendingUp, color: '#a78bfa',
                title: 'Historique complet',
                desc: "Retrouver tous les rapports, alertes et événements. Utile pour traçabilité, litiges, bilans de fin de chantier.",
              },
              {
                icon: MessageSquare, color: '#34d399',
                title: 'WhatsApp — rien à installer',
                desc: "Vos équipes n'ont pas d'application à apprendre. Elles utilisent WhatsApp qu'elles connaissent déjà.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-5 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: color + '18' }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-slate-200 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-14 px-4 sm:px-6" id="demo" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-10">
            Voir le prototype en action
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              "Tableau de bord avec données de démonstration réalistes",
              "Simulation de rapports WhatsApp entrants en temps réel",
              "Gestion des alertes et demandes de matériaux",
              "Export PDF — rapports hebdomadaires et mensuels",
              "Configuration des équipes et numéros WhatsApp",
              "Historique complet par chantier et par équipe",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                <p className="text-sm" style={{ color: '#94a3b8' }}>{item}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              Explorer la démonstration
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs mt-3" style={{ color: '#334155' }}>Données de démonstration — aucun compte requis</p>
          </div>
        </div>
      </section>

      {/* Stack technique */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-6" style={{ color: '#475569' }}>
            Stack technique
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Next.js 14 (App Router)', 'NestJS', 'PostgreSQL', 'Prisma ORM',
              'Twilio WhatsApp API', 'React Query', 'TypeScript', 'Docker',
              'PDFKit', 'Railway (déploiement)',
            ].map(tech => (
              <span key={tech} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                {tech}
              </span>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: '#334155' }}>
            Architecture production-ready — API REST, webhook temps réel, cron jobs, export PDF, base de données relationnelle
          </p>
        </div>
      </section>

      {/* CTA contact */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'rgba(37,99,235,0.07)', borderTop: '1px solid rgba(37,99,235,0.2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Ce prototype vous parle ?
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
            Je suis <strong className="text-slate-200">Hugo Melo</strong> — construit à partir de mon expérience sur le terrain au Luxembourg.
          </p>
          <p className="mb-10 leading-relaxed" style={{ color: '#64748b' }}>
            Si vous observez les mêmes problèmes dans votre entreprise, je serais intéressé à échanger
            sur la façon dont vous les gérez actuellement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.linkedin.com/in/hugomelo1297/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white transition hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              Me contacter sur LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="mailto:hugo1297@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              hugo1297@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#2563eb' }}>
                  <HardHat className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-200">Hugo Melo</span>
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>Construction Operations · Luxembourg · 4 ans de terrain</p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <a href="https://www.linkedin.com/in/hugomelo1297/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition font-medium">LinkedIn</a>
              <a href="mailto:hugo1297@gmail.com" className="hover:text-slate-200 transition" style={{ color: '#475569' }}>hugo1297@gmail.com</a>
              <Link href={DEMO_URL} className="hover:text-slate-200 transition" style={{ color: '#475569' }}>Démo</Link>
            </div>
          </div>
          <p className="text-xs" style={{ color: '#1e293b' }}>
            ChantierOps est une démonstration de méthode — pas un produit fini. Chaque entreprise a ses propres besoins et contraintes.
          </p>
        </div>
      </footer>

    </div>
  );
}
