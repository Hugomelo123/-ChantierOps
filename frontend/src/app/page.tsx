'use client';

import Link from 'next/link';
import { HardHat, ArrowRight, ExternalLink, Phone, Clock, AlertTriangle } from 'lucide-react';

const DEMO_URL = '/dashboard';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100" style={{
      background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(245,158,11,0.12) 0%, transparent 60%), #09080a',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    }}>

      {/* Top notice */}
      <div className="w-full text-center py-2.5 px-4 text-xs font-semibold uppercase tracking-widest" style={{
        background: 'rgba(245,158,11,0.07)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
        color: '#f59e0b',
      }}>
        Démonstration de méthode — pas un produit commercial
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{
        background: 'rgba(9,8,10,0.88)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-tight">Hugo Melo</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>ChantierOps</span>
          </div>
          <a
            href="https://www.linkedin.com/in/hugomelo1297/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold transition-all"
            style={{ color: '#f59e0b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
            onMouseLeave={e => (e.currentTarget.style.color = '#f59e0b')}
          >
            Hugo Melo <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 700px at 50% 30%, rgba(245,158,11,0.08), transparent)',
        }} />

        <div className="max-w-2xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-10" style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#fbbf24',
          }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: '#f59e0b' }} />
            Aide-carreleur · Luxembourg · 4 ans sur le terrain
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Sur les chantiers,
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              l'information se perd.
            </span>
          </h1>

          <p className="text-lg leading-relaxed mb-12" style={{ color: '#52525b', maxWidth: '480px', margin: '0 auto 3rem' }}>
            Je travaille sur les chantiers au Luxembourg depuis 4 ans.
            Ce prototype illustre comment je structure un problème que je vis de l'intérieur, chaque jour.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                boxShadow: '0 0 30px rgba(245,158,11,0.3)',
              }}
            >
              Voir le prototype
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#methode"
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-semibold transition-all"
              style={{ color: '#a1a1aa', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              La démarche
            </a>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(239,68,68,0.35))' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f87171' }}>Le problème</p>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(239,68,68,0.35))' }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-14">
            Ce que j'observe sur le terrain, chaque jour
          </h2>

          <div className="space-y-4">
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
              <div
                key={title}
                className="flex gap-5 rounded-2xl p-5 transition-all"
                style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                  e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.04)';
                  e.currentTarget.style.border = '1px solid rgba(239,68,68,0.1)';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#f87171' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1.5 text-sm">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ma méthode */}
      <section className="py-24 px-6" id="methode" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.4))' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Ma démarche</p>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.4))' }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            Comment j'aborde un problème opérationnel
          </h2>
          <p className="text-center text-sm mb-14 max-w-xl mx-auto" style={{ color: '#52525b' }}>
            Quand j'arrive sur un chantier, je me pose toujours la même question : <em style={{ color: '#a1a1aa' }}>où est-ce que l'information se perd ?</em> C'est de là que part tout le reste.
          </p>

          <div className="space-y-2.5">
            {[
              "Observer ce qui se passe réellement sur le terrain",
              "Identifier où l'information se perd ou où le temps est gaspillé",
              "Comprendre le processus actuel — même s'il est informel",
              "Structurer le problème de façon claire",
              "Proposer une amélioration — digitale ou non",
              "Mesurer si cela apporte un gain réel",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl p-4 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
                  e.currentTarget.style.border = '1px solid rgba(245,158,11,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{
                  background: 'rgba(245,158,11,0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}>{i + 1}</div>
                <p className="text-sm font-medium" style={{ color: '#d4d4d8' }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl p-6" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(234,88,12,0.04))',
            border: '1px solid rgba(245,158,11,0.15)',
          }}>
            <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
              <strong className="text-slate-200">ChantierOps est l'illustration concrète de cette démarche.</strong>{' '}
              J'ai pris un problème réel du terrain, je l'ai structuré, et j'ai construit un prototype fonctionnel
              — en utilisant WhatsApp, que les équipes utilisent déjà, sans rien leur demander de plus.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 500px at 50% 50%, rgba(245,158,11,0.06), transparent)',
        }} />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Vous observez les mêmes problèmes ?
          </h2>
          <p className="text-base mb-10 leading-relaxed" style={{ color: '#52525b' }}>
            Pas pour vendre un produit — pour échanger sur la façon dont vous gérez ces défis aujourd'hui.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <a
              href="https://www.linkedin.com/in/hugomelo1297/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                boxShadow: '0 0 28px rgba(245,158,11,0.25)',
              }}
            >
              Me contacter sur LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="mailto:hugo1297@gmail.com"
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-semibold transition-all"
              style={{ color: '#a1a1aa', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              hugo1297@gmail.com
            </a>
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold transition-all"
              style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.13)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.07)')}
            >
              Explorer le prototype <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              }}>
                <HardHat className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#52525b' }}>Hugo Melo</span>
            </div>
            <p className="text-xs" style={{ color: '#27272a' }}>
              Construction Operations · Luxembourg · Démonstration de méthode, pas un produit fini.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
