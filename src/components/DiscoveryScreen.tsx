import { useState, useEffect } from 'react';
import Header from './Header';
import ProfileCard from './ProfileCard';
import SettingsScreen from './SettingsScreen';
import NoMoreLikesModal from './NoMoreLikesModal';
import { supabase, authService } from '@/lib/supabase';
import MatchModal from './MatchModal';
import { createNotification } from '@/hooks/useNotifications';
import { useLikes } from '@/hooks/useLikes';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  profile_photo_url: string;
  photos: string[];
  profession: string;
  education_level: string;
  height: number;
  prayer_frequency: string;
  interests: string[];
  is_premium?: boolean;  // ✅ AJOUTÉ
  premium_tier?: 'essentiel' | 'elite' | 'prestige';  // ✅ AJOUTÉ
}

export default function DiscoveryScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);
  
  const [showNoLikesModal, setShowNoLikesModal] = useState(false);

  const {
    loading: likesLoading,
    consumeLike,
    canLike,
  } = useLikes(userId || '');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        console.log('❌ Utilisateur non connecté');
        return;
      }

      setUserId(user.id);
      console.log('✅ User ID:', user.id);

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('gender, relationship_goal, profile_photo_url')
        .eq('id', user.id)
        .single();

      if (!myProfile) {
        console.log('❌ Profil non trouvé');
        return;
      }

      console.log('✅ Mon profil:', myProfile);
      setCurrentUserPhoto(myProfile.profile_photo_url);

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

      // ✅ MODIFIÉ: Charger is_premium et premium_tier
      const { data: allProfiles, error } = await supabase
        .from('profiles')
        .select('*, is_premium, premium_tier')
        .neq('id', user.id)
        .eq('profile_completed', true);

      if (error) {
        console.error('❌ Erreur de chargement des profils:', error);
        return;
      }

      console.log('📊 Profils bruts trouvés:', allProfiles?.length || 0);

      const formattedProfiles = (allProfiles || [])
        .map(profile => ({
          ...profile,
          age: profile.date_of_birth ? calculateAge(profile.date_of_birth) : 0,
        }))
        .filter(profile => {
          if (!profile.name || !profile.profile_photo_url) {
            console.log('❌ Exclu (incomplet):', profile.id);
            return false;
          }

          const myGender = myProfile.gender?.toLowerCase();
          const theirGender = profile.gender?.toLowerCase();
          const myGoal = myProfile.relationship_goal?.toLowerCase();

          if (!myGender || myGender === 'null' || myGender === 'undefined') {
            console.log('⚠️ Mon genre est null → Affiche tout:', profile.name);
            return true;
          }

          if (!theirGender || theirGender === 'null' || theirGender === 'undefined') {
            console.log('❌ Exclu (genre null):', profile.name);
            return false;
          }

          if (myGoal === 'amitié') {
            console.log('✅ Amitié → Gardé:', profile.name);
            return true;
          }

          if (myGender === 'homme' && theirGender === 'femme') {
            console.log('✅ Homme → Femme gardée:', profile.name);
            return true;
          }

          if (myGender === 'femme' && theirGender === 'homme') {
            console.log('✅ Femme → Homme gardé:', profile.name);
            return true;
          }

          console.log('❌ Exclu (genre):', profile.name, `(mon genre: ${myGender}, leur genre: ${theirGender})`);
          return false;
        });

      console.log('✅ Profils après filtrage:', formattedProfiles.length);

      if (formattedProfiles.length === 0) {
        console.log('⚠️ Aucun profil ne correspond');
        console.log('💡 Mon genre:', myProfile.gender || 'non défini');
        console.log('💡 Mon objectif:', myProfile.relationship_goal || 'non défini');
      }

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentProfileIndex];

  const handleAction = async (action: 'like' | 'pass') => {
    if (!currentProfile || !userId) {
      console.log('❌ Pas de profil ou userId');
      return;
    }

    console.log('🎯 handleAction appelé:', {
      action,
      currentProfile: currentProfile.name,
      userId
    });

    if (action === 'like') {
      if (!canLike()) {
        console.log('❌ Plus de likes disponibles');
        setShowNoLikesModal(true);
        return;
      }
    }

    setIsAnimating(true);

    try {
      if (action === 'like') {
        const success = await consumeLike();
        if (!success) {
          setShowNoLikesModal(true);
          setIsAnimating(false);
          return;
        }
        console.log('✅ Like consommé');
      }

      console.log('📝 Enregistrement du like...');
      
      const { error: likeError } = await supabase
        .from('likes')
        .upsert({
          from_user_id: userId,
          to_user_id: currentProfile.id,
          like_type: action === 'pass' ? 'pass' : 'like',
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'from_user_id,to_user_id',
        });

      if (likeError) {
        console.error('❌ Erreur lors du like:', likeError);
        console.error('❌ Détails:', JSON.stringify(likeError, null, 2));
      } else {
        console.log('✅ Like enregistré avec succès');
      }

      if (action === 'like' && !likeError) {
        console.log('🔔 Création de notification...');

        const { data: myProfile, error: profileError } = await supabase
          .from('profiles')
          .select('name, profile_photo_url')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('❌ Erreur récupération profil:', profileError);
        } else {
          console.log('👤 Mon profil récupéré:', myProfile);

          const notificationResult = await createNotification({
            userId: currentProfile.id,
            type: 'like',
            title: `${myProfile.name} a aimé votre profil`,
            message: `${myProfile.name} a liké votre profil ❤️`,
            fromUserId: userId,
            fromUserName: myProfile.name,
            fromUserPhoto: myProfile.profile_photo_url,
            relatedId: currentProfile.id,
          });

          if (notificationResult) {
            console.log('✅ Notification créée avec succès');
            console.log('🔔 Notification envoyée à:', currentProfile.name);
          } else {
            console.error('❌ Échec de création de notification');
          }
        }
      }

      if (action === 'like') {
        console.log('💕 Vérification du match mutuel...');

        try {
          const { data: mutualLike, error: mutualError } = await supabase
            .from('likes')
            .select('*')
            .eq('from_user_id', currentProfile.id)
            .eq('to_user_id', userId)
            .in('like_type', ['like', 'super_like'])
            .maybeSingle();

          if (mutualError) {
            console.error('⚠️ Erreur vérification match:', mutualError);
          } else if (mutualLike) {
            console.log('🎉 Match mutuel détecté !');

            const { data: existingMatch, error: matchCheckError } = await supabase
              .from('matches')
              .select('*')
              .or(`and(user1_id.eq.${userId},user2_id.eq.${currentProfile.id}),and(user1_id.eq.${currentProfile.id},user2_id.eq.${userId})`)
              .maybeSingle();

            if (matchCheckError) {
              console.error('⚠️ Erreur vérification match existant:', matchCheckError);
            }

            if (!existingMatch) {
              console.log('💕 Création du match...');

              const { data: newMatch, error: matchError } = await supabase
                .from('matches')
                .insert({
                  user1_id: userId,
                  user2_id: currentProfile.id,
                  status: 'accepted',
                  compatibility_score: 85,
                })
                .select()
                .single();

              if (matchError) {
                console.error('❌ Erreur création match:', matchError);
              } else {
                console.log('✅ Match créé avec succès !', newMatch);

                console.log('💬 Création de la conversation...');

                const { data: newConversation, error: convError } = await supabase
                  .from('conversations')
                  .insert({
                    match_id: newMatch.id,
                    user1_id: userId,
                    user2_id: currentProfile.id,
                    last_message: null,
                    last_message_at: new Date().toISOString(),
                    user1_unread_count: 0,
                    user2_unread_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .select()
                  .single();

                if (convError) {
                  console.error('❌ Erreur création conversation:', convError);
                  console.error('❌ Détails:', JSON.stringify(convError, null, 2));
                } else {
                  console.log('✅ Conversation créée avec succès !', newConversation);
                }

                const { data: myProfile } = await supabase
                  .from('profiles')
                  .select('name, profile_photo_url')
                  .eq('id', userId)
                  .single();

                if (myProfile) {
                  console.log('🔔 Création des notifications de match...');

                  await createNotification({
                    userId: currentProfile.id,
                    type: 'match',
                    title: 'Nouveau match !',
                    message: `Vous avez matché avec ${myProfile.name} ! 💕`,
                    fromUserId: userId,
                    fromUserName: myProfile.name,
                    fromUserPhoto: myProfile.profile_photo_url,
                    relatedId: currentProfile.id,
                  });

                  await createNotification({
                    userId: userId,
                    type: 'match',
                    title: 'Nouveau match !',
                    message: `Vous avez matché avec ${currentProfile.name} ! 💕`,
                    fromUserId: currentProfile.id,
                    fromUserName: currentProfile.name,
                    fromUserPhoto: currentProfile.profile_photo_url,
                    relatedId: currentProfile.id,
                  });

                  console.log('✅ Notifications de match envoyées');
                }

                setMatchedUser({
                  id: currentProfile.id,
                  name: currentProfile.name,
                  photo: currentProfile.profile_photo_url,
                  age: currentProfile.age,
                  location: currentProfile.location,
                });

                setShowMatchModal(true);
              }
            } else {
              console.log('ℹ️ Match déjà existant, pas de duplication');
            }
          } else {
            console.log('ℹ️ Pas de match mutuel (pas encore)');
          }
        } catch (matchError) {
          console.error('❌ Erreur lors de la vérification du match:', matchError);
        }
      }

    } catch (error) {
      console.error('❌ Erreur générale lors de l\'action:', error);
    }

    setTimeout(() => {
      setCurrentProfileIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleUpgradeToPremium = () => {
    setShowNoLikesModal(false);
    alert('TODO: Ouvrir PremiumScreen');
  };

  if (showSettings) {
    return <SettingsScreen onClose={() => setShowSettings(false)} />;
  }

  if (loading || likesLoading) {
    return (
      <>
        <Header onSettingsClick={() => setShowSettings(true)} />
        
        <div 
          className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top) + 80px)',
          }}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Chargement des profils...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onSettingsClick={() => setShowSettings(true)} />

      <div 
        className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 80px)',
        }}
      >
        <div className="flex-1 flex items-center justify-center overflow-hidden h-full">
          {currentProfile && currentProfileIndex < profiles.length ? (
            <ProfileCard
              profile={{
                id: parseInt(currentProfile.id),
                name: currentProfile.name,
                age: currentProfile.age,
                location: currentProfile.location,
                bio: currentProfile.bio || '',
                image:
                  currentProfile.photos?.length > 0
                    ? currentProfile.photos
                    : currentProfile.profile_photo_url
                    ? [currentProfile.profile_photo_url]
                    : [],
                interests: currentProfile.interests || [],
                distance: 5,
                verified: true,
                compatibility: 85,
                profession: currentProfile.profession || '',
                education: currentProfile.education_level || '',
                height: currentProfile.height || 0,
                religion: currentProfile.prayer_frequency || '',
                premiumTier: currentProfile.premium_tier, // ✅ AJOUTÉ
              }}
              onLike={() => handleAction('like')}
              onPass={() => handleAction('pass')}
              isAnimating={isAnimating}
            />
          ) : (
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">💫</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {profiles.length === 0 ? 'Aucun profil disponible' : 'Plus de profils !'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {profiles.length === 0
                    ? 'Revenez plus tard pour découvrir de nouveaux profils'
                    : 'Revenez plus tard pour découvrir de nouveaux profils'}
                </p>
                {profiles.length > 0 && (
                  <button
                    onClick={() => setCurrentProfileIndex(0)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Recommencer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showNoLikesModal && (
        <NoMoreLikesModal
          onClose={() => setShowNoLikesModal(false)}
          onUpgrade={handleUpgradeToPremium}
          onActivateBoost={() => {}}
          canUseBoost={false}
          timeUntilReset="5h 30min"
        />
      )}

      {showMatchModal && matchedUser && (                
        <MatchModal
          matchedUser={matchedUser}
          currentUserPhoto={currentUserPhoto}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={() => {
            setShowMatchModal(false);
            console.log('Ouvrir le chat avec :', matchedUser.name);
          }}
          onKeepSwiping={() => {
            setShowMatchModal(false);
            setTimeout(() => {
              setCurrentProfileIndex(prev => prev + 1);
            }, 300);
          }}
        />
      )}
    </>
  );
}