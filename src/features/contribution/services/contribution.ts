import axios from '@/lib/axios';
import { ContributionCreate, ContributionResponse, ContributionStats } from '@/types/contribution';

interface ContributionsData {
  contributions: ContributionResponse[];
  stats: ContributionStats;
}

/**
 * Récupère les contributions d'une campagne
 * @param campaignId - ID de la campagne
 * @param limit - Nombre maximum de contributions à récupérer
 */
export async function getContributions(campaignId: string, limit: number = 10): Promise<ContributionsData> {
  const response = await axios.get<ContributionsData>(`/api/contributions`, {
    params: { campaignId, limit }
  });
  return response.data;
}

/**
 * Crée une nouvelle contribution
 * @param contribution - Les données de la contribution
 */
export async function createContribution(contribution: ContributionCreate): Promise<ContributionResponse> {
  const response = await axios.post<ContributionResponse>('/api/contributions', contribution);
  return response.data;
}
