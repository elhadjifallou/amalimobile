# 💕 AMALI - Application de Rencontres Halal

Application mobile-first de rencontres halal développée en **React + TypeScript + Tailwind CSS**.

## 🚀 Fonctionnalités

- ✅ **Découverte de profils** avec système de swipe
- ✅ **Mode Halal** respectant les valeurs islamiques
- ✅ **Messagerie sécurisée** avec indicateurs
- ✅ **Système Premium** avec 4 tiers (Essentiel, Élite, Prestige, Prestige Femme)
- ✅ **Profils vérifiés** avec badge de certification
- ✅ **Communauté** avec événements et témoignages
- ✅ **Design moderne** et animations fluides

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

3. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes

## 📁 Structure du projet

```
amali-app/
├── src/
│   ├── components/        # Composants React
│   │   ├── BottomNavigation.tsx
│   │   ├── Header.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── DiscoveryScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── CommunityScreen.tsx
│   ├── data/              # Données mockées
│   │   └── mockProfiles.ts
│   ├── types/             # Types TypeScript
│   │   └── index.ts
│   ├── utils/             # Fonctions utilitaires
│   │   └── cn.ts
│   ├── App.tsx            # Composant principal
│   ├── main.tsx           # Point d'entrée
│   └── index.css          # Styles globaux
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Palette de couleurs

- **Primary**: Orange/Amber (#F97316 - #EA580C)
- **Success**: Emerald (#10B981)
- **Warning**: Red (#EF4444)
- **Neutral**: Slate (#64748B)

## 🔮 Prochaines étapes

### Backend
- [ ] Créer une API Laravel/Node.js
- [ ] Authentification JWT
- [ ] WebSockets pour le chat en temps réel
- [ ] Upload d'images avec Cloudinary

### Frontend
- [ ] Animations de swipe avancées
- [ ] Mode nuit
- [ ] Filtres avancés
- [ ] Notifications push
- [ ] Géolocalisation

### Mobile
- [ ] Convertir en React Native
- [ ] App iOS et Android

## 👨‍💻 Développement

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 📝 Notes

- Les données actuelles sont mockées (fichiers dans `src/data/`)
- L'application est responsive et optimisée pour mobile
- Les images de profils utilisent Unsplash comme placeholder

## 🤝 Contribution

Ce projet est développé par **Malick** pour le marché sénégalais.

---

**Fait avec ❤️ et React + TypeScript**
