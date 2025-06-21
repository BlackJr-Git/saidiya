export interface ContributionCreate {
  amount: number;
  message?: string;
  anonymous: boolean;
  campaignId: string;
}

export interface ContributionResponse {
  id: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  createdAt: string;
  campaignId: string;
  user?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface ContributionStats {
  totalAmount: number;
  contributionsCount: number;
  recentContributions: ContributionResponse[];
}
