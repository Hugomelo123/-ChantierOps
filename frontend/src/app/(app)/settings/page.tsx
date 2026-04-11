'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { equipesApi, type ConfigEquipe, type Equipe } from '@/lib/api';
import { Settings, Plus, Pencil, Trash2, Save, X, Phone, User, Clock } from 'lucide-react';

const EQUIPES: Equipe[] = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<Equipe, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};
const EQUIPE_COLORS: Record<Equipe, { bg: string; color: string; border: string }> = {
  CARRELAGE:   { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  MACONNERIE:  { bg: 'rgba(217,119,6,0.15)',   color: '#fbbf24', border: 'rgba(217,119,6,0.3)' },
  FACADE:      { bg: 'rgba(22,163,74,0.15)',    color: '#4ade80', border: 'rgba(22,163,74,0.3)' },
  ELECTRICITE: { bg: 'rgba(124,58,237,0.15)',   color: '#a78bfa', border: 'rgba(124,58,237,0.3)' },
};

const emptyForm = (type: Equipe) => ({
  type, nom: '', chefNom: '', numeroWhatsApp: '', heureRapport: '17:00',
});

function TeamForm({
  initial, onSave, onCancel, isPending,
}: {
  initial: Partial<ConfigEquipe> & { type: Equipe };
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({ ...emptyForm(initial.type), ...initial });
  return (
    <div className="mt-3 p-4 rounded-lg space-y-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nom de l'équipe *</label>
          <input className="dk-input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder={`${EQUIPE_LABELS[initial.type]} A`} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5"><User className="w-3 h-3 inline mr-1" />Chef d'équipe *</label>
          <input className="dk-input" value={form.chefNom} onChange={e => setForm(f => ({ ...f, chefNom: e.target.value }))} placeholder="Jean Müller" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5"><Phone className="w-3 h-3 inline mr-1" />WhatsApp *</label>
          <input className="dk-input" value={form.numeroWhatsApp} onChange={e => setForm(f => ({ ...f, numeroWhatsApp: e.target.value }))} placeholder="+352691000001" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5"><Clock className="w-3 h-3 inline mr-1" />Heure limite rapport</label>
          <input type="time" className="dk-input" value={form.heureRapport} onChange={e => setForm(f => ({ ...f, heureRapport: e.target.value }))} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <X className="w-3.5 h-3.5" /> Annuler
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.nom || !form.chefNom || !form.numeroWhatsApp || isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ background: '#2563eb' }}
        >
          <Save className="w-3.5 h-3.5" /> {isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: equipes = [] } = useQuery<ConfigEquipe[]>({
    queryKey: ['equipes-config'],
    queryFn: equipesApi.getAll,
  });
  const [adding, setAdding] = useState<Equipe | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: any) => equipesApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['equipes-config'] }); setAdding(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => equipesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['equipes-config'] }); setEditing(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => equipesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipes-config'] }),
  });

  const byType = EQUIPES.reduce((acc, type) => {
    acc[type] = (equipes as ConfigEquipe[]).filter(e => e.type === type);
    return acc;
  }, {} as Record<Equipe, ConfigEquipe[]>);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Paramètres
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Configuration des équipes WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {EQUIPES.map(type => {
          const ec = EQUIPE_COLORS[type];
          return (
            <div
              key={type}
              className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.border}` }}>
                    {EQUIPE_LABELS[type]}
                  </span>
                  <span className="text-sm text-slate-500 font-normal">
                    {byType[type].length} équipe{byType[type].length !== 1 ? 's' : ''}
                  </span>
                </h2>
                <button
                  onClick={() => setAdding(adding === type ? null : type)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                  style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.25)' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              {byType[type].length === 0 && adding !== type && (
                <p className="text-sm text-slate-600 italic py-2">Aucune équipe configurée</p>
              )}

              <div className="space-y-2">
                {byType[type].map(eq => (
                  <div key={eq.id}>
                    {editing === eq.id ? (
                      <TeamForm
                        initial={eq}
                        onSave={data => updateMutation.mutate({ id: eq.id, data })}
                        onCancel={() => setEditing(null)}
                        isPending={updateMutation.isPending}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-200">{eq.nom}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{eq.chefNom}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{eq.numeroWhatsApp}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{eq.heureRapport}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => setEditing(eq.id)} className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors rounded">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Supprimer l'équipe "${eq.nom}" ?`)) deleteMutation.mutate(eq.id); }}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {adding === type && (
                <TeamForm
                  initial={emptyForm(type)}
                  onSave={data => createMutation.mutate(data)}
                  onCancel={() => setAdding(null)}
                  isPending={createMutation.isPending}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Twilio info */}
      <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="font-bold text-slate-100 mb-4">Configuration Twilio WhatsApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-slate-300 mb-2">Variables d'environnement requises</h3>
            <div className="rounded-lg p-4 text-xs space-y-1 text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
              <p>TWILIO_ACCOUNT_SID=ACxxx...</p>
              <p>TWILIO_AUTH_TOKEN=xxx...</p>
              <p>TWILIO_WHATSAPP_FROM=whatsapp:+14155238886</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-300 mb-2">URL Webhook Twilio</h3>
            <div className="rounded-lg p-4 text-xs break-all text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
              https://votre-domaine.com/api/whatsapp/webhook
            </div>
            <p className="text-xs text-slate-600 mt-2">
              A configurer dans la console Twilio → WhatsApp Sandbox → "When a message comes in"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
