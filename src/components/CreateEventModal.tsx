import { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, FileText } from 'lucide-react';
import { supabase, authService } from '@/lib/supabase';

interface CreateEventModalProps {
  onClose: () => void;
  onEventCreated: () => void;
}

export default function CreateEventModal({ onClose, onEventCreated }: CreateEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    eventType: 'in-person', // 'in-person' ou 'online'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        alert('Vous devez être connecté pour créer un événement');
        return;
      }

      // Combiner date + time en timestamp
      const eventDateTime = new Date(`${eventData.date}T${eventData.time}`);

      // Insérer l'événement dans Supabase
      const { error } = await supabase.from('community_events').insert({
        title: eventData.title,
        description: eventData.description,
        event_date: eventDateTime.toISOString(),
        location: eventData.location,
        event_type: eventData.eventType,
        max_participants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : null,
        organizer_id: user.id,
        status: 'pending', // En attente de modération
      });

      if (error) throw error;

      alert('✅ Événement proposé avec succès ! Il sera visible après validation.');
      onEventCreated();
      onClose();
    } catch (error: any) {
      console.error('Erreur création événement:', error);
      alert('❌ Erreur lors de la création de l\'événement : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        style={{
          marginTop: 'env(safe-area-inset-top)',
          marginBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Proposer un événement</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-5">
            
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Titre de l'événement *
              </label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Ex: Rencontre communautaire - Dakar"
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Décrivez votre événement..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date *
                </label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent accent-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Heure *
                </label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent accent-rose-500"
                  required
                />
              </div>
            </div>

            {/* Type d'événement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type d'événement *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEventData({ ...eventData, eventType: 'in-person' })}
                  className={`px-4 py-3 rounded-2xl border-2 font-medium transition-all ${
                    eventData.eventType === 'in-person'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  👥 En personne
                </button>
                <button
                  type="button"
                  onClick={() => setEventData({ ...eventData, eventType: 'online' })}
                  className={`px-4 py-3 rounded-2xl border-2 font-medium transition-all ${
                    eventData.eventType === 'online'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  💻 En ligne
                </button>
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Lieu *
              </label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder={eventData.eventType === 'online' ? 'Ex: Lien Zoom' : 'Ex: Café Culturel, Almadies'}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            {/* Nombre max de participants */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Nombre maximum de participants (optionnel)
              </label>
              <input
                type="number"
                value={eventData.maxParticipants}
                onChange={(e) => setEventData({ ...eventData, maxParticipants: e.target.value })}
                placeholder="Ex: 30"
                min="1"
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Info modération */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-800">
                ℹ️ Votre événement sera examiné par notre équipe avant d'être publié dans la communauté.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi...' : 'Proposer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}