"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { PublicCampagneInfo } from "@/types/campagne";

// Fonction pour formater les montants en dollars
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Options pour les badges de statut
const statusConfig = {
  draft: { label: "Brouillon", variant: "outline" as const },
  active: { label: "En cours", variant: "default" as const },
  completed: { label: "Terminée", variant: "secondary" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
};

interface CampagneCardProps {
  campagne: PublicCampagneInfo;
  variant?: "default" | "compact";
}

export const CampagneCard = ({ campagne, variant = "default" }: CampagneCardProps) => {
  const {
    id,
    title,
    description,
    coverImage,
    targetAmount,
    currentAmount,
    progress,
    endDate,
    status,
  } = campagne;

  const isCompact = variant === "compact";

  // Date relative (exemple: "il y a 2 jours")
  const timeAgo = (() => {
    try {
      if (!campagne.createdAt) return "récemment";
      const date = new Date(campagne.createdAt);
      // Check if date is valid
      if (isNaN(date.getTime())) return "récemment";
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      console.error("Error formatting createdAt date:", error);
      return "récemment";
    }
  })();

  // Calcul du temps restant si la campagne est active
  const daysLeft = (() => {
    try {
      if (!endDate) return 0;
      const endDateTime = new Date(endDate);
      // Check if date is valid
      if (isNaN(endDateTime.getTime())) return 0;
      return Math.max(
        0, 
        Math.ceil((endDateTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      );
    } catch (error) {
      console.error("Error calculating days left:", error);
      return 0;
    }
  })();

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link href={`/campagnes/${id}`} className="block no-underline">
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                width={600}
                height={340}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Image non disponible</span>
              </div>
            )}
            <div className="absolute right-2 top-2">
              <Badge variant={status && statusConfig[status] ? statusConfig[status]?.variant : "outline"}>
                {status && statusConfig[status] ? statusConfig[status]?.label : "Inconnu"}
              </Badge>
            </div>
          </div>
        </div>

        <CardHeader className={isCompact ? "p-4" : "p-6"}>
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          {!isCompact && description && (
            <CardDescription className="line-clamp-2 mt-2">{description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className={isCompact ? "p-4 pt-0" : "p-6 pt-0"}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {formatCurrency(currentAmount)}
              </span>
              <span className="text-muted-foreground">
                sur {formatCurrency(targetAmount)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% atteint</span>
              {status === "active" && <span>{daysLeft} jours restants</span>}
            </div>
          </div>
        </CardContent>

        {!isCompact && (
          <>
            <Separator />
            <CardFooter className={isCompact ? "p-4" : "p-6"}>
              <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                <span>Créée {timeAgo}</span>
              </div>
            </CardFooter>
          </>
        )}
      </Link>
    </Card>
  );
};

export default CampagneCard;
