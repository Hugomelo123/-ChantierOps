'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chantiersApi, rapportsApi, whatsappApi, type ConfigEquipe } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  MessageSquare,
  CheckCircle,
  Send,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const EQUIPE_LABELS: Record<string, string> = {
  CARRELAGE: 'Carrelage',
  MACONNERIE: 'Maçonnerie',
  FACADE: 'Façade',
  ELECTRICITE: 'Électricité',
};
const EQUIPE_COLORS: Record<string, string> = {
  CARRELAGE: 'bg-blue-50 text-blue-700 border-blue-200',
  MACONNERIE: 'bg-orange-50 text-orange-700 border-orange-200',
  FACADE: 'bg-green-50 text-green-700 border-green-200',
  ELECTRICITE: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export default function ChantierDetail() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [instruction, setInstruction] = useState('');
  const [instructionEquipe, setInstructionEquipe] = useState('');
  const [showRapportForm, setShowRapportForm] = useState(false);
  const [rapportForm, setRapportForm] = useState({
    contenu: '',
    homesJour: 0,
    avancement: 0,
    problemes: '',
    equipe: '',
    configEquipeId: '',
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
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-700 border-t-transparent" />
      </div>
    );
  }

  if (!chantier) return null;

  const equipes = chantier.equipes || [];

  // Unique types for instruction selector
  const uniqueTypes = Array.from(new Set(equipes.map(e => e.configEquipe.type)));

  // Set default equipe in instruction selector once loaded
  if (!instructionEquipe && uniqueTypes.length > 0) {
    setInstructionEquipe(uniqueTypes[0]);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => router.push('/chantiers')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux chantiers
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{chantier.nom}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">{chantier.adresse}, {chantier.codePostal} {chantier.ville}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {equipes.map(e => (
                <span
                  key={e.configEquipeId}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${EQUIPE_COLORS[e.configEquipe.type]}`}
                >
                  {e.configEquipe.nom}
                </span>
              ))}
              <Badge variant={chantier.status.toLowerCase() as any}>{chantier.status}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {(['OK', 'PARTIEL', 'ALERTE'] as const).map(s => (
              <button
                key={s}
                onClick={() => statusMutation.mutate(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  chantier.status === s
                    ? s === 'OK' ? 'bg-green-500 text-white border-green-500'
                    : s === 'ALERTE' ? 'bg-red-500 text-white border-red-500'
                    : 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Rapports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Rapports récents
              </h2>
              <button
                onClick={() => setShowRapportForm(!showRapportForm)}
                className="text-xs px-3 py-1.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
              >
                + Ajouter rapport
              </button>
            </div>

            {showRapportForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                {/* Team selector */}
                {equipes.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Équipe qui rapporte *</label>
                    <select
                      className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={rapportForm.configEquipeId}
                      onChange={e => {
                        const eq = equipes.find(eq => eq.configEquipeId === e.target.value);
                        setRapportForm(f => ({
                          ...f,
                          configEquipeId: e.target.value,
                          equipe: eq?.configEquipe.type || '',
                        }));
                      }}
                    >
                      <option value="">Sélectionner une équipe...</option>
                      {equipes.map(e => (
                        <option key={e.configEquipeId} value={e.configEquipeId}>
                          {e.configEquipe.nom} ({EQUIPE_LABELS[e.configEquipe.type]})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Description des travaux effectués..."
                  value={rapportForm.contenu}
                  onChange={e => setRapportForm(f => ({ ...f, contenu: e.target.value }))}
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Avancement (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-1"
                      value={rapportForm.avancement}
                      onChange={e => setRapportForm(f => ({ ...f, avancement: +e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Hommes·jour</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-1"
                      value={rapportForm.homesJour}
                      onChange={e => setRapportForm(f => ({ ...f, homesJour: +e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Problèmes</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-1"
                      value={rapportForm.problemes}
                      onChange={e => setRapportForm(f => ({ ...f, problemes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRapportForm(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => rapportMutation.mutate({
                      ...rapportForm,
                      chantierId: chantier.id,
                    })}
                    disabled={!rapportForm.contenu || rapportMutation.isPending}
                    className="px-3 py-1.5 bg-primary-700 text-white rounded-lg text-xs hover:bg-primary-800 disabled:opacity-50"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {chantier.rapports && chantier.rapports.length > 0 ? (
              <div className="space-y-3">
                {chantier.rapports.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(r.date).toLocaleDateString('fr-FR', {
                            weekday: 'long', day: 'numeric', month: 'long',
                          })}
                        </span>
                        {(r.configEquipe || r.equipe) && (
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${EQUIPE_COLORS[r.configEquipe?.type || r.equipe]}`}>
                            {r.configEquipe?.nom || EQUIPE_LABELS[r.equipe]}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {r.avancement}% avancement
                        </span>
                        <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
                          {r.homesJour} H/J
                        </span>
                        {r.source === 'WHATSAPP' && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                            WhatsApp
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{r.contenu}</p>
                    {r.problemes && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {r.problemes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">Aucun rapport</div>
            )}
          </div>

          {/* Alertes */}
          {chantier.alertes && chantier.alertes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Alertes
              </h2>
              <div className="space-y-2">
                {chantier.alertes.map(a => (
                  <div
                    key={a.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      a.resolue ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'
                    }`}
                  >
                    {a.resolue
                      ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      : <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{a.message}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        {a.configEquipe && (
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${EQUIPE_COLORS[a.configEquipe.type]}`}>
                            {a.configEquipe.nom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Informations</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Début</dt>
                <dd className="font-medium">{new Date(chantier.dateDebut).toLocaleDateString('fr-FR')}</dd>
              </div>
              {chantier.dateFin && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fin prévue</dt>
                  <dd className="font-medium">{new Date(chantier.dateFin).toLocaleDateString('fr-FR')}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Rapports</dt>
                <dd className="font-medium">{chantier._count?.rapports || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Demandes mat.</dt>
                <dd className="font-medium">{chantier._count?.demandesMat || 0}</dd>
              </div>
            </dl>

            {/* Teams list */}
            {equipes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Équipes assignées
                </p>
                <div className="space-y-1.5">
                  {equipes.map(e => (
                    <div key={e.configEquipeId} className="flex items-center justify-between">
                      <div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium border ${EQUIPE_COLORS[e.configEquipe.type]}`}>
                          {e.configEquipe.nom}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{e.configEquipe.chefNom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chantier.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">{chantier.notes}</p>
              </div>
            )}
          </div>

          {/* Instruction WhatsApp */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-500" /> Envoyer instruction
            </h2>

            {uniqueTypes.length > 1 && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 font-medium mb-1 block">Équipe destinataire</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={instructionEquipe}
                  onChange={e => setInstructionEquipe(e.target.value)}
                >
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>Toutes les {EQUIPE_LABELS[type]}</option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Instructions pour l'équipe..."
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
            />
            <button
              onClick={() => instructionMutation.mutate({
                equipe: instructionEquipe || uniqueTypes[0] || '',
                message: instruction,
              })}
              disabled={!instruction || !instructionEquipe || instructionMutation.isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {instructionMutation.isPending ? 'Envoi...' : 'Envoyer via WhatsApp'}
            </button>
            {instructionMutation.isSuccess && (
              <p className="text-xs text-green-600 mt-1 text-center">Message envoyé!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
