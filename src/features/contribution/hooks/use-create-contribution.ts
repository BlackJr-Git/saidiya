import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContributionCreate } from "@/types/contribution";
import { createContribution } from "../services/contribution";

/**
 * Hook pour créer une nouvelle contribution
 */
export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContributionCreate) => createContribution(data),
    onSuccess: (_, variables) => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ["contributions", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campagne", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campagnes"] });
    },
  });
}
