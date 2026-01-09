import { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, TrendingUp, Calendar, BookOpen, Sparkles, Shield } from 'lucide-react';
import Header from './Header';
import SettingsScreen from './SettingsScreen';
import CreateEventModal from './CreateEventModal';
import ArticlesScreen from './ArticlesScreen';
import ArticleDetailScreen from './ArticleDetailScreen';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalUsers: number;
  totalMatches: number;
  totalConversations: number;
  successRate: number;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  color: string;
}

export default function CommunityScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showArticlesList, setShowArticlesList] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMatches: 0,
    totalConversations: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityStats();
  }, []);

  const loadCommunityStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('name', 'is', null);

      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted');

      const { count: conversationsCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .not('last_message', 'is', null);

      const successRate = usersCount && matchesCount 
        ? Math.round((matchesCount / usersCount) * 100)
        : 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMatches: matchesCount || 0,
        totalConversations: conversationsCount || 0,
        successRate,
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const articles: Article[] = [
    {
      id: '1',
      title: 'Les 5 principes d\'une rencontre halal',
      excerpt: 'Découvrez comment respecter vos valeurs tout en faisant de belles rencontres.',
      category: 'Conseils',
      readTime: '5 min',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: '2',
      title: 'Comment créer un profil authentique',
      excerpt: 'Soyez vous-même et attirez les bonnes personnes avec un profil sincère.',
      category: 'Guide',
      readTime: '4 min',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: '3',
      title: 'Les signes d\'un match compatible',
      excerpt: 'Apprenez à reconnaître les signaux d\'une vraie compatibilité.',
      category: 'Relations',
      readTime: '6 min',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: '4',
      title: 'Gérer les premières conversations',
      excerpt: 'Des conseils pour démarrer une discussion authentique et respectueuse.',
      category: 'Communication',
      readTime: '5 min',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const successStories = [
    {
      id: '1',
      text: "Grâce à Amali, j'ai rencontré quelqu'un qui partage vraiment mes valeurs. Nous sommes maintenant fiancés ! L'application a vraiment changé ma vie.",
      author: 'Aïssatou',
      location: 'Dakar',
      avatar: 'bg-rose-500',
    },
    {
      id: '2',
      text: "J'apprécie particulièrement le mode halal qui garantit des rencontres respectueuses. J'ai trouvé ma moitié après 3 mois !",
      author: 'Moussa',
      location: 'Thiès',
      avatar: 'bg-blue-500',
    },
    {
      id: '3',
      text: "Une application qui comprend nos valeurs et notre culture. Les matchs sont vraiment pertinents. Merci Amali !",
      author: 'Fatima',
      location: 'Saint-Louis',
      avatar: 'bg-purple-500',
    },
  ];

  const communityStats = [
    { 
      icon: Users, 
      label: 'Membres actifs', 
      value: loading ? '...' : stats.totalUsers.toLocaleString(), 
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    { 
      icon: Heart, 
      label: 'Matchs créés', 
      value: loading ? '...' : stats.totalMatches.toLocaleString(), 
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    { 
      icon: MessageCircle, 
      label: 'Conversations', 
      value: loading ? '...' : stats.totalConversations.toLocaleString(), 
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    { 
      icon: TrendingUp, 
      label: 'Taux de succès', 
      value: loading ? '...' : `${stats.successRate}%`, 
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  if (showSettings) {
    return <SettingsScreen onClose={() => setShowSettings(false)} />;
  }

  if (showArticlesList) {
    return (
      <ArticlesScreen
        onClose={() => setShowArticlesList(false)}
        onArticleClick={(articleId) => {
          setSelectedArticleId(articleId);
          setShowArticlesList(false);
        }}
      />
    );
  }

  if (selectedArticleId) {
    return (
      <ArticleDetailScreen
        articleId={selectedArticleId}
        onClose={() => setSelectedArticleId(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex flex-col">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onEventCreated={() => {
            loadCommunityStats();
          }}
        />
      )}

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pt-20">
        {/* En-tête de la communauté */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Communauté Amali</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Une communauté respectueuse et bienveillante
          </p>
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Badge Mode Halal */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Mode Halal Actif</h3>
              <p className="text-emerald-50 text-sm leading-relaxed">
                Toutes vos interactions sont protégées et respectent les valeurs islamiques. 
                Conversations respectueuses, pas de contenus inappropriés.
              </p>
            </div>
          </div>
        </div>

        {/* Articles et conseils */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">📚 Conseils & Guides</h3>
            <button 
              onClick={() => setShowArticlesList(true)}
              className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 dark:hover:text-rose-500 transition-colors"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-3">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${article.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500">{article.readTime}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{article.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Histoires de réussite */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Histoires de réussite</h3>
          </div>

          <div className="space-y-4">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-900/20 dark:to-rose-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 ${story.avatar} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                    {story.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{story.author}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{story.location}</p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{story.text}"
                </p>
                <div className="flex items-center gap-1 mt-3 text-amber-600 dark:text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Événements */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-32">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Événements à venir</h3>
          </div>
          
          <div className="space-y-3">
            <EventCard
              title="Rencontre communautaire - Dakar"
              date="Samedi 30 Nov, 15h00"
              participants={24}
              location="Café Culturel, Almadies"
            />
            <EventCard
              title="Discussion : Valeurs familiales"
              date="Dimanche 1 Déc, 17h00"
              participants={18}
              location="En ligne (Zoom)"
            />
          </div>

          <button 
            onClick={() => setShowCreateEvent(true)}
            className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:border-rose-400 dark:hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all font-medium"
          >
            + Proposer un événement
          </button>
        </div>
      </div>
    </div>
  );
}

interface EventCardProps {
  title: string;
  date: string;
  participants: number;
  location: string;
}

function EventCard({ title, date, participants, location }: EventCardProps) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">{title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{date}</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400">
          <Users className="w-4 h-4" />
          <span className="font-medium">{participants}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
        <span>📍</span>
        <span>{location}</span>
      </div>
    </div>
  );
}