'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chantiersApi, rapportsApi, whatsappApi } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, AlertTriangle, FileText, MessageSquare, CheckCircle, Send, Users } from 'lucide-react';
import { useState } from 'react';

const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};
const EQUIPE_BG: Record<string, { bg: string; color: string; border: string }> = {
  CARRELAGE:   { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  MACONNERIE:  { bg: 'rgba(217,119,6,0.15)',   color: '#fbbf24', border: 'rgba(217,119,6,0.3)' },
  FACADE:      { bg: 'rgba(22,163,74,0.15)',    color: '#4ade80', border: 'rgba(22,163,74,0.3)' },
  ELECTRICITE: { bg: 'rgba(124,58,237,0.15)',   color: '#a78bfa', border: 'rgba(124,58,237,0.3)' },
};

export default function ChantierDetail() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [instruction, setInstruction] = useState('');
  const [instructionEquipe, setInstructionEquipe] = useState('');
  const [showRapportForm, setShowRapportForm] = useState(false);
  const [rapportForm, setRapportForm] = useState({
    contenu: '', homesJour: 0, avancement: 0, problemes: '', equipe: '', configEquipeId: '',
  });

  const { data: chantier, isLoading } = useQuery({
    queryKey: ['chantier', id],
    queryFn: () => chantiersApi.getOne(id as string),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => chantiersApi.updateStatus(id as string, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chantier', id] }),
  });

  const rapportMutation = useMutation({
    mutationFn: (data: any) => rapportsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantier', id] });
      setShowRapportForm(false);
      setRapportForm({ contenu: '', homesJour: 0, avancement: 0, problemes: '', equipe: '', configEquipeId: '' });
    },
  });

  const instructionMutation = useMutation({
    mutationFn: ({ equipe, message }: { equipe: string; message: string }) =>
      whatsappApi.envoyerInstruction(equipe, message),
    onSuccess: () => setInstruction(''),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }
  if (!chantier) return null;

  const equipes = chantier.equipes || [];
  const uniqueTypes = Array.from(new Set(equipes.map(e => e.configEquipe.type)));
  if (!instructionEquipe && uniqueTypes.length > 0) setInstructionEquipe(uniqueTypes[0]);

  const statusStyles: Record<string, { bg: string; color: string }> = {
    OK:      { bg: '#16a34a', color: '#fff' },
    ALERTE:  { bg: '#dc2626', color: '#fff' },
    PARTIEL: { bg: '#d97706', color: '#fff' },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <div>
        <button
          onClick={() => router.push('/chantiers')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux chantiers
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{chantier.nom}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="text-sm text-slate-400">{chantier.adresse}, {chantier.codePostal} {chantier.ville}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {equipes.map(e => {
                const ec = EQUIPE_BG[e.configEquipe.type] || EQUIPE_BG.CARRELAGE;
                return (
                  <span key={e.configEquipeId} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.border}` }}>
                    {e.configEquipe.nom}
                  </span>
                );
              })}
              <Badge variant={chantier.status.toLowerCase() as any}>{chantier.status}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {(['OK', 'PARTIEL', 'ALERTE'] as const).map(s => {
              const ss = statusStyles[s];
              return (
                <button
                  key={s}
                  onClick={() => statusMutation.mutate(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={
                    chantier.status === s
                      ? { background: ss.bg, color: ss.color }
                      : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)' }
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Rapports */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Rapports récents
              </h2>
              <button
                onClick={() => setShowRapportForm(!showRapportForm)}
                className="text-xs px-3 py-1.5 rounded-lg text-white transition-colors"
                style={{ background: '#2563eb' }}
              >
                + Ajouter rapport
              </button>
            </div>

            {showRapportForm && (
              <div className="mb-4 p-4 rounded-lg space-y-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {equipes.length > 0 && (
                  <div>
                    <label className="text-xs text-slate-400 font-semibold">Équipe *</label>
                    <select
                      className="dk-select w-full mt-1"
                      value={rapportForm.configEquipeId}
                      onChange={e => {
                        const eq = equipes.find(eq => eq.configEquipeId === e.target.value);
                        setRapportForm(f => ({ ...f, configEquipeId: e.target.value, equipe: eq?.configEquipe.type || '' }));
                      }}
                    >
                      <option value="">Sélectionner...</option>
                      {equipes.map(e => (
                        <option key={e.configEquipeId} value={e.configEquipeId}>
                          {e.configEquipe.nom} ({EQUIPE_LABELS[e.configEquipe.type]})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <textarea className="dk-input resize-none" rows={3} placeholder="Description des travaux..." value={rapportForm.contenu} onChange={e => setRapportForm(f => ({ ...f, contenu: e.target.value }))} />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Avancement (%)</label>
                    <input type="number" min="0" max="100" className="dk-input mt-1" value={rapportForm.avancement} onChange={e => setRapportForm(f => ({ ...f, avancement: +e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Hommes·jour</label>
                    <input type="number" min="0" className="dk-input mt-1" value={rapportForm.homesJour} onChange={e => setRapportForm(f => ({ ...f, homesJour: +e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Problèmes</label>
                    <input className="dk-input mt-1" value={rapportForm.problemes} onChange={e => setRapportForm(f => ({ ...f, problemes: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowRapportForm(false)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>Annuler</button>
                  <button
                    onClick={() => rapportMutation.mutate({ ...rapportForm, chantierId: chantier.id })}
                    disabled={!rapportForm.contenu || rapportMutation.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs text-white disabled:opacity-50"
                    style={{ background: '#2563eb' }}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {chantier.rapports && chantier.rapports.length > 0 ? (
              <div className="space-y-3">
                {chantier.rapports.map(r => {
                  const ec = EQUIPE_BG[r.configEquipe?.type || r.equipe];
                  return (
                    <div key={r.id} className="rounded-lg p-4" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </span>
                          {ec && (
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: ec.bg, color: ec.color }}>
                              {r.configEquipe?.nom || EQUIPE_LABELS[r.equipe]}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>{r.avancement}% avancement</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>{r.homesJour} H/J</span>
                          {r.source === 'WHATSAPP' && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80' }}>WhatsApp</span>}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{r.contenu}</p>
                      {r.problemes && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {r.problemes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600 text-sm">Aucun rapport</div>
            )}
          </div>

          {/* Alertes */}
          {chantier.alertes && chantier.alertes.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Alertes
              </h2>
              <div className="space-y-2">
                {chantier.alertes.map(a => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={a.resolue ? { background: 'rgba(255,255,255,0.04)' } : { background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
                  >
                    {a.resolue
                      ? <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      : <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{a.message}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Info */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-slate-100 mb-3">Informations</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Début', new Date(chantier.dateDebut).toLocaleDateString('fr-FR')],
                chantier.dateFin ? ['Fin prévue', new Date(chantier.dateFin).toLocaleDateString('fr-FR')] : null,
                ['Rapports', String(chantier._count?.rapports || 0)],
                ['Demandes mat.', String(chantier._count?.demandesMat || 0)],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-semibold text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>

            {equipes.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Équipes assignées
                </p>
                <div className="space-y-1.5">
                  {equipes.map(e => {
                    const ec = EQUIPE_BG[e.configEquipe.type];
                    return (
                      <div key={e.configEquipeId} className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: ec?.bg, color: ec?.color }}>
                          {e.configEquipe.nom}
                        </span>
                        <span className="text-xs text-slate-500">{e.configEquipe.chefNom}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {chantier.notes && (
              <div className="mt-3 pt-3 text-xs text-slate-500" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {chantier.notes}
              </div>
            )}
          </div>

          {/* Instruction WhatsApp */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-slate-100 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-400" /> Envoyer instruction
            </h2>
            {uniqueTypes.length > 1 && (
              <div className="mb-3">
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Équipe destinataire</label>
                <select className="dk-select w-full" value={instructionEquipe} onChange={e => setInstructionEquipe(e.target.value)}>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>Toutes les {EQUIPE_LABELS[type]}</option>
                  ))}
                </select>
              </div>
            )}
            <textarea
              className="dk-input resize-none"
              rows={4}
              placeholder="Instructions pour l'équipe..."
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
            />
            <button
              onClick={() => instructionMutation.mutate({ equipe: instructionEquipe || uniqueTypes[0] || '', message: instruction })}
              disabled={!instruction || !instructionEquipe || instructionMutation.isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: '#16a34a' }}
            >
              <Send className="w-4 h-4" />
              {instructionMutation.isPending ? 'Envoi...' : 'Envoyer via WhatsApp'}
            </button>
            {instructionMutation.isSuccess && (
              <p className="text-xs text-green-400 mt-1 text-center">Message envoyé!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
