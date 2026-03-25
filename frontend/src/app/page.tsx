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
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">ChantierOps</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#comment" className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 transition">
              Comment ça fonctionne
            </a>
            <a href="#fonctionnalites" className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 transition">
              Fonctionnalités
            </a>
            <Link
              href={DEMO_URL}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              Essayer la démo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ backgroundColor: '#f0f6ff', borderColor: '#b8d0ee', color: '#1e3a5f' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Spécialisé construction Luxembourg
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Savoir ce qui se passe<br />
            <span style={{ color: '#1e3a5f' }}>sur vos chantiers,</span><br />
            sans passer vos journées au téléphone.
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            Vos chefs d&apos;équipe envoient leur rapport quotidien via WhatsApp.
            Vous voyez tout en temps réel sur votre tableau de bord.
            Aucune application à installer, aucune formation nécessaire.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white shadow-lg hover:opacity-90 transition"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              Voir le tableau de bord en démo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#comment"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
            >
              Comment ça fonctionne
            </a>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-center mb-10" style={{ color: '#1e3a5f' }}>
            Vous reconnaissez-vous dans ces situations ?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Phone,
                title: 'Fini les 8 appels par jour',
                desc: 'Vous passez votre journée à appeler les chefs d\'équipe pour savoir où en sont les travaux. Les réponses sont toujours "ça avance" sans détails.',
              },
              {
                icon: Clock,
                title: 'Des rapports qui arrivent trop tard',
                desc: 'Les comptes-rendus arrivent le lendemain, parfois jamais. Vous pilotez à l\'aveugle et vous le savez.',
              },
              {
                icon: AlertTriangle,
                title: 'Des problèmes détectés trop tard',
                desc: 'Un retard de livraison, un problème de sécurité, une équipe en sous-effectif : vous l\'apprenez quand il est trop tard pour réagir.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-red-100 p-5">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution intro */}
      <section className="py-16 px-4 sm:px-6 text-center" id="comment">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#e8f0f8' }}>
            <HardHat className="w-7 h-7" style={{ color: '#1e3a5f' }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            La visibilité en temps réel, sans changer les habitudes de vos équipes
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Vos chefs d&apos;équipe utilisent déjà WhatsApp. ChantierOps se connecte à WhatsApp Business
            pour recevoir leurs rapports, les analyser automatiquement, et mettre à jour votre tableau
            de bord instantanément. Vous restez informé, eux ne changent rien.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                color: '#25D366',
                icon: MessageSquare,
                title: "Le chef d'équipe envoie son rapport sur WhatsApp",
                desc: "En fin de journée, il envoie quelques lignes : avancement, nombre d'hommes, travaux du jour, problèmes. Rien de plus.",
                example: 'Avancement: 75%\nHJ: 4\nTravaux: pose carrelage R2\nProbleme: livraison en retard',
              },
              {
                step: '2',
                color: '#1e3a5f',
                icon: BarChart2,
                title: 'ChantierOps met à jour le tableau de bord automatiquement',
                desc: 'Le système analyse le message, met à jour les indicateurs du chantier et enregistre le rapport. Instantanément.',
                example: null,
              },
              {
                step: '3',
                color: '#f39c12',
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
                    style={{ backgroundColor: color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                    Étape {step}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-snug">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  {example && (
                    <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs text-gray-700 font-mono whitespace-pre-line">{example}</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-gray-900">
            Tout ce dont vous avez besoin pour piloter vos chantiers
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto text-sm">
            Un outil conçu pour les directeurs de travaux et responsables de chantier.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart2,
                color: '#1e3a5f',
                title: 'Tableau de bord en temps réel',
                desc: "Avancement par chantier, alertes actives, hommes/jour, demandes de matériaux urgentes. Tout en un coup d'œil.",
              },
              {
                icon: Bell,
                color: '#e74c3c',
                title: 'Alertes automatiques de rapport manquant',
                desc: "Si un chef d'équipe n'a pas envoyé son rapport à 17h05 (lundi-vendredi), ChantierOps lui envoie automatiquement un rappel sur WhatsApp.",
              },
              {
                icon: Package,
                color: '#f39c12',
                title: 'Suivi des demandes de matériaux',
                desc: "Vos équipes signalent les besoins avec niveau d'urgence. Vous approuvez en un clic depuis votre téléphone.",
              },
              {
                icon: FileText,
                color: '#27ae60',
                title: 'Rapports PDF hebdomadaires et mensuels',
                desc: "Générez en un clic un rapport complet par chantier ou par équipe. Prêt à envoyer à vos clients ou pour votre archivage.",
              },
              {
                icon: TrendingUp,
                color: '#3b82f6',
                title: 'Historique et traçabilité',
                desc: "Retrouvez tous les rapports, alertes et événements de chaque chantier. Utile en cas de litige ou pour les bilans de fin de chantier.",
              },
              {
                icon: MessageSquare,
                color: '#25D366',
                title: "Rapports WhatsApp : rien à changer",
                desc: "Vos chefs d'équipe n'ont pas d'application supplémentaire à installer. Ils utilisent WhatsApp qu'ils connaissent déjà.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: color + '18' }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits summary */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-10">
            Ce que vous gagnez concrètement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Fini les appels quotidiens pour avoir un bilan des chantiers",
              "Visibilité immédiate sur tous vos chantiers depuis n'importe où",
              "Alertes avant que les problèmes s'aggravent",
              "Rapports PDF générés automatiquement, plus de saisie manuelle",
              "Vos équipes ne changent pas leurs habitudes",
              "Historique complet pour la traçabilité et les bilans",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Essayez ChantierOps maintenant
          </h2>
          <p className="text-blue-200 mb-8 leading-relaxed">
            Accès immédiat au tableau de bord avec des données de démonstration.
            Aucune inscription, aucune carte bancaire.
          </p>
          <Link
            href={DEMO_URL}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold bg-white hover:bg-gray-100 transition shadow-lg"
            style={{ color: '#1e3a5f' }}
          >
            Accéder à la démo gratuite
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-blue-300 text-xs mt-4">Démo disponible en ligne — chantiers, équipes et rapports inclus</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <HardHat className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-gray-600">ChantierOps</span>
            <span className="text-gray-300">·</span>
            <span>Gestion de chantiers Luxembourg</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href={DEMO_URL} className="hover:text-gray-600 transition">
              Démo
            </Link>
            <a
              href="https://github.com/Hugomelo123/-ChantierOps"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
