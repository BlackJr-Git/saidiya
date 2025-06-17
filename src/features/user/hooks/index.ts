/**
 * Hooks React Query pour les fonctionnalités utilisateur
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  updateUserProfile,
  getUserById,
  checkAuthStatus,
} from "../services";
import { UserProfileUpdate } from "@/types/user";

// Clés de requête pour React Query
export const userKeys = {
  all: ["users"] as const,
  currentUser: () => [...userKeys.all, "current-user"] as const,
  user: (id: string) => [...userKeys.all, id] as const,
  authStatus: () => [...userKeys.all, "auth-status"] as const,
};

/**
 * Hook pour récupérer l'utilisateur actuel
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.currentUser(),
    queryFn: getCurrentUser,
    retry: (failureCount, error) => {
      // Ne pas réessayer si l'erreur est 401 (non autorisé)
      if (error instanceof Error && error.message.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook pour récupérer un utilisateur par son ID
 */
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: userKeys.user(id),
    queryFn: () => getUserById(id),
    enabled: !!id, // N'exécuter la requête que si un ID est fourni
  });
};

/**
 * Hook pour vérifier si l'utilisateur est connecté
 */
export const useAuthStatus = () => {
  return useQuery({
    queryKey: userKeys.authStatus(),
    queryFn: checkAuthStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour mettre à jour le profil de l'utilisateur
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UserProfileUpdate) =>
      updateUserProfile(profileData),
    onSuccess: (data) => {
      // Mettre à jour le cache utilisateur après une mise à jour réussie
      queryClient.setQueryData(userKeys.currentUser(), data);

      // Invalider la requête utilisateur pour forcer un rafraîchissement si nécessaire
      queryClient.invalidateQueries({ queryKey: userKeys.currentUser() });
    },
  });
};
