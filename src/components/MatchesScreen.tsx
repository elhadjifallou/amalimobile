import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, X, Sparkles } from 'lucide-react';
import { supabase, authService } from '@/lib/supabase';
import { cn } from '@/utils/cn';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  compatibility_score: number;
  conversation_id: string | null;
  // Infos de l'autre utilisateur
  other_user: {
    id: string;
    name: string;
    age: number;
    location: string;
    photo: string | null;
    bio: string;
    profession: string;
  };
}

interface MatchesScreenProps {
  onClose: () => void;
  onOpenChat: (conversationId: string) => void;
}

export default function MatchesScreen({ onClose, onOpenChat }: MatchesScreenProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'compatible'>('all');
  const [, setUserId] = useState<string>('');

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) return;

      setUserId(user.id);

      // Récupérer tous les matchs de l'utilisateur
      let query = supabase
        .from('matches')
        .select(`
          *,
          user1:user1_id(id, name, date_of_birth, location, profile_photo_url, bio, profession),
          user2:user2_id(id, name, date_of_birth, location, profile_photo_url, bio, profession),
          conversation:conversations(id)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'accepted');

      // Appliquer les filtres
      if (filter === 'recent') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query = query.gte('matched_at', sevenDaysAgo.toISOString());
      } else if (filter === 'compatible') {
        query = query.gte('compatibility_score', 80);
      }

      query = query.order('matched_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Erreur chargement matchs:', error);
        return;
      }

      // Calculer l'âge
      const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      // Formater les matchs
      const formattedMatches = (data || []).map((match: any) => {
        const isUser1 = match.user1_id === user.id;
        const otherUserData = isUser1 ? match.user2 : match.user1;

        return {
          ...match,
          conversation_id: match.conversation?.[0]?.id || null,
          other_user: {
            id: otherUserData.id,
            name: otherUserData.name || 'Utilisateur',
            age: calculateAge(otherUserData.date_of_birth),
            location: otherUserData.location || 'Non renseigné',
            photo: otherUserData.profile_photo_url,
            bio: otherUserData.bio || '',
            profession: otherUserData.profession || '',
          },
        };
      });

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return "Aujourd'hui";
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  const handleStartChat = (match: Match) => {
    if (match.conversation_id) {
      onOpenChat(match.conversation_id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-50 to-white">
      {/* En-tête */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vos Matchs</h2>
              <p className="text-sm text-slate-600">{matches.length} correspondance{matches.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === 'all'
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Tous ({matches.length})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === 'recent'
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Récents
          </button>
          <button
            onClick={() => setFilter('compatible')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1",
              filter === 'compatible'
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Compatibles
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="overflow-y-auto pb-8" style={{ height: 'calc(100vh - 140px)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === 'all' ? 'Aucun match pour le moment' : 'Aucun match dans cette catégorie'}
            </h3>
            <p className="text-slate-600 text-sm">
              {filter === 'all' 
                ? 'Continuez à swiper pour trouver votre moitié !'
                : 'Essayez un autre filtre'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Photo de profil */}
                <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200">
                  {match.other_user.photo ? (
                    <img
                      src={match.other_user.photo}
                      alt={match.other_user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {match.other_user.name[0]}
                      </div>
                    </div>
                  )}

                  {/* Badge de compatibilité */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-900">
                      {match.compatibility_score}%
                    </span>
                  </div>

                  {/* Badge "Nouveau" si récent (< 48h) */}
                  {new Date(match.matched_at).getTime() > Date.now() - 48 * 60 * 60 * 1000 && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full">
                      <span className="text-xs font-semibold text-white">
                        Nouveau
                      </span>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {match.other_user.name}, {match.other_user.age}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <span>📍</span>
                      {match.other_user.location}
                    </p>
                    {match.other_user.profession && (
                      <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                        <span>💼</span>
                        {match.other_user.profession}
                      </p>
                    )}
                  </div>

                  {match.other_user.bio && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {match.other_user.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>Match {formatMatchDate(match.matched_at)}</span>
                  </div>

                  {/* Bouton d'action */}
                  <button
                    onClick={() => handleStartChat(match)}
                    disabled={!match.conversation_id}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {match.conversation_id ? 'Envoyer un message' : 'Conversation indisponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
