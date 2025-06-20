/**
 * Types de campagne pour l'application
 */

// Type complet de campagne (correspond au modèle Prisma)
export interface Campagne {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  targetAmount: number;
  currentAmount: number;
  localisation: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "completed" | "cancelled";
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type campagne pour les réponses API publiques
export interface PublicCampagneInfo {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  targetAmount: number;
  currentAmount: number;
  progress: number; // pourcentage de progression
  localisation: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: Date;
}

// Type campagne pour les réponses API privées (créateur de campagne)
export interface PrivateCampagneInfo extends PublicCampagneInfo {
  creatorId: string;
  updatedAt: Date;
  supporters?: number; // nombre de donateurs
  metrics?: {
    dailyViews: number;
    conversionRate: number;
    averageDonation: number;
  };
}

// Type pour la mise à jour du profil de campagne
export interface CampagneProfileUpdate {
  title?: string;
  description?: string;
  coverImage?: string;
  targetAmount?: number;
  startDate?: Date;
  endDate?: Date;
  status?: "draft" | "active" | "completed" | "cancelled";
}

// Type pour la création d'une nouvelle campagne
export interface CampagneCreate {
  title: string;
  description: string | null;
  coverImage?: string | null;
  targetAmount: number;
  localisation: string;
  category: string;
  startDate: Date | null;
  endDate: Date | null;
  status: "draft" | "active" | "completed" | "cancelled";
}
