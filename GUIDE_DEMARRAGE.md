# 🚀 Guide de Démarrage Rapide - Amali App

## ✅ Ce qui a été complété

### 1. **Système d'authentification complet** ✅
- Page de connexion avec email/mot de passe
- Page d'inscription avec validation
- Réinitialisation de mot de passe
- Gestion de session avec Supabase
- Déconnexion fonctionnelle

### 2. **Page de profil interactive** ✅
- Affichage des informations utilisateur
- Modal d'édition de profil
- Boutons fonctionnels :
  - ✅ Modifier le profil
  - ✅ Paramètres
  - ✅ Mode Halal & Confidentialité
  - ✅ Notifications
  - ✅ Aide & Support
  - ✅ Retour à l'accueil
  - ✅ Se déconnecter

### 3. **Nouveaux fichiers créés**
```
src/
├── lib/
│   └── supabase.ts              # Configuration Supabase + fonctions auth
├── components/
│   ├── AuthScreen.tsx           # Page connexion/inscription
│   └── EditProfileModal.tsx     # Modal édition profil
```

## 📝 Configuration requise

### 1. Installer les dépendances
```bash
cd amali-app
npm install
```

### 2. Configurer Supabase

**a) Créer un compte Supabase**
1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon key**

**b) Créer le fichier .env**
```bash
# Créez un fichier .env à la racine
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**c) Activer l'authentification Email dans Supabase**
1. Dans votre dashboard Supabase
2. Allez dans **Authentication** → **Providers**
3. Activez **Email**
4. Configurez les templates d'email si nécessaire

### 3. Lancer l'application
```bash
npm run dev
```

L'app sera accessible sur **http://localhost:5173**

## 🎯 Comment tester

### Test de l'authentification
1. Ouvrez http://localhost:5173
2. Vous verrez la page de connexion
3. Cliquez sur "Inscrivez-vous"
4. Remplissez le formulaire d'inscription
5. Vérifiez votre email pour confirmer (en dev, vérifiez dans l'onglet Supabase)
6. Connectez-vous avec vos identifiants

### Test du profil
1. Une fois connecté, cliquez sur l'onglet "Profil" (en bas)
2. Testez les boutons :
   - **Modifier le profil** → Ouvre le modal d'édition
   - **Paramètres** → Ouvre l'écran des paramètres
   - **Se déconnecter** → Demande confirmation et déconnecte

### Test de l'édition du profil
1. Cliquez sur "Modifier le profil"
2. Modifiez votre nom, téléphone, localisation ou bio
3. Cliquez sur "Enregistrer"
4. Les modifications seront enregistrées dans Supabase

## 🔍 Vérification dans Supabase

Pour voir vos utilisateurs :
1. Allez dans votre dashboard Supabase
2. **Authentication** → **Users**
3. Vous verrez tous les utilisateurs inscrits
4. Cliquez sur un utilisateur pour voir ses métadonnées (name, phone, etc.)

## ⚠️ Points importants

### Sécurité
- ✅ Ne JAMAIS commit le fichier `.env` sur Git
- ✅ Le fichier `.env` est déjà dans `.gitignore`
- ✅ Utilisez `.env.example` comme référence

### Développement
- Les mots de passe doivent avoir minimum 6 caractères
- Par défaut, Supabase envoie un email de confirmation
- En dev, vous pouvez désactiver la confirmation dans les settings Supabase

### Production
Avant le déploiement :
1. Configurez les variables d'environnement sur votre hébergeur
2. Activez les politiques de sécurité RLS dans Supabase
3. Configurez les emails de production
4. Testez tous les flux d'authentification

## 🐛 Résolution de problèmes

### Erreur : "Invalid API key"
- Vérifiez que votre `.env` contient les bonnes clés
- Redémarrez le serveur de dev (`npm run dev`)

### L'utilisateur n'est pas connecté
- Vérifiez que l'email est confirmé dans Supabase
- En dev, confirmez manuellement dans **Authentication** → **Users**

### Modifications du profil non enregistrées
- Vérifiez la console pour les erreurs
- Assurez-vous que l'utilisateur est bien connecté
- Vérifiez les permissions dans Supabase

## 📦 Déploiement

### Build de production
```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

### Déploiement sur Vercel/Netlify
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Déployez !

## ✨ Prochaines étapes

Maintenant que l'authentification et le profil fonctionnent, vous pouvez :

1. **Ajouter l'upload de photos**
   - Utiliser Supabase Storage
   - Permettre aux utilisateurs de changer leur photo de profil

2. **Implémenter le système de matching**
   - Créer une table `profiles` dans Supabase
   - Ajouter les critères de compatibilité
   - Développer l'algorithme de matching

3. **Ajouter le chat en temps réel**
   - Utiliser Supabase Realtime
   - Créer les tables `conversations` et `messages`
   - Implémenter les notifications

4. **Améliorer la page Discovery**
   - Connexion avec les profils réels de la base de données
   - Système de swipe (like/dislike)
   - Animations de cartes

## 🤝 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs de Supabase
3. Consultez la documentation Supabase : https://supabase.com/docs

---

**Félicitations !** 🎉 Votre application est maintenant fonctionnelle avec un système d'authentification complet et un profil interactif !
