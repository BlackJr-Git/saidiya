/**
 * Types pour le dashboard administrateur
 */

/**
 * Configuration des colonnes pour le tableau de campagnes
 */
export interface CampaignTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
}

/**
 * Options de filtrage pour les campagnes
 */
export interface CampaignFilterOptions {
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  searchTerm?: string;
  pageSize?: number;
  page?: number;
}

/**
 * Statistiques des campagnes pour le dashboard
 */
export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  draftCampaigns: number;
  totalFundsRaised: number;
  averageFundingPercentage: number;
}

/**
 * Action disponible sur une campagne dans le dashboard
 */
export type CampaignAction = 'view' | 'edit' | 'delete' | 'approve' | 'reject' | 'feature' | 'status';

/**
 * Configuration du menu d'actions pour une campagne
 */
export interface CampaignActionConfig {
  action: CampaignAction;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  requireConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface CampagneProfileUpdate {
    title?: string;
    description?: string;
    coverImage?: string;
    targetAmount?: number;
    startDate?: Date;
    endDate?: Date;
    status?: "draft" | "active" | "completed" | "cancelled";
  }