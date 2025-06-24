/**
 * Hook pour vérifier si l'utilisateur est le propriétaire d'une campagne
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/shared/auth-client";
import { api } from "@/lib/shared/api";
import { campagneKeys } from "./index";

/**
 * Vérifie si l'utilisateur est le propriétaire d'une campagne
 */
const checkCampagneOwnership = async (id: string): Promise<boolean> => {
  try {
    const response = await api().get<{ isOwner: boolean }>(`/api/campagnes/${id}/ownership`);
    return response.data.isOwner;
  } catch (error) {
    console.error("Erreur lors de la vérification de la propriété:", error);
    return false;
  }
};

/**
 * Hook pour vérifier si l'utilisateur courant est le propriétaire d'une campagne
 */
export const useCampagneOwnership = (id: string) => {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  
  return useQuery({
    queryKey: [...campagneKeys.all, "ownership", id],
    queryFn: () => checkCampagneOwnership(id),
    enabled: !!id && isAuthenticated,
    // Valeur par défaut: non propriétaire si non authentifié
    initialData: () => false
  });
};
