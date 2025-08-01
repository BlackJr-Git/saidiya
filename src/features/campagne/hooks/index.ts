/**
 * Hooks React Query pour les fonctionnalités de campagne
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCampagneById,
  // getCurrentCampagne,
  updateCampagneProfile,
  createCampagne,
  listCampagnes,
  getUserCampagnes,
  // checkCampagneStatus,
} from "@/features/campagne/services";
import { CampagneCreate, CampagneProfileUpdate } from "@/types/campagne";

// Clés de requête pour React Query
export const campagneKeys = {
  all: ["campagnes"] as const,
  currentCampagne: () => [...campagneKeys.all, "current-campagne"] as const,
  campagne: (id: string) => [...campagneKeys.all, id] as const,
  campagneStatus: () => [...campagneKeys.all, "campagne-status"] as const,
  list: () => [...campagneKeys.all, "list"] as const,
  userCampagnes: () => [...campagneKeys.all, "user-campagnes"] as const,
};

/**
 * Hook pour récupérer la campagne actuelle
 */
// export const useCurrentCampagne = () => {
//   return useQuery({
//     queryKey: campagneKeys.currentCampagne(),
//     queryFn: getCurrentCampagne,
//     retry: (failureCount, error) => {
//       // Ne pas réessayer si l'erreur est 404 (non trouvé)
//       if (error instanceof Error && error.message.includes("404")) {
//         return false;
//       }
//       return failureCount < 2;
//     },
//   });
// };

/**
 * Hook pour récupérer une campagne par son ID
 */
export const useCampagneById = (id: string) => {
  return useQuery({
    queryKey: campagneKeys.campagne(id),
    queryFn: () => getCampagneById(id),
    enabled: !!id, // N'exécuter la requête que si un ID est fourni
  });
};

/**
 * Hook pour vérifier le statut de la campagne
 */
// export const useCampagneStatus = () => {
//   return useQuery({
//     queryKey: campagneKeys.campagneStatus(),
//     queryFn: checkCampagneStatus,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

/**
 * Hook pour mettre à jour le profil de la campagne
 */
export const useUpdateCampagneProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, profileData }: { id: string; profileData: CampagneProfileUpdate }) =>
      updateCampagneProfile(id, profileData),
    onSuccess: (data) => {
      // Mettre à jour le cache campagne après une mise à jour réussie
      queryClient.setQueryData(campagneKeys.campagne(data.id), data);

      // Invalider les requêtes potentiellement impactées
      queryClient.invalidateQueries({ queryKey: campagneKeys.list() });
      queryClient.invalidateQueries({ queryKey: campagneKeys.userCampagnes() });
    },
  });
};

/**
 * Hook pour créer une nouvelle campagne
 */
export const useCreateCampagne = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignData: CampagneCreate) => createCampagne(campaignData),
    onSuccess: () => {
      // Invalider les listes des campagnes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: campagneKeys.list() });
      queryClient.invalidateQueries({ queryKey: campagneKeys.userCampagnes() });
    },
  });
};

/**
 * Hook pour récupérer les campagnes de l'utilisateur connecté
 */
export const useUserCampagnes = () => {
  return useQuery({
    queryKey: campagneKeys.userCampagnes(),
    queryFn: getUserCampagnes,
  });
};

/**
 * Hook pour récupérer la liste des campagnes
 */
export const useListCampagnes = (filters?: { status?: string, limit?: number }) => {
  return useQuery({
    queryKey: [...campagneKeys.list(), filters],
    queryFn: () => listCampagnes(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
