import { useState } from 'react';
import { ArrowLeft, BookOpen, Search, } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  color: string;
}

interface ArticlesScreenProps {
  onClose: () => void;
  onArticleClick: (articleId: string) => void;
}

export default function ArticlesScreen({ onClose, onArticleClick }: ArticlesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Articles complets
  const allArticles: Article[] = [
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
    {
      id: '5',
      title: 'L\'importance de la famille dans le mariage',
      excerpt: 'Comment impliquer sa famille de manière respectueuse dans sa recherche.',
      category: 'Relations',
      readTime: '7 min',
      color: 'from-rose-500 to-pink-500',
    },
    {
      id: '6',
      title: 'Gérer le refus avec dignité',
      excerpt: 'Comment accepter un non et continuer sa recherche avec confiance.',
      category: 'Conseils',
      readTime: '4 min',
      color: 'from-slate-500 to-slate-600',
    },
    {
      id: '7',
      title: 'Les étapes avant le mariage',
      excerpt: 'De la première rencontre à la cérémonie : un guide complet.',
      category: 'Guide',
      readTime: '10 min',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: '8',
      title: 'Communication saine dans le couple',
      excerpt: 'Les bases d\'une communication respectueuse et constructive.',
      category: 'Communication',
      readTime: '6 min',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const categories = ['Tous', 'Conseils', 'Guide', 'Relations', 'Communication'];

  // Filtrage des articles
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-4 flex items-center gap-3 shadow-lg">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Conseils & Guides</h1>
          <p className="text-sm text-white/90">{filteredArticles.length} articles</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="px-5 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des articles */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">Aucun article trouvé</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Essayez une autre recherche</p>
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => onArticleClick(article.id)}
                className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:border-rose-300 dark:hover:border-rose-600 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${article.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">📖 {article.readTime}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 text-base">{article.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}