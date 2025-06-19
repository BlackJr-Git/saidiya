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
  const timeAgo = formatDistanceToNow(new Date(campagne.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  // Calcul du temps restant si la campagne est active
  const daysLeft = Math.max(
    0, 
    Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  );

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link href={`/campagnes/${id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">Aucune image</span>
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge variant={statusConfig[status].variant}>
              {statusConfig[status].label}
            </Badge>
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
