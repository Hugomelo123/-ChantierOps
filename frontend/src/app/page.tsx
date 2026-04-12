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
} from 'lucide-react';

const DEMO_URL = '/dashboard';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100" style={{ background: '#0f1c2e', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

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
            <a href="#comment" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition">
              Comment ça fonctionne
            </a>
            <a href="#fonctionnalites" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition">
              Ce que ça structure
            </a>
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
      <section className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ color: '#f1f5f9' }}>
            Vous gérez des chantiers.<br />
            <span style={{ color: '#60a5fa' }}>Mais l'information ne circule pas.</span>
          </h1>

          <p className="text-lg sm:text-xl mb-4 leading-relaxed" style={{ color: '#94a3b8', maxWidth: '680px' }}>
            ChantierOps est un prototype qui illustre comment structurer le flux d'information
            entre le terrain et le bureau — sans changer les habitudes des équipes.
          </p>

          <p className="text-sm mb-10" style={{ color: '#64748b' }}>
            Ce n'est pas un produit commercial. C'est une démonstration de méthode.
          </p>

          <Link
            href={DEMO_URL}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white transition hover:opacity-90"
            style={{ background: '#2563eb' }}
          >
            Explorer la démonstration
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-14 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-10" style={{ color: '#475569' }}>
            Vous reconnaissez-vous dans ces situations ?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Phone,
                title: '8 appels par jour pour savoir où en sont les équipes',
                desc: "Le directeur passe sa matinée au téléphone. L'information arrive fragmentée, souvent trop tard.",
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
        </div>
      </section>

      {/* Solution intro */}
      <section className="py-16 px-4 sm:px-6 text-center" id="comment">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.15)' }}>
            <HardHat className="w-7 h-7" style={{ color: '#60a5fa' }} />
          </div>
          <p className="text-base font-semibold mb-6 leading-relaxed" style={{ color: '#93c5fd' }}>
            "ChantierOps n'est pas un logiciel à vendre. C'est une façon de structurer un problème que je vis tous les jours sur le terrain."
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            La visibilité en temps réel, sans changer les habitudes de vos équipes
          </h2>
          <p className="leading-relaxed" style={{ color: '#64748b' }}>
            Vos chefs d'équipe utilisent déjà WhatsApp. Ce prototype montre comment
            se connecter à WhatsApp Business pour recevoir leurs rapports, les analyser
            automatiquement, et mettre à jour votre tableau de bord instantanément.
            Vous restez informé, eux ne changent rien.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                color: '#25D366',
                icon: MessageSquare,
                title: "Le chef d'équipe envoie son rapport sur WhatsApp",
                desc: "En fin de journée, il envoie quelques lignes en langage naturel. Rien de plus.",
                example: "Chef, on est 3 aujourd'hui.\nR2 est à moitié fait mais le matériel\nn'est toujours pas arrivé.",
              },
              {
                step: '2',
                color: '#2563eb',
                icon: BarChart2,
                title: 'ChantierOps met à jour le tableau de bord automatiquement',
                desc: 'Le système analyse le message, met à jour les indicateurs du chantier et enregistre le rapport. Instantanément.',
                example: null,
              },
              {
                step: '3',
                color: '#f59e0b',
                icon: Bell,
                title: 'Vous êtes alerté si quelque chose ne va pas',
                desc: 'Rapport manquant à 17h05 ? Problème signalé ? Vous recevez une alerte immédiatement. Vous pouvez réagir avant que ça empire.',
                example: null,
              },
            ].map(({ step, color, icon: Icon, title, desc, example }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color + '22' }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                    Étape {step}
                  </div>
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
            Six problèmes concrets, six réponses structurées.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: BarChart2,
                color: '#60a5fa',
                title: 'Tableau de bord en temps réel',
                desc: "Visualiser l'état réel de chaque chantier sans passer par le téléphone.",
              },
              {
                icon: Bell,
                color: '#f87171',
                title: 'Alertes automatiques',
                desc: "Identifier immédiatement quand une équipe n'a pas envoyé de rapport.",
              },
              {
                icon: Package,
                color: '#fbbf24',
                title: 'Suivi des matériaux',
                desc: "Structurer les demandes de matériaux pour éviter les livraisons au mauvais endroit.",
              },
              {
                icon: FileText,
                color: '#4ade80',
                title: 'Rapports PDF',
                desc: "Garder une trace structurée de ce qui s'est passé sur chaque chantier.",
              },
              {
                icon: TrendingUp,
                color: '#a78bfa',
                title: 'Historique',
                desc: "Comprendre les patterns — où l'information échoue, à quel moment, pourquoi.",
              },
              {
                icon: MessageSquare,
                color: '#34d399',
                title: 'WhatsApp',
                desc: "Utiliser ce que les équipes utilisent déjà. Rien à installer, rien à apprendre.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-5 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.13)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: color + '18' }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-slate-200 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-10">
            Ce que ça change concrètement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Fin des appels quotidiens pour avoir un bilan des chantiers",
              "Visibilité immédiate sur tous vos chantiers depuis n'importe où",
              "Alertes avant que les problèmes s'aggravent",
              "Rapports PDF générés automatiquement, plus de saisie manuelle",
              "Vos équipes ne changent pas leurs habitudes",
              "Historique complet pour la traçabilité et les bilans",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                <p className="text-sm" style={{ color: '#94a3b8' }}>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'rgba(37,99,235,0.07)', borderTop: '1px solid rgba(37,99,235,0.2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Ce prototype vous parle ?
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: '#94a3b8' }}>
            Je suis Hugo Melo — je travaille sur chantier au Luxembourg depuis 4 ans.
            Si le problème que vous voyez ici existe dans votre entreprise,
            je serais ravi d'en discuter.
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
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:hugo1297@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              Envoyer un email
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
              <p className="text-sm" style={{ color: '#475569' }}>Construction Operations | Luxembourg</p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <a
                href="https://www.linkedin.com/in/hugomelo1297/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                LinkedIn
              </a>
              <a
                href="mailto:hugo1297@gmail.com"
                className="hover:text-slate-200 transition"
                style={{ color: '#475569' }}
              >
                hugo1297@gmail.com
              </a>
              <Link href={DEMO_URL} className="hover:text-slate-200 transition" style={{ color: '#475569' }}>
                Démo
              </Link>
            </div>
          </div>
          <p className="text-xs" style={{ color: '#334155' }}>
            ChantierOps est une démonstration de méthode — pas un produit fini. Chaque entreprise a ses propres besoins.
          </p>
        </div>
      </footer>

    </div>
  );
}
