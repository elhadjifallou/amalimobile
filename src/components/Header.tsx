import { Settings } from 'lucide-react';
import logoAmali from '@/assets/logo-amali.png';

interface HeaderProps {
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export default function Header({ showSettings = true, onSettingsClick }: HeaderProps) {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 12px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="px-5 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Logo */}
          <img 
            src={logoAmali} 
            alt="AMALI" 
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Texte amali avec police arrondie */}
          <h1 
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Quicksand', 'Nunito', 'Comfortaa', 'Poppins', 'Varela Round', sans-serif",
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            }}
          >
            amali
          </h1>
        </div>

        {showSettings && (
          <button
            onClick={onSettingsClick}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
            aria-label="Paramètres"
          >
            <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>
    </header>
  );
}