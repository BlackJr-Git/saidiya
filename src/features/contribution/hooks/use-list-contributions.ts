import { useQuery } from "@tanstack/react-query";
import { getContributions } from "../services/contribution";

/**
 * Hook pour récupérer les contributions d'une campagne
 */
export function useListContributions(campaignId: string, limit: number = 10) {
  return useQuery({
    queryKey: ["contributions", campaignId, limit],
    queryFn: () => getContributions(campaignId, limit),
    enabled: !!campaignId,
  });
}
