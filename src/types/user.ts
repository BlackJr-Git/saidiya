/**
 * Types d'utilisateur pour l'application
 */

// Type complet d'utilisateur (correspond au modèle Prisma)
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | boolean | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type utilisateur pour les réponses API publiques
export interface PublicUserInfo {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
}

// Type utilisateur pour les réponses API privées (session utilisateur)
export interface PrivateUserInfo {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | boolean | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour la mise à jour du profil utilisateur
export interface UserProfileUpdate {
  name?: string;
  image?: string;
}

// Type pour les informations de session utilisateur
export interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string;
  } | null;
}
