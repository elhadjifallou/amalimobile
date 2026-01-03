import { ArrowLeft, Clock, Share2, Bookmark, Heart } from 'lucide-react';

interface ArticleDetailScreenProps {
  articleId: string;
  onClose: () => void;
}

// Contenu complet des articles
const articlesContent: { [key: string]: any } = {
  '1': {
    title: 'Les 5 principes d\'une rencontre halal',
    category: 'Conseils',
    readTime: '5 min',
    color: 'from-emerald-500 to-teal-500',
    content: `
      <h2>Introduction</h2>
      <p>Dans notre communauté, trouver l'amour tout en respectant nos valeurs est une priorité. Voici 5 principes essentiels pour des rencontres halal.</p>
      
      <h2>1. L'intention sincère (Niyyah)</h2>
      <p>Avant toute chose, clarifiez votre intention. Cherchez-vous vraiment le mariage ? Êtes-vous prêt(e) à vous engager ? Une intention pure est la base d'une rencontre halal.</p>
      
      <h2>2. La transparence dès le début</h2>
      <p>Soyez honnête sur vos attentes, vos valeurs, et votre vision du mariage. La transparence évite les malentendus et permet de construire une relation solide.</p>
      
      <h2>3. Impliquer la famille au bon moment</h2>
      <p>La famille joue un rôle important dans l'islam. Après quelques échanges constructifs, n'hésitez pas à impliquer vos proches pour avancer sereinement.</p>
      
      <h2>4. Respecter les limites islamiques</h2>
      <p>Gardez vos conversations respectueuses. Évitez les sujets inappropriés et les rencontres en privé sans mahram. Le respect des limites protège votre cœur et votre foi.</p>
      
      <h2>5. La patience et la confiance en Allah</h2>
      <p>Ne vous précipitez pas. Prenez le temps de connaître la personne tout en restant dans les limites. Faites des dou'as et ayez confiance : Allah a déjà écrit votre histoire.</p>
      
      <h2>Conclusion</h2>
      <p>Ces 5 principes vous guideront vers des rencontres authentiques et bénis. Rappelez-vous : le bon moment arrivera quand vous serez prêt(e) et quand ce sera écrit pour vous. Soyez patient(e) et gardez la foi ! 💚</p>
    `,
  },
  '2': {
    title: 'Comment créer un profil authentique',
    category: 'Guide',
    readTime: '4 min',
    color: 'from-blue-500 to-indigo-500',
    content: `
      <h2>L'importance d'un profil sincère</h2>
      <p>Votre profil est votre première impression. Un profil authentique attire les bonnes personnes et évite les malentendus.</p>
      
      <h2>1. Une photo naturelle et récente</h2>
      <p>Choisissez une photo qui vous ressemble vraiment. Pas de filtres excessifs : soyez vous-même ! Une photo souriante et naturelle inspire confiance.</p>
      
      <h2>2. Une bio sincère</h2>
      <p>Parlez de vos valeurs, vos passions, ce que vous recherchez. Évitez les clichés. Exemple : "Passionné(e) de lecture, je cherche quelqu'un avec qui partager des moments simples et authentiques."</p>
      
      <h2>3. Vos valeurs et priorités</h2>
      <p>Soyez clair(e) sur vos valeurs religieuses, familiales, et vos objectifs de vie. Cela aide à trouver des personnes compatibles.</p>
      
      <h2>4. Évitez de survendre</h2>
      <p>Pas besoin d'exagérer. La simplicité et l'honnêteté attirent bien plus que des descriptions trop parfaites.</p>
      
      <h2>Conclusion</h2>
      <p>Un profil authentique, c'est la clé pour des rencontres sincères. Soyez vous-même, et les bonnes personnes viendront naturellement. ✨</p>
    `,
  },
  '3': {
    title: 'Les signes d\'un match compatible',
    category: 'Relations',
    readTime: '6 min',
    color: 'from-purple-500 to-pink-500',
    content: `
      <h2>Comment savoir si c'est la bonne personne ?</h2>
      <p>La compatibilité ne se résume pas à des points communs. Voici les signes d'un vrai match.</p>
      
      <h2>1. Valeurs partagées</h2>
      <p>Vous avez les mêmes priorités ? La religion, la famille, les projets de vie ? Si oui, c'est un excellent début.</p>
      
      <h2>2. Communication fluide</h2>
      <p>Les conversations sont naturelles, sans malaise. Vous pouvez parler de tout, même des sujets difficiles, dans le respect.</p>
      
      <h2>3. Respect mutuel</h2>
      <p>Vous vous sentez écouté(e) et respecté(e). La personne ne cherche pas à vous changer, mais vous accepte comme vous êtes.</p>
      
      <h2>4. Vision commune du mariage</h2>
      <p>Vous avez la même vision du mariage ? Enfants, rôles, gestion du foyer... Ces discussions sont essentielles.</p>
      
      <h2>5. Confort émotionnel</h2>
      <p>Vous vous sentez à l'aise, en sécurité. Pas de stress ou de doutes constants. L'amour doit apporter la paix, pas le chaos.</p>
      
      <h2>Conclusion</h2>
      <p>Un bon match, c'est avant tout une connexion sincère, des valeurs partagées, et une vision commune. Faites confiance à votre instinct ! 💜</p>
    `,
  },
  '4': {
    title: 'Gérer les premières conversations',
    category: 'Communication',
    readTime: '5 min',
    color: 'from-amber-500 to-orange-500',
    content: `
      <h2>Les premières conversations : conseils pratiques</h2>
      <p>Les débuts peuvent être intimidants. Voici comment démarrer sur de bonnes bases.</p>
      
      <h2>1. Commencez simplement</h2>
      <p>Pas besoin de phrases trop travaillées. Un simple "As-salamu alaykum, comment vas-tu ?" est parfait.</p>
      
      <h2>2. Posez des questions ouvertes</h2>
      <p>Au lieu de "Tu aimes lire ?", essayez "Qu'est-ce que tu aimes faire pendant ton temps libre ?". Ça lance des conversations plus riches.</p>
      
      <h2>3. Écoutez activement</h2>
      <p>Montrez que vous écoutez vraiment. Rebondissez sur ce que dit la personne, posez des questions de suivi.</p>
      
      <h2>4. Restez vous-même</h2>
      <p>Ne jouez pas un rôle. Soyez naturel(le), même si vous êtes timide. L'authenticité attire.</p>
      
      <h2>5. Respectez les limites</h2>
      <p>Évitez les sujets trop personnels trop vite. Respectez le rythme de l'autre.</p>
      
      <h2>Conclusion</h2>
      <p>Une bonne conversation, c'est un équilibre entre parler de soi et écouter l'autre. Soyez patient(e), les connexions prennent du temps. 🧡</p>
    `,
  },
};

export default function ArticleDetailScreen({ articleId, onClose }: ArticleDetailScreenProps) {
  const article = articlesContent[articleId];

  if (!article) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Article non trouvé</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl font-semibold"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header avec image */}
      <div className={`relative bg-gradient-to-br ${article.color} px-5 py-12`}>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all">
            <Bookmark className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto text-center text-white mt-8">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4">
            {article.category}
          </span>
          <h1 className="text-2xl font-bold mb-3">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de l'article */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-8">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Bouton J'aime */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Cet article vous a été utile ?</p>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all">
                <Heart className="w-5 h-5" />
                <span>J'aime</span>
              </button>
            </div>
          </div>

          {/* Articles similaires */}
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">À lire aussi</h3>
            <div className="space-y-3">
              <ArticleSuggestion
                title="L'importance de la famille dans le mariage"
                category="Relations"
              />
              <ArticleSuggestion
                title="Communication saine dans le couple"
                category="Communication"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour le contenu */}
      <style>{`
        .article-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .dark .article-content h2 {
          color: #f1f5f9;
        }
        .article-content p {
          color: #475569;
          line-height: 1.75;
          margin-bottom: 1.25rem;
        }
        .dark .article-content p {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

interface ArticleSuggestionProps {
  title: string;
  category: string;
}

function ArticleSuggestion({ title, category }: ArticleSuggestionProps) {
  return (
    <button className="w-full p-3 bg-white dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all text-left">
      <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">{category}</span>
      <p className="font-medium text-slate-900 dark:text-white text-sm">{title}</p>
    </button>
  );
}