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
const EQUIPE_COLORS: Record<Equipe, string> = {
  CARRELAGE: 'bg-blue-100 text-blue-700 border-blue-200',
  MACONNERIE: 'bg-orange-100 text-orange-700 border-orange-200',
  FACADE: 'bg-green-100 text-green-700 border-green-200',
  ELECTRICITE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const emptyForm = (type: Equipe) => ({
  type,
  nom: '',
  chefNom: '',
  numeroWhatsApp: '',
  heureRapport: '17:00',
});

function TeamForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial: Partial<ConfigEquipe> & { type: Equipe };
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({ ...emptyForm(initial.type), ...initial });
  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nom de l'équipe *</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.nom}
            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            placeholder={`${EQUIPE_LABELS[initial.type]} A`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            <User className="w-3 h-3 inline mr-1" />Chef d'équipe *
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.chefNom}
            onChange={e => setForm(f => ({ ...f, chefNom: e.target.value }))}
            placeholder="Jean Müller"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            <Phone className="w-3 h-3 inline mr-1" />WhatsApp *
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.numeroWhatsApp}
            onChange={e => setForm(f => ({ ...f, numeroWhatsApp: e.target.value }))}
            placeholder="+352691000001"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            <Clock className="w-3 h-3 inline mr-1" />Heure limite rapport
          </label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.heureRapport}
            onChange={e => setForm(f => ({ ...f, heureRapport: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-100"
        >
          <X className="w-3.5 h-3.5" /> Annuler
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.nom || !form.chefNom || !form.numeroWhatsApp || isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-700 text-white rounded-lg text-xs font-medium hover:bg-primary-800 disabled:opacity-50"
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes-config'] });
      setAdding(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => equipesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes-config'] });
      setEditing(null);
    },
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Paramètres
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration des équipes WhatsApp — plusieurs équipes par type</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {EQUIPES.map(type => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${EQUIPE_COLORS[type]}`}>
                  {EQUIPE_LABELS[type]}
                </span>
                <span className="text-sm text-gray-400 font-normal">
                  {byType[type].length} équipe{byType[type].length !== 1 ? 's' : ''}
                </span>
              </h2>
              <button
                onClick={() => setAdding(adding === type ? null : type)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-50 text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-100"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            {byType[type].length === 0 && adding !== type && (
              <p className="text-sm text-gray-400 italic py-2">Aucune équipe configurée</p>
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
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{eq.nom}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />{eq.chefNom}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />{eq.numeroWhatsApp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{eq.heureRapport}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setEditing(eq.id)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer l'équipe "${eq.nom}" ?`)) deleteMutation.mutate(eq.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
        ))}
      </div>

      {/* Info Twilio */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Configuration Twilio WhatsApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Variables d'environnement requises</h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs space-y-1">
              <p>TWILIO_ACCOUNT_SID=ACxxx...</p>
              <p>TWILIO_AUTH_TOKEN=xxx...</p>
              <p>TWILIO_WHATSAPP_FROM=whatsapp:+14155238886</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">URL Webhook Twilio</h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs break-all">
              https://votre-domaine.com/api/whatsapp/webhook
            </div>
            <p className="text-xs text-gray-500 mt-2">
              À configurer dans la console Twilio → WhatsApp Sandbox → "When a message comes in"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
