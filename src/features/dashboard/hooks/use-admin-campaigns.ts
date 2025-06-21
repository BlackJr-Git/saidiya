import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listCampagnes,
  getCampagneById,
  updateCampagneProfile,
  // createCampagne,
} from "@/features/campagne/services";
import { CampaignFilterOptions, CampagneProfileUpdate } from "../types";


// Clés de requête pour React Query
export const adminCampaignKeys = {
  all: ["admin", "campaigns"] as const,
  list: (filters?: CampaignFilterOptions) =>
    [...adminCampaignKeys.all, "list", filters] as const,
  detail: (id: string) => [...adminCampaignKeys.all, "detail", id] as const,
  stats: () => [...adminCampaignKeys.all, "stats"] as const,
};

/**
 * Hook pour récupérer toutes les campagnes (vue administrateur)
 */
export const useAdminCampaigns = (filters?: CampaignFilterOptions) => {
  return useQuery({
    queryKey: adminCampaignKeys.list(filters),
    queryFn: () => listCampagnes(filters),
  });
};

/**
 * Hook pour récupérer une campagne spécifique pour l'administration
 */
export const useAdminCampaignDetail = (id: string) => {
  return useQuery({
    queryKey: adminCampaignKeys.detail(id),
    queryFn: () => getCampagneById(id),
    enabled: !!id, // N'exécuter la requête que si un ID est fourni
  });
};

/**
 * Hook pour approuver une campagne
 */
export const useApproveCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateCampagneProfile(id, { status: "active" }),
    onSuccess: (data) => {
      // Mettre à jour le cache après une mise à jour réussie
      queryClient.invalidateQueries({ queryKey: adminCampaignKeys.list() });
      queryClient.invalidateQueries({
        queryKey: adminCampaignKeys.detail(data.id),
      });
    },
  });
};

/**
 * Hook pour rejeter une campagne
 */
export const useRejectCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; reason?: string }) =>
      updateCampagneProfile(id, { status: "cancelled" }),
    onSuccess: (data) => {
      // Mettre à jour le cache après une mise à jour réussie
      queryClient.invalidateQueries({ queryKey: adminCampaignKeys.list() });
      queryClient.invalidateQueries({
        queryKey: adminCampaignKeys.detail(data.id),
      });
    },
  });
};

/**
 * Hook pour mettre à jour une campagne (admin)
 */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampagneProfileUpdate }) =>
      updateCampagneProfile(id, data),
    onSuccess: (data) => {
      // Mettre à jour le cache après une mise à jour réussie
      queryClient.invalidateQueries({ queryKey: adminCampaignKeys.list() });
      queryClient.invalidateQueries({
        queryKey: adminCampaignKeys.detail(data.id),
      });
    },
  });
};

/**
 * Hook pour mettre en avant une campagne
 */
// export const useFeatureCampaign = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id }: { id: string; featured: boolean }) =>
//       updateCampagneProfile(id),
//     onSuccess: (data) => {
//       // Mettre à jour le cache après une mise à jour réussie
//       queryClient.invalidateQueries({ queryKey: adminCampaignKeys.list() });
//       queryClient.invalidateQueries({
//         queryKey: adminCampaignKeys.detail(data.id),
//       });
//     },
//   });
// };
