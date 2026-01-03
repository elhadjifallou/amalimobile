import { useState, useEffect } from 'react';
import { X, Trash2, Star, Upload, Save, Loader2 } from 'lucide-react';
import { supabase, AuthUser } from '@/lib/supabase';

interface EditProfileModalProps {
  user: AuthUser;
  onClose: () => void;
  onSave: () => void;
}

interface ProfilePhoto {
  url: string;
  file?: File;
  isNew?: boolean;
}


export default function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: 'Dakar, Sénégal',
  });

  // Gestion des photos
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, bio, location, photos, profile_photo_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setFormData({
          name: profile.name || '',
          bio: profile.bio || '',
          location: profile.location || 'Dakar, Sénégal',
        });

        // Charger les photos existantes
        if (profile.photos && Array.isArray(profile.photos)) {
          const loadedPhotos = profile.photos.map((url: string) => ({ url }));
          setPhotos(loadedPhotos);
          
          // Définir l'index de la photo principale
          if (profile.profile_photo_url) {
            const mainIndex = profile.photos.indexOf(profile.profile_photo_url);
            setMainPhotoIndex(mainIndex !== -1 ? mainIndex : 0);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  // Ajouter une nouvelle photo
  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 6) {
      alert('Maximum 6 photos autorisées');
      return;
    }

    files.forEach(file => {
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5 MB');
        return;
      }

      // Créer une URL temporaire pour l'aperçu
      const url = URL.createObjectURL(file);
      setPhotos(prev => [...prev, { url, file, isNew: true }]);
    });
  };

  // Supprimer une photo
  const handleDeletePhoto = (index: number) => {
    const photo = photos[index];
    
    // Si c'est une photo existante (pas nouvelle), l'ajouter à la liste de suppression
    if (!photo.isNew && photo.url) {
      setPhotosToDelete(prev => [...prev, photo.url]);
    }

    // Révoquer l'URL si c'est une nouvelle photo
    if (photo.isNew && photo.url) {
      URL.revokeObjectURL(photo.url);
    }

    // Retirer la photo de la liste
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);

    // Ajuster l'index de la photo principale si nécessaire
    if (mainPhotoIndex === index) {
      setMainPhotoIndex(0);
    } else if (mainPhotoIndex > index) {
      setMainPhotoIndex(mainPhotoIndex - 1);
    }
  };

  // Définir comme photo principale
  const handleSetMainPhoto = (index: number) => {
    setMainPhotoIndex(index);
  };

  // Upload des nouvelles photos vers Supabase
  const uploadNewPhotos = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const photo of photos) {
      if (photo.isNew && photo.file) {
        const fileExt = photo.file.name.split('.').pop();
        const fileName = `${user.id}/photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, photo.file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      } else if (!photo.isNew) {
        // Garder les photos existantes
        uploadedUrls.push(photo.url);
      }
    }

    return uploadedUrls;
  };

  // Supprimer les photos du storage
  const deletePhotosFromStorage = async () => {
    if (photosToDelete.length === 0) return;

    const fileNames = photosToDelete.map(url => {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      return `${user.id}/${fileName}`;
    });

    await supabase.storage
      .from('profile-photos')
      .remove(fileNames);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Le nom est obligatoire');
      return;
    }

    if (formData.bio.length > 200) {
      alert('La bio ne doit pas dépasser 200 caractères');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload des nouvelles photos
      const photoUrls = await uploadNewPhotos();

      // 2. Supprimer les anciennes photos
      await deletePhotosFromStorage();

      // 3. Déterminer la photo principale
      const mainPhotoUrl = photoUrls[mainPhotoIndex] || null;

      // 4. Mettre à jour le profil dans Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          location: formData.location,
          photos: photoUrls,
          profile_photo_url: mainPhotoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 5. Mettre à jour les métadonnées de l'utilisateur
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          bio: formData.bio,
          location: formData.location,
        }
      });

      if (updateError) throw updateError;

      alert('Profil mis à jour avec succès ! ✨');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Modifier mon profil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section Photos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Mes Photos ({photos.length}/6)
              </h3>
              <span className="text-sm text-slate-500">
                {photos.length > 0 && '⭐ = Photo principale'}
              </span>
            </div>

            {/* Grille de photos */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  
                  {/* Badge photo principale */}
                  {mainPhotoIndex === index && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Principale
                    </div>
                  )}

                  {/* Actions (visibles au survol) */}
                  <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {mainPhotoIndex !== index && (
                      <button
                        onClick={() => handleSetMainPhoto(index)}
                        className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
                        title="Définir comme principale"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Bouton Ajouter une photo */}
              {photos.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-all">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 text-center px-2">
                    Ajouter
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddPhoto}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              )}
            </div>

            {/* Conseils */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-blue-700 text-sm">
                💡 <strong>Conseils :</strong>
              </p>
              <ul className="text-blue-600 text-xs mt-2 space-y-1 ml-4">
                <li>• Ajoutez jusqu'à 6 photos de qualité</li>
                <li>• La première photo (⭐) sera votre photo principale</li>
                <li>• Cliquez sur ⭐ pour changer la photo principale</li>
                <li>• Maximum 5 MB par photo</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Section Informations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Informations</h3>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Votre prénom"
              />
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Localisation
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Ville, Pays"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={200}
                placeholder="Parlez de vous, vos centres d'intérêt..."
              />
              <p className="text-xs text-slate-500 mt-1 text-right">
                {formData.bio.length}/200
              </p>
            </div>
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
