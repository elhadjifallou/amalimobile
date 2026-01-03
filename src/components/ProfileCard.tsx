import { useState } from 'react';
import { X, Heart, MapPin, Briefcase, GraduationCap, Ruler, Sparkles, Crown, Star } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  image: string[];
  interests: string[];
  distance: number;
  verified: boolean;
  compatibility: number;
  profession: string;
  education: string;
  height: number;
  religion: string;
  premiumTier?: 'essentiel' | 'elite' | 'prestige' | 'prestige-femme';
}

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
  isAnimating: boolean;
}

export default function ProfileCard({ profile, onLike, onPass, isAnimating }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const getTierStyling = () => {
    switch (profile.premiumTier) {
      case 'essentiel':
        return {
          gradient: 'from-amber-600 to-orange-700',
          icon: Star,
          label: 'Essentiel',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-500'
        };
      case 'elite':
        return {
          gradient: 'from-yellow-500 to-amber-600',
          icon: Crown,
          label: 'Élite',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500'
        };
      case 'prestige':
        return {
          gradient: 'from-slate-400 to-slate-600',
          icon: Sparkles,
          label: 'Prestige',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-400'
        };
      case 'prestige-femme':
        return {
          gradient: 'from-pink-400 to-rose-500',
          icon: Sparkles,
          label: 'Prestige Femme',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-400'
        };
      default:
        return null;
    }
  };

  const tierStyling = getTierStyling();

  const getPremiumFeatures = (tier?: string) => {
    switch (tier) {
      case 'essentiel':
        return [
          '80 likes par jour',
          '5 super likes par jour',
          'Profil mis en avant',
        ];
      case 'elite':
        return [
          '100 likes par jour',
          '7 super likes par jour',
          'Voir qui vous a aimé',
          'Annuler un swipe',
          'Visibilité accrue',
        ];
      case 'prestige':
        return [
          'Likes illimités',
          '20 super likes par jour',
          'Appels vidéo',
          'Voir qui vous a aimé',
          'Annuler un swipe',
          'Visibilité maximale',
          'Statistiques de popularité',
        ];
      case 'prestige-femme':
        return [
          'Likes illimités',
          'Voir qui vous a aimé',
          'Annuler un match',
          'Priorité modérée',
          'Sécurité renforcée',
        ];
      default:
        return [];
    }
  };

  const nextImage = () => {
    if (currentImageIndex < profile.image.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className={`relative w-full mx-auto transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
      style={{
        maxWidth: '500px',
        height: '100%',
        minHeight: '0',
      }}
    >
      <div 
        className="relative w-full h-full rounded-3xl shadow-2xl bg-white dark:bg-slate-900 overflow-hidden"
        style={{
          touchAction: 'none',
        }}
      >
        
        {/* SECTION PHOTO */}
        <div 
          className="relative w-full h-full bg-slate-900 dark:bg-slate-950 select-none"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <img
            src={profile.image[currentImageIndex] || '/placeholder-profile.jpg'}
            alt={profile.name}
            className="w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Dots indicateurs */}
          {profile.image.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {profile.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  style={{ touchAction: 'auto' }}
                  className={`h-1 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-8 bg-white'
                      : 'w-6 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Zones de clic pour navigation */}
          {profile.image.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
                  style={{ touchAction: 'auto' }}
                  aria-label="Photo précédente"
                />
              )}
              {currentImageIndex < profile.image.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
                  style={{ touchAction: 'auto' }}
                  aria-label="Photo suivante"
                />
              )}
            </>
          )}

          {/* Badge Premium */}
          {tierStyling && (
            <div className="absolute top-16 left-4 z-20">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md rounded-full bg-gradient-to-r ${tierStyling.gradient}`}
              >
                <tierStyling.icon className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {tierStyling.label}
                </span>
              </div>
            </div>
          )}

          {/* Nom et âge */}
          <div 
            className="absolute left-4 right-16 z-10"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom) + 170px)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
                {profile.name}, {profile.age}
              </h2>
              {profile.premiumTier && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{profile.location} • À {profile.distance} km</span>
            </div>
          </div>

          {/* Bouton info */}
          <button
            onClick={() => setShowFullProfile(true)}
            className="absolute right-4 z-20 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white/50 dark:border-slate-700/50"
            style={{ 
              touchAction: 'auto',
              bottom: 'calc(env(safe-area-inset-bottom) + 90px)',
            }}
            aria-label="Voir le profil complet"
          >
            <span className="text-2xl">ℹ️</span>
          </button>
        </div>
      </div>

      {/* BOUTONS LIKE/PASS - Cachés quand modal ouvert */}
      {!showFullProfile && (
        <div 
          className="absolute left-0 right-0 flex justify-center items-center gap-4 sm:gap-6 px-4 sm:px-6 pointer-events-none z-50"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom) + 90px)',
          }}
        >
          <button
            onClick={onPass}
            style={{ touchAction: 'auto' }}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-slate-200 dark:border-slate-700 pointer-events-auto"
            aria-label="Passer"
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8 text-slate-600 dark:text-slate-400" />
          </button>

          <button
            onClick={onLike}
            style={{ touchAction: 'auto' }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto"
            aria-label="Aimer"
          >
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
          </button>
        </div>
      )}

      {/* PROFIL COMPLET */}
      {showFullProfile && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-5 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFullProfile(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.name}, {profile.age}
              </h2>
              <div className="w-10" />
            </div>
          </div>

          {/* Contenu */}
          <div className="p-5 space-y-6 pb-32">
            {/* Photos */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={profile.image[currentImageIndex] || '/placeholder-profile.jpg'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              
              {profile.image.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {profile.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1 rounded-full transition-all ${
                        index === currentImageIndex ? 'w-8 bg-white' : 'w-6 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Badge compatibilité */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-full">
                <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400" />
                <span className="text-rose-700 dark:text-rose-400 font-semibold text-sm">
                  {profile.compatibility}% compatible
                </span>
              </div>
            </div>

            {/* Localisation */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="w-5 h-5" />
              <span className="text-base">{profile.location} • À {profile.distance} km</span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  À propos
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Informations */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Informations</h3>
              
              {profile.profession && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Profession</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.profession}</p>
                  </div>
                </div>
              )}

              {profile.education && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Études</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.education}</p>
                  </div>
                </div>
              )}

              {profile.height > 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Taille</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.height} cm</p>
                  </div>
                </div>
              )}

              {profile.religion && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg">🕌</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pratique religieuse</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.religion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Centres d'intérêt */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Centres d'intérêt</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Avantages Premium */}
            {tierStyling && (
              <div className={`p-5 ${tierStyling.bgColor} border-2 ${tierStyling.borderColor} rounded-2xl`}>
                <div className="flex items-center gap-2 mb-3">
                  <tierStyling.icon className={`w-5 h-5 bg-gradient-to-r ${tierStyling.gradient} bg-clip-text text-transparent`} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Membre {tierStyling.label}
                  </h3>
                </div>
                <div className="space-y-2">
                  {getPremiumFeatures(profile.premiumTier).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${tierStyling.gradient} flex items-center justify-center`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutons du modal profil complet */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent flex justify-center items-center gap-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
            <button
              onClick={() => {
                setShowFullProfile(false);
                onPass();
              }}
              className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-slate-200 dark:border-slate-700"
            >
              <X className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </button>

            <button
              onClick={() => {
                setShowFullProfile(false);
                onLike();
              }}
              className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
              <Heart className="w-10 h-10 text-white fill-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}