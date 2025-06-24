"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Share2, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PublicCampagneInfo } from "@/types/campagne";
import { useCampagneOwnership } from "@/features/campagne/hooks/ownership";
// import { Base64Image } from "@/components/ui/base64-image";
import Image from "next/image";
import { ContributionList } from "@/features/contribution/components";
import { ContributionModal } from "@/features/contribution/components/contribution-modal";

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

interface CampagneDetailProps {
  campagne: PublicCampagneInfo;
  isLoading?: boolean;
}

// Composant squelette pour l'état de chargement
function CampagneDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-72 md:h-96 w-full bg-muted rounded-lg" />
      
      <div>
        <div className="h-10 w-3/4 bg-muted rounded-md" />
        <div className="h-4 w-1/3 bg-muted rounded-md mt-2" />
      </div>
      
      <Card className="border-2">
        <CardHeader className="pb-2">
          <div className="h-6 w-1/3 bg-muted rounded-md" />
          <div className="flex items-center justify-between mt-3">
            <div className="h-6 w-1/4 bg-muted rounded-md" />
            <div className="h-6 w-1/4 bg-muted rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full bg-muted rounded-full" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-4 w-16 bg-muted rounded-md" />
            <div className="h-4 w-24 bg-muted rounded-md" />
          </div>
          <div className="h-10 w-full bg-muted rounded-md mt-4" />
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <div>
          <div className="h-8 w-1/4 bg-muted rounded-md mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-3/4 bg-muted rounded-md" />
          </div>
        </div>
        
        <div className="h-px w-full bg-muted" />
        
        <div>
          <div className="h-8 w-1/3 bg-muted rounded-md mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 bg-muted/50 rounded-lg">
                <div className="h-4 w-1/3 bg-muted rounded-md mb-2" />
                <div className="h-5 w-1/2 bg-muted rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampagneDetail({ campagne, isLoading = false }: CampagneDetailProps) {
  const {
    // id non utilisé mais conservé pour référence future
    title,
    description,
    coverImage,
    targetAmount,
    currentAmount,
    progress,
    status,
    localisation,
    category,
    createdAt
  } = campagne;
  
  // État pour contrôler l'affichage du modal de contribution
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  
  // S'assurer que createdAt est une date valide avant de la formater
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true,
    locale: fr
  }) : "récemment";
  
  if (isLoading) {
    return <CampagneDetailSkeleton />;
  }
  
  return (
    <div>
      {/* Layout à deux colonnes: Contenu principal à gauche, carte de financement fixe à droite */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Colonne de gauche - Image, titre et contenu principal */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Image de couverture */}
          <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-lg">
            <Image 
              src={typeof coverImage === 'string' ? coverImage : "/placeholder-campaign.jpg"} 
              alt={title || "Image de la campagne"}
              fill
              className="object-cover" 
              priority
            />
            {/* <Base64Image
              base64String={coverImage || ""}
              alt={title || "Image de la campagne"}
              className="object-cover bg-red-500"
              width={800}
              height={450}
            /> */}
            <div className="absolute right-4 top-4">
              <Badge variant={statusConfig[status].variant} className="text-sm font-medium px-3 py-1">
                {statusConfig[status].label}
              </Badge>
            </div>
          </div>
          
          {/* Titre et date */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">{title}</h1>
            <p className="text-muted-foreground text-sm">Créée {timeAgo}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Informations complémentaires */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Informations complémentaires</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground mb-1">Date de création</dt>
                <dd className="text-base">{createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : "Date non disponible"}</dd>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground mb-1">Catégorie</dt>
                <dd className="text-base">{category}</dd>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground mb-1">Porteur de projet</dt>
                <dd className="text-base">Association Horizon</dd>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <dt className="text-sm font-medium text-muted-foreground mb-1">Localisation</dt>
                <dd className="text-base">{localisation}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Colonne de droite - Carte de financement fixe */}
        <div className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Carte de financement */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Financement</CardTitle>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-bold">{formatCurrency(currentAmount)}</span>
                  <span className="text-sm text-muted-foreground">sur {formatCurrency(targetAmount)}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Barre de progression */}
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">{progress}%</span>
                  <span className="text-sm text-muted-foreground">{Math.round(currentAmount / targetAmount * 100)}% financé</span>
                </div>
                
                {/* Affichage du temps restant pour les campagnes actives */}
                {status === "active" && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Il reste 45 jours
                  </div>
                )}

                {/* Bouton de contribution pour les campagnes actives */}
                {status === "active" && (
                  <div className="mt-4">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={() => setIsContributionModalOpen(true)}
                    >
                      Contribuer maintenant
                    </Button>
                    
                    {/* Modal de contribution */}
                    <ContributionModal
                      campaignId={campagne.id}
                      isOpen={isContributionModalOpen}
                      onClose={() => setIsContributionModalOpen(false)}
                    />
                  </div>
                )}

                {/* Résumé des contributions */}
                {/* <div className="mt-6">
                  <ContributionSummary campaignId={campagne.id} />
                </div> */}

                {/* Statistiques et Partage */}
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium">Actions</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Button de statistiques visible uniquement par le propriétaire */}
                    <CampagneOwnerAction id={campagne.id} />
                    
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Liste des contributions récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contributions récentes</CardTitle>
                <CardDescription>Les derniers soutiens à cette campagne</CardDescription>
              </CardHeader>
              <CardContent>
                <ContributionList campaignId={campagne.id} limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant d'action visible uniquement par le propriétaire de la campagne
 */
function CampagneOwnerAction({ id }: { id: string }) {
  // Vérifier si l'utilisateur est le propriétaire de la campagne
  const { data: isOwner } = useCampagneOwnership(id);
  
  if (!isOwner) {
    return null;
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
      asChild
    >
      <a href={`/campagnes/${id}/statistique`}>
        <BarChart2 size={16} />
        Statistiques
      </a>
    </Button>
  );
}

// function CampagneDetailSkeleton() {
//   return (
//     <div className="space-y-8 animate-pulse">
//       <div className="h-72 md:h-96 w-full bg-muted rounded-lg" />
      
//       <div>
//         <div className="h-10 w-3/4 bg-muted rounded-md" />
//         <div className="h-4 w-1/3 bg-muted rounded-md mt-2" />
//       </div>
      
//       <Card className="border-2">
//         <CardHeader className="pb-2">
//           <div className="h-6 w-1/3 bg-muted rounded-md" />
//           <div className="flex items-center justify-between mt-3">
//             <div className="h-6 w-1/4 bg-muted rounded-md" />
//             <div className="h-6 w-1/4 bg-muted rounded-md" />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="h-3 w-full bg-muted rounded-full" />
//           <div className="flex items-center justify-between mt-2">
//             <div className="h-4 w-16 bg-muted rounded-md" />
//             <div className="h-4 w-24 bg-muted rounded-md" />
//           </div>
//           <div className="h-10 w-full bg-muted rounded-md mt-4" />
//         </CardContent>
//       </Card>
      
//       <div className="space-y-6">
//         <div>
//           <div className="h-8 w-1/4 bg-muted rounded-md mb-4" />
//           <div className="space-y-2">
//             <div className="h-4 w-full bg-muted rounded-md" />
//             <div className="h-4 w-full bg-muted rounded-md" />
//             <div className="h-4 w-3/4 bg-muted rounded-md" />
//           </div>
//         </div>
        
//         <div className="h-px w-full bg-muted" />
        
//         <div>
//           <div className="h-8 w-1/3 bg-muted rounded-md mb-4" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[1, 2, 3, 4].map((item) => (
//               <div key={item} className="p-4 bg-muted/50 rounded-lg">
//                 <div className="h-4 w-1/3 bg-muted rounded-md mb-2" />
//                 <div className="h-5 w-1/2 bg-muted rounded-md" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
