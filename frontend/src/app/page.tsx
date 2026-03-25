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
  Github,
  CheckCircle,
  Smartphone,
  Zap,
  Shield,
} from 'lucide-react';

const DEMO_URL = '/dashboard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">ChantierOps</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Hugomelo123/-ChantierOps"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Link
              href={DEMO_URL}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              Voir la demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ backgroundColor: '#f0f4f8', borderColor: '#c7d8e8', color: '#1e3a5f' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Demo live disponible
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Gerez vos chantiers
            <br />
            <span style={{ color: '#1e3a5f' }}>depuis WhatsApp</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ChantierOps connecte les chefs d&apos;equipe sur le terrain avec le directeur de travaux.
            Les rapports arrivent via WhatsApp, les alertes partent automatiquement.
            Sans application a installer, sans formation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white shadow-lg hover:opacity-90 transition"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              Acceder a la demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Hugomelo123/-ChantierOps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
            >
              <Github className="w-4 h-4" />
              Voir le code
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900">
            Comment ca fonctionne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: MessageSquare,
                color: '#25D366',
                title: "Chef d'equipe envoie sur WhatsApp",
                desc: "En fin de journee, il envoie son rapport directement depuis WhatsApp. Avancement, hommes jour, problemes en quelques lignes.",
              },
              {
                step: '2',
                icon: Zap,
                color: '#1e3a5f',
                title: 'Le systeme traite automatiquement',
                desc: "ChantierOps analyse le message, met a jour les KPIs du chantier et stocke le rapport. Zero saisie manuelle.",
              },
              {
                step: '3',
                icon: BarChart2,
                color: '#f39c12',
                title: 'Le directeur voit tout en temps reel',
                desc: "Dashboard mis a jour instantanement. Si un rapport manque a 17h05, une alerte WhatsApp part automatiquement.",
              },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <div key={step}>
                <div className="flex flex-col items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color }}>
                      Etape {step}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Une seule plateforme pour suivre l&apos;avancement, gerer les materiaux et piloter vos equipes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart2,
                color: '#1e3a5f',
                title: 'Dashboard temps reel',
                desc: "KPIs instantanes, graphiques d'evolution, vue par equipe. Tout sur un seul ecran.",
              },
              {
                icon: Bell,
                color: '#e74c3c',
                title: 'Alertes automatiques',
                desc: "Rapport manquant a 17h05 ? WhatsApp automatique au chef d'equipe. Historique complet.",
              },
              {
                icon: Package,
                color: '#f39c12',
                title: 'Gestion des materiaux',
                desc: "Demandes avec niveau d'urgence, approbation en un clic, export PDF semaine/mois.",
              },
              {
                icon: FileText,
                color: '#27ae60',
                title: 'Rapports PDF',
                desc: 'Rapports hebdomadaires et mensuels par chantier ou par equipe, prets a envoyer.',
              },
              {
                icon: Smartphone,
                color: '#3b82f6',
                title: '100% mobile',
                desc: "Interface responsive, menu slide-in, utilisable sur n'importe quel telephone.",
              },
              {
                icon: Shield,
                color: '#8b5cf6',
                title: 'Sans app pour le terrain',
                desc: "Les chefs d'equipe utilisent WhatsApp qu'ils ont deja. Zero friction, zero formation.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: color + '15' }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp example */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Un rapport en 30 secondes
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Le chef d&apos;equipe n&apos;a rien de nouveau a apprendre. Il envoie quelques lignes sur WhatsApp
              comme il le ferait avec n&apos;importe quel message. ChantierOps fait le reste.
            </p>
            <ul className="space-y-2">
              {[
                "Pas d'application a installer",
                'Pas de compte a creer',
                'Fonctionne sur tous les telephones',
                "Fonctionne hors connexion, le message part des le reseau revenu",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Fake WhatsApp bubble */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">WhatsApp — Chef equipe</div>
                <div className="text-xs text-gray-400">Carrelage · Residence Les Cedres</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-100 rounded-xl rounded-tl-none px-4 py-3 max-w-xs">
                <p className="text-sm text-gray-800 font-mono leading-relaxed">
                  Avancement: 75%<br />
                  HJ: 4<br />
                  Travaux: pose carrelage R2<br />
                  Probleme: livraison en retard
                </p>
                <p className="text-xs text-gray-400 mt-1.5 text-right">17:02</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl rounded-tr-none px-4 py-3 max-w-xs ml-auto text-right">
                <p className="text-sm text-gray-800">
                  Rapport enregistre pour Residence Les Cedres
                </p>
                <p className="text-xs text-gray-400 mt-1.5">17:02 · ChantierOps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4 sm:px-6" id="about">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            HM
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pourquoi j&apos;ai construit ChantierOps
          </h2>
          <div className="text-gray-500 leading-relaxed space-y-4 text-left sm:text-center">
            <p>
              En travaillant dans le secteur de la construction au Luxembourg, j&apos;ai vu de pres
              le probleme : les directeurs de chantier passent leur temps au telephone pour savoir
              ce qui se passe sur le terrain. Les informations arrivent en retard, dispersees dans
              des messages WhatsApp, des appels, des emails.
            </p>
            <p>
              J&apos;ai voulu construire quelque chose de{' '}
              <strong className="text-gray-800">simple et realiste</strong> — pas un ERP de plus
              que personne n&apos;utilise, mais un outil qui s&apos;integre dans ce que les equipes font
              deja : envoyer des messages WhatsApp.
            </p>
            <p>
              ChantierOps est un projet portfolio full-stack developpe de A a Z :
              architecture NestJS + Prisma cote backend, Next.js 14 cote frontend,
              deploye sur Railway, integration Twilio WhatsApp, generation PDF.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {['NestJS', 'Next.js 14', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Twilio', 'Railway', 'TypeScript'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-600 bg-gray-50">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://github.com/Hugomelo123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Voir ChantierOps en action
          </h2>
          <p className="text-blue-200 mb-8 leading-relaxed">
            La demo est disponible en ligne avec des donnees reelles.
            Aucune inscription requise.
          </p>
          <Link
            href={DEMO_URL}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white hover:bg-gray-100 transition"
            style={{ color: '#1e3a5f' }}
          >
            Acceder au dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <HardHat className="w-3 h-3 text-white" />
            </div>
            <span>ChantierOps · Projet portfolio · Hugo Melo</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Hugomelo123/-ChantierOps"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              GitHub
            </a>
            <Link href={DEMO_URL} className="hover:text-gray-600 transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
