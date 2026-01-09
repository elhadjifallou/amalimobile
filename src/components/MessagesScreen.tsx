import { useState, useEffect } from 'react';
import { supabase, authService } from '@/lib/supabase';
import ChatScreen from './ChatScreen';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Heart } from 'lucide-react';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  otherUser: {
    id: string;
    name: string;
    profile_photo_url: string;
    age: number;
  };
}

interface Conversation {
  id: string;
  match_id: string;
  user1_id: string;
  user2_id: string;
  last_message: string | null;
  last_message_at: string;
  user1_unread_count: number;
  user2_unread_count: number;
  otherUser: {
    id: string;
    name: string;
    profile_photo_url: string;
    age: number;
  };
}

interface ChatScreenConversation {
  id: string;
  other_user_name: string;
  other_user_photo: string | null;
  user1_id: string;
  user2_id: string;
}

interface MessagesScreenProps {
  onChatStateChange?: (isInChat: boolean) => void;
  onNotificationCountChange?: (count: number) => void;
}

export default function MessagesScreen({ onChatStateChange, onNotificationCountChange }: MessagesScreenProps = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMatches, setNewMatches] = useState<Match[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatScreenConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  // Notifier App quand on ouvre/ferme un chat
  useEffect(() => {
    onChatStateChange?.(selectedConversation !== null);
  }, [selectedConversation, onChatStateChange]);

  // Calculer et envoyer le nombre de notifications
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => {
      const unreadCount = conv.user1_id === userId
        ? conv.user1_unread_count
        : conv.user2_unread_count;
      return sum + unreadCount;
    }, 0);

    const totalNotifications = totalUnread + newMatches.length;
    onNotificationCountChange?.(totalNotifications);
    
    console.log('📊 Notifications Messages:', {
      messagesNonLus: totalUnread,
      nouveauxMatchs: newMatches.length,
      total: totalNotifications
    });
  }, [conversations, newMatches, userId, onNotificationCountChange]);

  useEffect(() => {
    loadData();
    
    const channel = supabase
      .channel('messages-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) return;

      setUserId(user.id);

      // Charger les matchs
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(id, name, profile_photo_url, date_of_birth),
          user2:profiles!matches_user2_id_fkey(id, name, profile_photo_url, date_of_birth)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('matched_at', { ascending: false })
        .limit(10);

      // Charger toutes les conversations
      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('match_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      const conversationsMatchIds = new Set(
        conversationsData?.map(c => c.match_id) || []
      );

      // Nouveaux matchs = matchs SANS conversation
      const recentMatches = (matchesData || [])
        .filter(match => !conversationsMatchIds.has(match.id))
        .map(match => {
          const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
          const calculateAge = (dateOfBirth: string) => {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            return age;
          };

          return {
            id: match.id,
            user1_id: match.user1_id,
            user2_id: match.user2_id,
            matched_at: match.matched_at,
            otherUser: {
              id: otherUser.id,
              name: otherUser.name,
              profile_photo_url: otherUser.profile_photo_url,
              age: otherUser.date_of_birth ? calculateAge(otherUser.date_of_birth) : 0,
            },
          };
        });

      setNewMatches(recentMatches);

      // Charger TOUTES les conversations
      const { data: convData } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(id, name, profile_photo_url, date_of_birth),
          user2:profiles!conversations_user2_id_fkey(id, name, profile_photo_url, date_of_birth)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      const formattedConversations = (convData || []).map(conv => {
        const otherUser = conv.user1_id === user.id ? conv.user2 : conv.user1;
        const calculateAge = (dateOfBirth: string) => {
          const today = new Date();
          const birthDate = new Date(dateOfBirth);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };

        return {
          ...conv,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            profile_photo_url: otherUser.profile_photo_url,
            age: otherUser.date_of_birth ? calculateAge(otherUser.date_of_birth) : 0,
          },
        };
      });

      setConversations(formattedConversations);
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertToChatScreenFormat = (conv: Conversation): ChatScreenConversation => {
    return {
      id: conv.id,
      other_user_name: conv.otherUser.name,
      other_user_photo: conv.otherUser.profile_photo_url,
      user1_id: conv.user1_id,
      user2_id: conv.user2_id,
    };
  };

  const handleOpenChat = async (conversation: Conversation) => {
    const chatScreenConv = convertToChatScreenFormat(conversation);
    setSelectedConversation(chatScreenConv);
  };

  const handleOpenNewMatch = async (match: Match) => {
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('match_id', match.id)
      .maybeSingle();

    if (existingConv) {
      const conv: Conversation = {
        ...existingConv,
        otherUser: match.otherUser,
      };
      const chatScreenConv = convertToChatScreenFormat(conv);
      setSelectedConversation(chatScreenConv);
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          match_id: match.id,
          user1_id: match.user1_id,
          user2_id: match.user2_id,
          last_message: null,
          last_message_at: new Date().toISOString(),
          user1_unread_count: 0,
          user2_unread_count: 0,
        })
        .select()
        .single();

      if (newConv) {
        const conv: Conversation = {
          ...newConv,
          otherUser: match.otherUser,
        };
        const chatScreenConv = convertToChatScreenFormat(conv);
        setSelectedConversation(chatScreenConv);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedConversation) {
    return (
      <ChatScreen
        conversation={selectedConversation}
        currentUserId={userId}
        onBack={() => {
          setSelectedConversation(null);
          loadData();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex flex-col">
      {/* Nouveaux matchs - Fixed */}
      {newMatches.length > 0 && (
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 pt-20">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            Nouveaux Matchs
            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
              {newMatches.length}
            </span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {newMatches.map(match => (
              <button
                key={match.id}
                onClick={() => handleOpenNewMatch(match)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-rose-500 to-amber-500 p-1">
                    <img
                      src={match.otherUser.profile_photo_url}
                      alt={match.otherUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-900 dark:text-white max-w-[80px] truncate">
                  {match.otherUser.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barre de recherche - Fixed */}
      <div className={`flex-shrink-0 px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ${newMatches.length === 0 ? 'pt-20' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Liste des conversations - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Aucun message</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              Commencez à matcher pour démarrer des conversations !
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredConversations.map(conv => {
              const unreadCount = conv.user1_id === userId
                ? conv.user1_unread_count
                : conv.user2_unread_count;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleOpenChat(conv)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.otherUser.profile_photo_url}
                      alt={conv.otherUser.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{unreadCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {conv.otherUser.name}, {conv.otherUser.age}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {conv.last_message || 'Démarrez la conversation...'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}