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
  { label: 'Début de journée', texte: "Bonjour équipe! Bonne journée de travail. Merci d'envoyer votre rapport avant 17h00." },
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

  const configsByType: Record<string, any[]> = {};
  for (const c of (configs || []) as any[]) {
    if (!configsByType[c.type]) configsByType[c.type] = [];
    configsByType[c.type].push(c);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">WhatsApp Bot</h1>
        <p className="text-sm text-slate-400 mt-0.5">Communiquez avec les équipes via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Envoyer instruction */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-slate-100 mb-5 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" /> Envoyer une instruction
            </h2>

            {/* Équipe selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Équipe destinataire</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EQUIPES.map(e => (
                  <button
                    key={e}
                    onClick={() => setSelectedEquipe(e)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={
                      selectedEquipe === e
                        ? { background: 'rgba(37,99,235,0.2)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.35)' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {EQUIPE_LABELS[e]}
                  </button>
                ))}
              </div>
            </div>

            {/* Config info */}
            {configsByType[selectedEquipe]?.length > 0 && (
              <div className="mb-5 p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {configsByType[selectedEquipe].map((cfg: any) => (
                  <div key={cfg.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span className="font-semibold text-slate-300">{cfg.nom}</span>
                    <span className="text-slate-600">·</span>
                    <span>{cfg.chefNom}</span>
                    <span className="text-slate-600">·</span>
                    <span>{cfg.numeroWhatsApp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Templates */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Modèles de messages</label>
              <div className="grid grid-cols-2 gap-2">
                {MODELES.map(m => (
                  <button
                    key={m.label}
                    onClick={() => setMessage(m.texte)}
                    className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Message</label>
              <textarea
                className="dk-input resize-none"
                rows={5}
                placeholder="Tapez votre message pour l'équipe..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <p className="text-xs text-slate-600 mt-1">{message.length} caractères</p>
            </div>

            <button
              onClick={() => mutation.mutate({ equipe: selectedEquipe, message })}
              disabled={!message.trim() || mutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm text-white disabled:opacity-50 transition-colors"
              style={{ background: '#16a34a' }}
              onMouseEnter={e => !mutation.isPending && (e.currentTarget.style.background = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}
            >
              <Send className="w-4 h-4" />
              {mutation.isPending ? 'Envoi en cours...' : `Envoyer à l'équipe ${EQUIPE_LABELS[selectedEquipe]}`}
            </button>

            {lastResult && (
              <div
                className="mt-3 flex items-center gap-2 p-3 rounded-lg text-sm"
                style={
                  lastResult.success
                    ? { background: 'rgba(22,163,74,0.15)', color: '#4ade80' }
                    : { background: 'rgba(220,38,38,0.15)', color: '#f87171' }
                }
              >
                {lastResult.success
                  ? <><CheckCircle className="w-4 h-4" /> Message envoyé à l'équipe {EQUIPE_LABELS[lastResult.equipe]}</>
                  : <><XCircle className="w-4 h-4" /> Erreur lors de l'envoi. Vérifiez la configuration Twilio.</>
                }
              </div>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-5">
          {/* Format rapport */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              Format rapport WhatsApp
            </h2>
            <p className="text-xs text-slate-400 mb-3">Les équipes peuvent envoyer leurs rapports en format libre ou structuré:</p>
            <div className="rounded-lg p-3 text-xs text-slate-300 space-y-1" style={{ background: 'rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
              <p>Avancement: 75%</p>
              <p>HJ: 4</p>
              <p>Description des travaux...</p>
              <p>Problème: [si applicable]</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Le système reconnaît automatiquement les mots-clés.</p>
          </div>

          {/* Numéros équipes */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-slate-100 mb-3">Numéros équipes</h2>
            <div className="space-y-3">
              {EQUIPES.map(e => {
                const teams = configsByType[e] || [];
                return (
                  <div key={e}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1" style={{ fontFamily: 'monospace' }}>{EQUIPE_LABELS[e]}</p>
                    {teams.length === 0 ? (
                      <p className="text-xs text-red-400 pl-2">Non configuré</p>
                    ) : (
                      <div className="space-y-1 pl-2">
                        {teams.map((cfg: any) => (
                          <div key={cfg.id} className="flex items-center justify-between">
                            <p className="text-xs text-slate-300">{cfg.nom} — {cfg.chefNom}</p>
                            <p className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>{cfg.numeroWhatsApp}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Webhook */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
            <h2 className="font-semibold text-blue-300 mb-2 text-sm">Configuration Twilio</h2>
            <p className="text-xs text-blue-400 mb-2">Webhook URL à configurer dans Twilio:</p>
            <code className="block text-xs rounded p-2 text-blue-300 break-all" style={{ background: 'rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
              {typeof window !== 'undefined' ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/whatsapp/webhook` : '/api/whatsapp/webhook'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
