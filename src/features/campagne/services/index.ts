/**
 * Service d'API campagne
 * Fournit les fonctions pour interagir avec les API campagne
 */

import axios from "axios";
import {
  PrivateCampagneInfo,
  PublicCampagneInfo,
  CampagneProfileUpdate,
  CampagneCreate,
} from "@/types/campagne";
import { api } from "@/lib/shared/api";

/**
 * Récupère le profil de la campagne actuellement sélectionnée
 * Nécessite d'être connecté
 */
export const getCurrentCampagne = async (): Promise<PrivateCampagneInfo> => {
  try {
    const response = await api().get<PrivateCampagneInfo>("/campagne/current");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération du profil de campagne"
      );
    }
    throw error;
  }
};

/**
 * Met à jour le profil de la campagne sélectionnée
 * @param profileData - Données du profil à mettre à jour
 */
export const updateCampagneProfile = async (
  profileData: CampagneProfileUpdate
): Promise<PrivateCampagneInfo> => {
  try {
    const response = await api().put<PrivateCampagneInfo>("/campagne", profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la mise à jour du profil de campagne"
      );
    }
    throw error;
  }
};

/**
 * Récupère les informations publiques d'une campagne par son ID
 * @param campagneId - L'ID de la campagne à récupérer
 */
export const getCampagneById = async (campagneId: string): Promise<PublicCampagneInfo> => {
  try {
    const response = await api().get<PublicCampagneInfo>(`/campagne/${campagneId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Campagne non trouvée");
      }
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération des données de campagne"
      );
    }
    throw error;
  }
};

/**
 * Vérifie le statut de la campagne actuelle
 * Renvoie les données de campagne si disponible, sinon null
 */
export const checkCampagneStatus = async (): Promise<PrivateCampagneInfo | null> => {
  try {
    const campagne = await getCurrentCampagne();
    return campagne;
  } catch (error) {
    // Si l'erreur est 404 (non trouvé), la campagne n'est simplement pas disponible
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    // Pour les autres erreurs, les propager
    throw error;
  }
};

/**
 * Crée une nouvelle campagne
 * @param campaignData - Données de la campagne à créer
 */
export const createCampagne = async (
  campaignData: CampagneCreate
): Promise<PrivateCampagneInfo> => {
  try {
    const response = await api().post<PrivateCampagneInfo>("/campagne", campaignData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la création de la campagne"
      );
    }
    throw error;
  }
};

/**
 * Récupère la liste des campagnes
 * @param filters - Filtres optionnels 
 */
export const listCampagnes = async (filters?: { 
  status?: string; 
  limit?: number 
}): Promise<PublicCampagneInfo[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api().get<PublicCampagneInfo[]>(`/campagnes${query}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération de la liste des campagnes"
      );
    }
    throw error;
  }
};
