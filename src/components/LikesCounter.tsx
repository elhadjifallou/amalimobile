import { Heart, Zap, RotateCcw, Flame } from 'lucide-react';

interface LikesCounterProps {
  likesRemaining: number;
  superLikesRemaining: number;
  rewindRemaining: number;
  boostActive: boolean;
  boostExpiresAt: string | null;
  streakDays: number;
  subscriptionTier: string;
}

export default function LikesCounter({
  likesRemaining,
  superLikesRemaining,
  rewindRemaining,
  boostActive,
  boostExpiresAt,
  streakDays,
  subscriptionTier,
}: LikesCounterProps) {
  
  // Calculer temps restant du boost
  const getBoostTimeRemaining = () => {
    if (!boostActive || !boostExpiresAt) return null;
    
    const now = new Date();
    const expires = new Date(boostExpiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Couleur selon le niveau
  const getLikesColor = () => {
    if (boostActive) return 'text-purple-600 dark:text-purple-400';
    if (subscriptionTier.includes('prestige')) return 'text-amber-600 dark:text-amber-400';
    if (likesRemaining === 0) return 'text-red-600 dark:text-red-400';
    if (likesRemaining <= 3) return 'text-orange-600 dark:text-orange-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const boostTime = getBoostTimeRemaining();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-2">
      {/* Compteur principal de likes */}
      <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-lg border-2 border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Heart className={`w-5 h-5 ${getLikesColor()}`} fill="currentColor" />
          <span className={`font-bold ${getLikesColor()}`}>
            {boostActive ? '∞' : subscriptionTier.includes('prestige') ? '∞' : likesRemaining}
          </span>
        </div>

        {superLikesRemaining > 0 && (
          <>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" />
              <span className="font-bold text-blue-600 dark:text-blue-400">{superLikesRemaining}</span>
            </div>
          </>
        )}

        {rewindRemaining > 0 && (
          <>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-amber-600 dark:text-amber-400">{rewindRemaining}</span>
            </div>
          </>
        )}

        {streakDays > 1 && (
          <>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" />
              <span className="font-bold text-orange-600 dark:text-orange-400">{streakDays}</span>
            </div>
          </>
        )}
      </div>

      {/* Boost actif */}
      {boostActive && boostTime && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 mx-auto animate-pulse">
          <Zap className="w-4 h-4" fill="currentColor" />
          <span className="text-sm font-bold">Boost: {boostTime}</span>
        </div>
      )}

      {/* Alerte likes faibles */}
      {!boostActive && likesRemaining <= 3 && likesRemaining > 0 && !subscriptionTier.includes('prestige') && (
        <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-500 text-orange-700 dark:text-orange-400 rounded-lg px-3 py-1.5 text-xs text-center">
          ⚠️ Plus que {likesRemaining} like{likesRemaining > 1 ? 's' : ''} !
        </div>
      )}
    </div>
  );
}