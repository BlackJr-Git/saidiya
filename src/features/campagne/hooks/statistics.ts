/**
 * Hooks React Query pour les statistiques de campagne
 */

import { useQuery } from "@tanstack/react-query";
import { campagneKeys } from "@/features/campagne/hooks";
import { getCampagneStatistics } from "@/features/campagne/services/statistics/index";

/**
 * Hook pour récupérer les statistiques d'une campagne par son ID
 */
export const useCampagneStatistics = (id: string) => {
  return useQuery({
    queryKey: [...campagneKeys.all, 'statistics', id],
    queryFn: () => getCampagneStatistics(id),
    enabled: !!id, // N'exécuter la requête que si un ID est fourni
    staleTime: 5 * 60 * 1000, // 5 minutes avant de considérer les données comme périmées
  });
};
