'use client';

import Link from 'next/link';
import { HardHat, ArrowRight, ExternalLink, Phone, Clock, AlertTriangle } from 'lucide-react';

const DEMO_URL = '/dashboard';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100" style={{ background: '#0f1c2e', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>

      {/* Top notice */}
      <div className="w-full text-center py-2 px-4 text-xs font-semibold tracking-wide" style={{ background: 'rgba(217,119,6,0.1)', borderBottom: '1px solid rgba(217,119,6,0.2)', color: '#fbbf24' }}>
        Démonstration de méthode — pas un produit commercial
      </div>

      {/* Nav */}
      <nav className="fixed top-7 left-0 right-0 z-50 backdrop-blur-md" style={{ background: 'rgba(15,28,46,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563eb' }}>
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-100">ChantierOps</span>
          </div>
          <a
            href="https://www.linkedin.com/in/hugomelo1297/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition flex items-center gap-1.5"
          >
            Hugo Melo <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-44 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-8" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', color: '#93c5fd' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            Terrain · Luxembourg · 4 ans d'expérience
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ color: '#f1f5f9' }}>
            Sur les chantiers,<br />
            <span style={{ color: '#60a5fa' }}>l'information se perd.</span>
          </h1>

          <p className="text-lg leading-relaxed mb-10" style={{ color: '#64748b', maxWidth: '560px' }}>
            J'ai observé ce problème tous les jours sur le terrain au Luxembourg.
            Ce prototype illustre ma façon de le structurer et d'y répondre.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              Voir le prototype
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#methode"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold transition"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              La démarche
            </a>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3b82f6' }}>Le problème</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-12">
            Ce que j'observe sur le terrain, chaque jour
          </h2>

          <div className="space-y-5">
            {[
              {
                icon: Phone,
                title: '8 appels par jour pour savoir où en sont les équipes',
                desc: "Le directeur passe sa matinée au téléphone. L'information arrive fragmentée, souvent trop tard pour agir.",
              },
              {
                icon: Clock,
                title: "Les rapports arrivent le lendemain — quand ils arrivent",
                desc: "Les décisions se prennent sur des données d'hier. Les problèmes sont découverts trop tard.",
              },
              {
                icon: AlertTriangle,
                title: "Un problème non détecté à temps coûte dix fois plus cher à corriger",
                desc: "Ce n'est pas un problème de motivation. C'est un problème de système — l'information n'a pas de canal structuré.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(220,38,38,0.1)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#f87171' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1 text-sm">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ma méthode */}
      <section className="py-20 px-6" id="methode" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3b82f6' }}>Ma démarche</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Comment j'aborde un problème opérationnel
          </h2>
          <p className="text-sm mb-12" style={{ color: '#475569' }}>
            Je ne pars pas d'une solution digitale. Je pars de ce que je vois sur le terrain.
          </p>

          <div className="space-y-3">
            {[
              "Observer ce qui se passe réellement sur le terrain",
              "Identifier où l'information se perd ou où le temps est gaspillé",
              "Comprendre le processus actuel — même s'il est informel",
              "Structurer le problème de façon claire",
              "Proposer une amélioration — digitale ou non",
              "Mesurer si cela apporte un gain réel",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm" style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>{i + 1}</div>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6" style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <strong className="text-slate-200">ChantierOps est l'illustration concrète de cette démarche.</strong>{' '}
              J'ai pris un problème réel que je vis sur le terrain, je l'ai structuré, et j'ai construit un prototype
              fonctionnel pour montrer comment le résoudre — en utilisant WhatsApp, que les équipes utilisent déjà,
              sans rien leur demander de plus.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">
            Si vous observez les mêmes problèmes,<br />
            <span style={{ color: '#60a5fa' }}>je serais intéressé à en discuter.</span>
          </h2>
          <p className="text-sm mb-10" style={{ color: '#475569' }}>
            Pas pour vendre un produit — pour échanger sur la façon dont vous gérez ces problèmes aujourd'hui.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <a
              href="https://www.linkedin.com/in/hugomelo1297/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              Me contacter sur LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="mailto:hugo1297@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold transition"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              hugo1297@gmail.com
            </a>
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition"
              style={{ color: '#60a5fa', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.08)')}
            >
              Explorer le prototype
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#2563eb' }}>
                <HardHat className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-300 text-sm">Hugo Melo</span>
            </div>
            <p className="text-xs" style={{ color: '#334155' }}>Construction Operations · Luxembourg · ChantierOps est une démonstration de méthode, pas un produit fini.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
