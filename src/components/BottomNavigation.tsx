import { Compass, Users, MessageCircle, User } from 'lucide-react';
import { ScreenType } from '@/types';
import { cn } from '@/utils/cn';

interface BottomNavigationProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  messagesNotificationCount?: number;
}

export default function BottomNavigation({ 
  activeScreen, 
  onNavigate,
  messagesNotificationCount = 0
}: BottomNavigationProps) {
  const navItems = [
    { id: 'discovery' as ScreenType, icon: Compass, label: 'Découvrir' },
    { id: 'community' as ScreenType, icon: Users, label: 'Communauté' },
    { 
      id: 'messages' as ScreenType, 
      icon: MessageCircle, 
      label: 'Messages',
      notificationCount: messagesNotificationCount
    },
    { id: 'profile' as ScreenType, icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe">
      {/* ✅ TINDER STYLE: Fond dégradé avec flou */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-transparent dark:from-slate-900/95 dark:via-slate-900/90 backdrop-blur-lg"></div>
      
      <div className="relative max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            const hasNotification = item.notificationCount && item.notificationCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center relative"
              >
                {/* ✅ BOUTON CIRCULAIRE TINDER STYLE */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-rose-500 to-amber-500 shadow-lg shadow-rose-500/30 scale-105" 
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
                )}>
                  <div className="relative">
                    <Icon className={cn(
                      "w-5 h-5 transition-all",
                      isActive ? "text-white stroke-[2.5]" : "text-slate-600 dark:text-slate-400"
                    )} />
                    
                    {/* ✅ BADGE CIRCULAIRE EN HAUT À DROITE */}
                    {hasNotification && (
                      <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-emerald-500 rounded-full flex items-center justify-center px-0.5 shadow-md">
                        <span className="text-[9px] font-bold text-white leading-none">
                          {item.notificationCount! > 99 ? '99+' : item.notificationCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* ✅ LABEL OPTIONNEL (caché par défaut, visible au hover) */}
                <span className={cn(
                  "text-[9px] font-medium mt-0.5 transition-opacity",
                  isActive ? "text-rose-500 dark:text-rose-400 opacity-100" : "text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}