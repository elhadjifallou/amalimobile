import { Profile, Conversation } from '@/types';

export const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Fatou Diop",
    age: 26,
    location: "Dakar, Sénégal",
    bio: "Passionnée par l'entrepreneuriat et la famille. À la recherche d'une relation sérieuse basée sur le respect et les valeurs.",
    image: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80"
    ],
    halalMode: true,
    verified: true,
    relationshipGoal: "Mariage",
    prayerLevel: "5 fois par jour",
    compatibility: 94,
    interests: ["Lecture", "Cuisine", "Famille"],
    education: "Master en Commerce",
    profession: "Entrepreneuse",
    premiumTier: "prestige-femme",
    religion: "Islam",

  },
  {
    id: 2,
    name: "Aminata Ndiaye",
    age: 24,
    location: "Thiès, Sénégal",
    bio: "Enseignante de profession. Je crois en l'importance des valeurs familiales et du respect mutuel dans une relation.",
    image: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
    ],
    halalMode: true,
    verified: true,
    relationshipGoal: "Relation sérieuse",
    prayerLevel: "Régulièrement",
    compatibility: 88,
    interests: ["Éducation", "Art", "Voyage"],
    education: "Licence en Lettres",
    profession: "Enseignante",
    premiumTier: "elite",
    religion: "Islam",

  },
  {
    id: 3,
    name: "Aïssatou Sow",
    age: 28,
    location: "Saint-Louis, Sénégal",
    bio: "Médecin passionnée par mon métier. Je recherche quelqu'un qui partage mes valeurs et qui souhaite fonder une famille.",
    image: [
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80"
    ],
    halalMode: true,
    verified: true,
    relationshipGoal: "Mariage",
    prayerLevel: "5 fois par jour",
    compatibility: 92,
    interests: ["Médecine", "Sport", "Voyages"],
    education: "Doctorat en Médecine",
    profession: "Médecin",
    premiumTier: "prestige",
    religion: "Islam",

  },
  {
    id: 4,
    name: "Khady Sarr",
    age: 25,
    location: "Mbour, Sénégal",
    bio: "Développeuse web freelance. J'aime la tech, la lecture et passer du temps en famille. Recherche une relation sincère.",
    image: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"
    ],
    halalMode: true,
    verified: false,
    relationshipGoal: "Relation sérieuse",
    prayerLevel: "Régulièrement",
    compatibility: 85,
    interests: ["Technologie", "Lecture", "Photographie"],
    education: "Licence en Informatique",
    profession: "Développeuse Web",
    premiumTier: "essentiel",
    religion: "Islam",

  },
  {
    id: 5,
    name: "Marième Fall",
    age: 27,
    location: "Kaolack, Sénégal",
    bio: "Architecte et maman d'un enfant. Je recherche un partenaire compréhensif qui respecte mes valeurs et ma situation.",
    image: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
    ],
    halalMode: true,
    verified: true,
    relationshipGoal: "Mariage",
    prayerLevel: "5 fois par jour",
    compatibility: 90,
    interests: ["Architecture", "Design", "Famille"],
    education: "Master en Architecture",
    profession: "Architecte",
    premiumTier: "elite",
    religion: "Islam",

  }
];

export const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Fatou Diop",
    lastMessage: "Merci pour votre message ! J'aimerais en savoir plus sur vos valeurs...",
    time: "10:30",
    unread: 2,
    halalMode: true,
    initial: "F",
    color: "bg-emerald-500"
  },
  {
    id: 2,
    name: "Aminata Ndiaye",
    lastMessage: "Je suis d'accord, la famille est très importante pour moi aussi.",
    time: "Hier",
    unread: 0,
    halalMode: true,
    initial: "A",
    color: "bg-blue-500"
  },
  {
    id: 3,
    name: "Aïssatou Sow",
    lastMessage: "Enchantée de discuter avec vous !",
    time: "Il y a 2j",
    unread: 0,
    halalMode: true,
    initial: "A",
    color: "bg-purple-500"
  }
];
