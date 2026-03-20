'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { equipesApi } from '@/lib/api';
import { Settings, Save, Phone } from 'lucide-react';

const EQUIPES = ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'];
const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: configs } = useQuery({
    queryKey: ['equipes-config'],
    queryFn: equipesApi.getAll,
  });

  const configMap = Object.fromEntries(
    (configs || []).map((c: any) => [c.equipe, c])
  );

  const [forms, setForms] = useState<Record<string, any>>({});

  const getForm = (equipe: string) => {
    if (forms[equipe]) return forms[equipe];
    const cfg = configMap[equipe] || {};
    return {
      chefNom: cfg.chefNom || '',
      numeroWhatsApp: cfg.numeroWhatsApp || '',
      heureRapport: cfg.heureRapport || '17:00',
    };
  };

  const mutation = useMutation({
    mutationFn: ({ equipe, data }: { equipe: string; data: any }) =>
      equipesApi.getAll().then(() => {
        return fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/equipes/${equipe}/config`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        ).then(r => r.json());
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipes-config'] }),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" /> Paramètres
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration des équipes et notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EQUIPES.map(equipe => {
          const form = getForm(equipe);
          return (
            <div key={equipe} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                Équipe {EQUIPE_LABELS[equipe]}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du chef d'équipe</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={form.chefNom}
                    onChange={e => setForms(f => ({
                      ...f,
                      [equipe]: { ...getForm(equipe), chefNom: e.target.value }
                    }))}
                    placeholder="Jean Müller"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Numéro WhatsApp
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={form.numeroWhatsApp}
                    onChange={e => setForms(f => ({
                      ...f,
                      [equipe]: { ...getForm(equipe), numeroWhatsApp: e.target.value }
                    }))}
                    placeholder="+352691000001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure limite rapport</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={form.heureRapport}
                    onChange={e => setForms(f => ({
                      ...f,
                      [equipe]: { ...getForm(equipe), heureRapport: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <button
                onClick={() => mutation.mutate({ equipe, data: form })}
                disabled={mutation.isPending}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          );
        })}
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
