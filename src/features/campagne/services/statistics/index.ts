/**
 * Service pour récupérer les statistiques d'une campagne
 */

import axios from "axios";
import { api } from "@/lib/shared/api";

// Type pour les données de statistiques de campagne
export interface CampagneStatistics {
  id: string;
  campaignTitle: string;
  totalViews: number;
  viewsChange: number;
  engagementRate: number;
  engagementChange: number;
  conversions: number;
  conversionChange: number;
  viewsOverTime: Array<{ date: string; views: number }>;
  engagementBySource: Array<{ source: string; rate: number }>;
  conversionData: Array<{ step: string; value: number }>;
}

/**
 * Récupère les statistiques d'une campagne spécifique par son ID
 * @param id L'identifiant de la campagne
 * @returns Les données de statistiques de la campagne
 */
export async function getCampagneStatistics(id: string): Promise<CampagneStatistics> {
  try {
    const response = await api().get<CampagneStatistics>(`/campagnes/${id}/statistics`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération des statistiques"
      );
    }
    console.error("Erreur dans getCampagneStatistics:", error);
    throw error;
  }
}
