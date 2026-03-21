'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { whatsappApi, equipesApi } from '@/lib/api';
import { MessageSquare, Send, CheckCircle, XCircle, Phone } from 'lucide-react';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

const MODELES = [
  { label: 'Début de journée', texte: 'Bonjour équipe! Bonne journée de travail. Merci d\'envoyer votre rapport avant 17h00.' },
  { label: 'Sécurité', texte: '⚠️ Rappel sécurité: portez vos EPI (casque, gants, gilet). Sécurité avant tout.' },
  { label: 'Urgence matériaux', texte: '🚨 Les matériaux demandés sont en cours de livraison. Prévenez le bureau dès réception.' },
  { label: 'Fin de semaine', texte: '📋 Fin de semaine: merci d\'envoyer votre bilan hebdomadaire avec avancement et heures.' },
];

export default function WhatsAppPage() {
  const [selectedEquipe, setSelectedEquipe] = useState('CARRELAGE');
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<{ success: boolean; equipe: string } | null>(null);

  const { data: configs } = useQuery({
    queryKey: ['equipes-config'],
    queryFn: equipesApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: ({ equipe, message }: { equipe: string; message: string }) =>
      whatsappApi.envoyerInstruction(equipe, message),
    onSuccess: (data) => {
      setLastResult({ success: data.success, equipe: selectedEquipe });
      setMessage('');
    },
    onError: () => setLastResult({ success: false, equipe: selectedEquipe }),
  });

  // Group configs by type — multiple teams per type possible
  const configsByType: Record<string, any[]> = {};
  for (const c of (configs || []) as any[]) {
    if (!configsByType[c.type]) configsByType[c.type] = [];
    configsByType[c.type].push(c);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Communiquez avec les équipes via WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Envoyer instruction */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Send className="w-4 h-4" /> Envoyer une instruction
            </h2>

            {/* Équipe selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Équipe destinataire</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EQUIPES.map(e => (
                  <button
                    key={e}
                    onClick={() => setSelectedEquipe(e)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedEquipe === e
                        ? 'bg-primary-700 text-white border-primary-700'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {EQUIPE_LABELS[e]}
                  </button>
                ))}
              </div>
            </div>

            {/* Config info — show all teams of selected type */}
            {configsByType[selectedEquipe]?.length > 0 && (
              <div className="mb-4 bg-gray-50 p-3 rounded-lg space-y-1.5">
                {configsByType[selectedEquipe].map((cfg: any) => (
                  <div key={cfg.id} className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-medium text-gray-700">{cfg.nom}</span>
                    <span className="text-gray-300">·</span>
                    <span>{cfg.chefNom}</span>
                    <span className="text-gray-300">·</span>
                    <span>{cfg.numeroWhatsApp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Templates */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Modèles de messages</label>
              <div className="grid grid-cols-2 gap-2">
                {MODELES.map(m => (
                  <button
                    key={m.label}
                    onClick={() => setMessage(m.texte)}
                    className="text-left px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={6}
                placeholder="Tapez votre message pour l'équipe..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">{message.length} caractères</p>
            </div>

            <button
              onClick={() => mutation.mutate({ equipe: selectedEquipe, message })}
              disabled={!message.trim() || mutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {mutation.isPending
                ? 'Envoi en cours...'
                : `Envoyer à l'équipe ${EQUIPE_LABELS[selectedEquipe]}`}
            </button>

            {lastResult && (
              <div className={`mt-3 flex items-center gap-2 p-3 rounded-lg text-sm ${
                lastResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {lastResult.success
                  ? <><CheckCircle className="w-4 h-4" /> Message envoyé avec succès à l'équipe {EQUIPE_LABELS[lastResult.equipe]}</>
                  : <><XCircle className="w-4 h-4" /> Erreur lors de l'envoi. Vérifiez la configuration Twilio.</>
                }
              </div>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-5">
          {/* Instructions format rapport */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-500" />
              Format rapport WhatsApp
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p className="font-medium text-gray-700">Les équipes peuvent envoyer leurs rapports en format libre ou structuré:</p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
                <p>Avancement: 75%</p>
                <p>HJ: 4</p>
                <p>Description des travaux...</p>
                <p>Problème: [si applicable]</p>
              </div>
              <p className="text-gray-500">Le système reconnaît automatiquement les mots-clés.</p>
            </div>
          </div>

          {/* Configs équipes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Numéros équipes</h2>
            <div className="space-y-3">
              {EQUIPES.map(e => {
                const teams = configsByType[e] || [];
                return (
                  <div key={e}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{EQUIPE_LABELS[e]}</p>
                    {teams.length === 0 ? (
                      <p className="text-xs text-red-400 pl-2">Non configuré</p>
                    ) : (
                      <div className="space-y-1 pl-2">
                        {teams.map((cfg: any) => (
                          <div key={cfg.id} className="flex items-center justify-between">
                            <p className="text-xs text-gray-700">{cfg.nom} — {cfg.chefNom}</p>
                            <p className="text-xs text-gray-500">{cfg.numeroWhatsApp}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Webhook info */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h2 className="font-semibold text-blue-800 mb-2 text-sm">Configuration Twilio</h2>
            <p className="text-xs text-blue-600">
              Webhook URL à configurer dans Twilio:
            </p>
            <code className="block mt-2 text-xs bg-white rounded p-2 text-blue-800 break-all">
              {typeof window !== 'undefined' ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/whatsapp/webhook` : '/api/whatsapp/webhook'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
