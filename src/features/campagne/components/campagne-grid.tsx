"use client";

import { PublicCampagneInfo } from "@/types/campagne";
import { CampagneCard } from "./campagne-card";
import { Skeleton } from "@/components/ui/skeleton";

interface CampagneGridProps {
  campagnes: PublicCampagneInfo[];
  isLoading?: boolean;
  emptyMessage?: string;
  variant?: "default" | "compact";
  columns?: 1 | 2 | 3 | 4;
}

export const CampagneGrid = ({
  campagnes,
  isLoading = false,
  emptyMessage = "Aucune campagne trouvée",
  variant = "default",
  columns = 3,
}: CampagneGridProps) => {
  // Définir les classes CSS pour la grille en fonction du nombre de colonnes
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  if (isLoading) {
    return (
      <div className={`grid ${gridClasses} gap-4 md:gap-6`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CampagneCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    );
  }

  if (campagnes.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses} gap-4 md:gap-6`}>
      {campagnes.map((campagne) => (
        <CampagneCard key={campagne.id} campagne={campagne} variant={variant} />
      ))}
    </div>
  );
};

interface CampagneCardSkeletonProps {
  variant?: "default" | "compact";
}

export const CampagneCardSkeleton = ({ variant = "default" }: CampagneCardSkeletonProps) => {
  const isCompact = variant === "compact";
  const paddingClass = isCompact ? "p-4" : "p-6";

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      {/* Image placeholder */}
      <Skeleton className="aspect-video w-full" />

      {/* Title and description */}
      <div className={paddingClass}>
        <Skeleton className="mb-3 h-6 w-3/4" />
        {!isCompact && <Skeleton className="h-4 w-full" />}
      </div>

      {/* Progress section */}
      <div className={`${paddingClass} pt-0`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-1/5" />
            <Skeleton className="h-3 w-1/5" />
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isCompact && (
        <div className={paddingClass}>
          <Skeleton className="h-3 w-1/3" />
        </div>
      )}
    </div>
  );
};

export default CampagneGrid;
