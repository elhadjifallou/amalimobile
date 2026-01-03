# Amali - Application de Rencontre Halal

Application de rencontre moderne avec authentification Supabase, conçue pour faciliter les rencontres respectueuses et conformes aux valeurs islamiques.

## 🚀 Fonctionnalités

### ✅ Implémentées
- ✅ **Authentification complète** avec Supabase
  - Inscription par email/mot de passe
  - Connexion sécurisée
  - Réinitialisation de mot de passe
  - Déconnexion
- ✅ **Page de profil interactive**
  - Affichage des informations utilisateur
  - Modification du profil (nom, téléphone, localisation, bio)
  - Statistiques (matchs, compatibilité, conversations)
- ✅ **Interface utilisateur moderne**
  - Design responsive avec Tailwind CSS
  - Animations fluides
  - Icônes Lucide React
  - Thème rose/ambre

### 🎯 Écrans disponibles
- Discovery (Découverte de profils)
- Community (Communauté)
- Messages (Conversations)
- Profile (Profil utilisateur)
- Premium (Abonnement premium)
- Settings (Paramètres)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### Étapes d'installation

1. **Cloner le projet**
```bash
cd amali-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos clés Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

Pour obtenir vos clés :
1. Connectez-vous sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Allez dans **Settings** → **API**
4. Copiez **Project URL** et **anon/public key**

4. **Configuration de la base de données**

Dans votre tableau de bord Supabase, activez l'authentification :
- Allez dans **Authentication** → **Settings**
- Activez **Email** provider
- Configurez les paramètres d'email (templates, etc.)

Optionnel - Pour activer l'authentification par téléphone :
- Activez **Phone** provider
- Configurez Twilio ou un autre fournisseur SMS

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Structure du projet

```
amali-app/
├── src/
│   ├── components/
│   │   ├── AuthScreen.tsx          # Page de connexion/inscription
│   │   ├── ProfileScreen.tsx       # Page de profil
│   │   ├── EditProfileModal.tsx    # Modal d'édition du profil
│   │   ├── DiscoveryScreen.tsx     # Découverte de profils
│   │   ├── CommunityScreen.tsx     # Communauté
│   │   ├── MessagesScreen.tsx      # Messages
│   │   ├── PremiumScreen.tsx       # Abonnement premium
│   │   ├── SettingsScreen.tsx      # Paramètres
│   │   └── BottomNavigation.tsx    # Navigation
│   ├── lib/
│   │   └── supabase.ts             # Configuration Supabase
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   ├── utils/
│   │   └── cn.ts                   # Utilitaires
│   ├── App.tsx                     # Composant principal
│   └── main.tsx                    # Point d'entrée
├── .env.example                    # Exemple de variables d'environnement
├── package.json
└── README.md
```

## 🔐 Authentification

L'application utilise Supabase Auth avec les fonctionnalités suivantes :

### Inscription
- Email + mot de passe (minimum 6 caractères)
- Métadonnées : nom, téléphone
- Confirmation par email

### Connexion
- Email + mot de passe
- Gestion des sessions
- Redirection automatique après connexion

### Gestion du profil
- Modification du nom
- Modification du téléphone
- Ajout de localisation
- Ajout de bio (200 caractères max)

### Sécurité
- Mots de passe hashés par Supabase
- Tokens JWT sécurisés
- Protection CSRF
- Réinitialisation de mot de passe par email

## 🎨 Technologies utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Tailwind CSS** - Styling
- **Supabase** - Backend as a Service
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
- **Lucide React** - Icônes modernes

## 📱 Fonctionnalités à venir

- [ ] Upload de photos de profil
- [ ] Système de matching avec algorithme de compatibilité
- [ ] Chat en temps réel
- [ ] Notifications push
- [ ] Vérification d'identité
- [ ] Filtres de recherche avancés
- [ ] Mode sombre
- [ ] Application mobile (React Native)

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation de la build
npm run preview

# Linting
npm run lint
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Développeur

Développé avec ❤️ par l'équipe Amali

## 🐛 Problèmes connus

- La fonctionnalité de changement de photo de profil n'est pas encore implémentée
- Les notifications ne sont pas encore fonctionnelles
- Le système de matching est en développement

## 📞 Support

Pour toute question ou problème :
- Email : support@amali.app
- Issues GitHub : [Ouvrir un ticket](https://github.com/votre-repo/issues)

---

**Note** : Assurez-vous de ne jamais commit vos clés Supabase dans un repository public. Utilisez toujours des variables d'environnement.
