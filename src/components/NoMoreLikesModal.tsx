import { X, Crown, Heart, Zap, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NoMoreLikesModalProps {
  onClose: () => void;
  onUpgrade: () => void;
  onActivateBoost: () => void;
  canUseBoost: boolean; // 1x par semaine gratuit
  timeUntilReset: string; // Ex: "5h 30min"
}

export default function NoMoreLikesModal({
  onClose,
  onUpgrade,
  onActivateBoost,
  canUseBoost,
  timeUntilReset,
}: NoMoreLikesModalProps) {
  const [countdown, setCountdown] = useState(timeUntilReset);

  useEffect(() => {
    // Mettre à jour le countdown chaque minute
    const interval = setInterval(() => {
      setCountdown(calculateTimeUntilMidnight());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Plus de likes !</h2>
            <p className="text-white/90 text-sm">
              Vous avez utilisé tous vos likes quotidiens
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Temps avant reset */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Recharge dans</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{countdown}</p>
          </div>

          {/* Boost gratuit */}
          {canUseBoost && (
            <button
              onClick={onActivateBoost}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6" fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Boost gratuit</p>
                    <p className="text-sm text-white/80">30 min de likes illimités</p>
                  </div>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  GRATUIT
                </span>
              </div>
            </button>
          )}

          {/* Upgrade Premium */}
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Ou passez Premium pour plus de likes
            </p>

            <div className="space-y-2">
              {/* Plan Élite */}
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-2xl p-4 hover:from-yellow-600 hover:to-amber-700 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Plan Élite</p>
                      <p className="text-sm text-white/90">100 likes / jour</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">4 900</p>
                    <p className="text-xs text-white/80">FCFA/mois</p>
                  </div>
                </div>
              </button>

              {/* Plan Prestige */}
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl p-4 hover:from-slate-800 hover:to-black transition-all shadow-lg border-2 border-amber-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Prestige</p>
                        <span className="bg-amber-500 px-2 py-0.5 rounded-full text-xs font-bold">
                          POPULAIRE
                        </span>
                      </div>
                      <p className="text-sm text-white/90">Likes ILLIMITÉS ♾️</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">7 900</p>
                    <p className="text-xs text-white/80">FCFA/mois</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Astuce */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-center">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 Astuce : Connectez-vous chaque jour pour gagner +5 likes bonus !
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}