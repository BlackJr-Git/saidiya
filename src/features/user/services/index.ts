/**
 * Service d'API utilisateur
 * Fournit les fonctions pour interagir avec les API utilisateur
 */

import axios from "axios";
import {
  PrivateUserInfo,
  PublicUserInfo,
  UserProfileUpdate,
} from "@/types/user";
import { api } from "@/lib/shared/api";

/**
 * Récupère le profil de l'utilisateur actuellement authentifié
 * Nécessite d'être connecté
 */
export const getCurrentUser = async (): Promise<PrivateUserInfo> => {
  try {
    const response = await api().get<PrivateUserInfo>("/user");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération du profil utilisateur"
      );
    }
    throw error;
  }
};

/**
 * Met à jour le profil de l'utilisateur connecté
 * @param profileData - Données du profil à mettre à jour (nom, image)
 */
export const updateUserProfile = async (
  profileData: UserProfileUpdate
): Promise<PrivateUserInfo> => {
  try {
    const response = await api().put<PrivateUserInfo>("/user", profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la mise à jour du profil"
      );
    }
    throw error;
  }
};

/**
 * Récupère les informations publiques d'un utilisateur par son ID
 * @param userId - L'ID de l'utilisateur à récupérer
 */
export const getUserById = async (userId: string): Promise<PublicUserInfo> => {
  try {
    const response = await api().get<PublicUserInfo>(`/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Utilisateur non trouvé");
      }
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors de la récupération des données utilisateur"
      );
    }
    throw error;
  }
};

/**
 * Vérifie si l'utilisateur est actuellement connecté
 * Renvoie les données utilisateur si connecté, sinon null
 */
export const checkAuthStatus = async (): Promise<PrivateUserInfo | null> => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    // Si l'erreur est 401 (non autorisé), l'utilisateur n'est simplement pas connecté
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    // Pour les autres erreurs, les propager
    throw error;
  }
};
