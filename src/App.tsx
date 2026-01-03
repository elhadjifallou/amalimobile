import { useState, useEffect } from 'react';
import { ScreenType } from '@/types';
import DiscoveryScreen from '@/components/DiscoveryScreen';
import CommunityScreen from '@/components/CommunityScreen';
import MessagesScreen from '@/components/MessagesScreen';
import ProfileScreen from '@/components/ProfileScreen';
import BottomNavigation from '@/components/BottomNavigation';
import AuthScreen from '@/components/AuthScreen';
import ProfileCompletion from '@/components/ProfileCompletion';
import SplashScreen from '@/components/SplashScreen';
import { authService, AuthUser, supabase } from '@/lib/supabase';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('discovery');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isInChat, setIsInChat] = useState(false);
  const [messagesNotificationCount, setMessagesNotificationCount] = useState(0); // ✅ AJOUTÉ
  
  const { isDarkMode } = useTheme();
  
  useStatusBar(isDarkMode);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        checkProfileCompletion(user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user as AuthUser);
      if (user) {
        await checkProfileCompletion(user.id);
      }
    } catch (error) {
      console.error('❌ Erreur de vérification utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompletion = async (userId: string) => {
    try {
      console.log('🔍 Vérification du profil pour:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('profile_completed, name, profile_photo_url, date_of_birth, gender')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erreur de vérification du profil:', error);
        setNeedsProfileCompletion(true);
        return;
      }

      console.log('📊 Profil récupéré:', profile);
      console.log('📊 profile_completed:', profile?.profile_completed);
      console.log('📊 name:', profile?.name);
      console.log('📊 photo:', profile?.profile_photo_url);

      const isCompleted = profile?.profile_completed === true;

      console.log('✅ Profil complété ?', isCompleted);

      if (isCompleted && (!profile.name || !profile.profile_photo_url)) {
        console.warn('⚠️ profile_completed = true MAIS champs manquants !');
        console.warn('⚠️ On considère quand même comme complété pour éviter la boucle');
      }

      setNeedsProfileCompletion(!isCompleted);

    } catch (error) {
      console.error('❌ Erreur de vérification du profil:', error);
      setNeedsProfileCompletion(true);
    }
  };

  const handleProfileComplete = async () => {
    console.log('🎉 Profil complété avec succès - Rechargement...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      await checkProfileCompletion(user.id);
    }
    
    console.log('✅ Fermeture forcée de ProfileCompletion');
    setNeedsProfileCompletion(false);
  };

  const handleSplashFinish = () => {
    console.log('✅ Splash screen terminé');
    setShowSplash(false);
  };

  // ✅ AJOUTÉ : Callback pour recevoir le compteur de notifications
  const handleMessagesNotificationChange = (count: number) => {
    setMessagesNotificationCount(count);
    console.log('📊 App - Notifications Messages:', count);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      
      {!showSplash && loading && (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
          </div>
        </div>
      )}

      {!showSplash && !loading && !user && (
        <AuthScreen onAuthenticated={checkUser} />
      )}

      {!showSplash && !loading && user && needsProfileCompletion && (
        <div className="relative">
          <ProfileCompletion onComplete={handleProfileComplete} />
          
          {import.meta.env.DEV && (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
              <button
                onClick={() => {
                  console.log('=== DEBUG INFO ===');
                  console.log('User ID:', user?.id);
                  console.log('needsProfileCompletion:', needsProfileCompletion);
                  console.log('activeScreen:', activeScreen);
                  if (user) {
                    checkProfileCompletion(user.id);
                  }
                }}
                className="px-3 py-2 bg-blue-500 text-white text-xs rounded shadow"
              >
                🐛 Debug
              </button>
              <button
                onClick={() => setNeedsProfileCompletion(false)}
                className="px-3 py-2 bg-red-500 text-white text-xs rounded shadow"
              >
                ⏭️ Force Skip
              </button>
            </div>
          )}
        </div>
      )}

      {!showSplash && !loading && user && !needsProfileCompletion && (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
            {activeScreen === 'discovery' && <DiscoveryScreen />}
            {activeScreen === 'community' && <CommunityScreen />}
            {/* ✅ MODIFIÉ : Ajout de onNotificationCountChange */}
            {activeScreen === 'messages' && (
              <MessagesScreen 
                onChatStateChange={setIsInChat}
                onNotificationCountChange={handleMessagesNotificationChange}
              />
            )}
            {activeScreen === 'profile' && <ProfileScreen />}
            
            {/* ✅ MODIFIÉ : Ajout de messagesNotificationCount */}
            {!isInChat && (
              <BottomNavigation 
                activeScreen={activeScreen} 
                onNavigate={setActiveScreen}
                messagesNotificationCount={messagesNotificationCount}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;