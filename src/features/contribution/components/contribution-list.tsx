"use client";

import { useListContributions } from "@/features/contribution/hooks/use-list-contributions";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
// import { ContributionResponse } from "@/types/contribution";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContributionListProps {
  campaignId: string;
  limit?: number;
}

export function ContributionList({
  campaignId,
  limit = 10,
}: ContributionListProps) {
  const { data, isLoading, error } = useListContributions(campaignId, limit);

  // Formater le montant en dollars
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Contributions récentes</h3>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les contributions. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  // Si aucune contribution n'est trouvée
  if (!data?.contributions || data.contributions.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <h3 className="text-xl font-semibold mb-2">Aucune contribution</h3>
        <p className="text-muted-foreground">
          Soyez le premier à soutenir cette campagne!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Contributions récentes</h3>
      
      {data.contributions.map((contribution) => (
        <div
          key={contribution.id}
          className="flex items-start space-x-4 p-4 border rounded-md hover:bg-accent/5 transition-colors"
        >
          <Avatar>
            {contribution.anonymous || !contribution.userImage ? (
              <AvatarFallback>
                {contribution.anonymous ? "AN" : contribution.userName?.charAt(0) || "?"}
              </AvatarFallback>
            ) : (
              <AvatarImage src={contribution.userImage} alt={contribution.userName || ""} />
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">
                {contribution.anonymous
                  ? "Contributeur anonyme"
                  : contribution.userName || "Inconnu"}
              </h4>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(contribution.amount)}
              </span>
            </div>
            
            {contribution.message && (
              <p className="text-sm text-muted-foreground mt-1">
                &quot;Merci pour cette campagne&quot;
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(contribution.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
