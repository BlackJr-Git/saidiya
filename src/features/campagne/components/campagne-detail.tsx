"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
    categorie,
    createdAt
  } = campagne;
  
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
                <dd className="text-base">{categorie}</dd>
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
          <div className="lg:sticky lg:top-6">
            <Card className="border-2 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Objectif de financement</CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-lg">
                      {formatCurrency(currentAmount)}
                    </span>
                    <span className="text-muted-foreground">
                      sur {formatCurrency(targetAmount)}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{Math.round(progress)}% financé</span>
                  {status === "active" && (
                    <span className="text-muted-foreground">
                      Il reste 45 jours
                    </span>
                  )}
                </div>
                
                {status === "active" && (
                  <Button className="w-full mt-4 font-medium">Soutenir cette campagne</Button>
                )}
                
                {status === "completed" && (
                  <div className="w-full mt-4 text-center py-2 bg-muted rounded-md text-success font-medium">
                    Objectif atteint !
                  </div>
                )}
                
                {/* Bouton de partage */}
                <div className="flex items-center justify-center mt-4 pt-2 border-t">
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 size={16} />
                    Partager cette campagne
                  </Button>
                </div>
              </CardContent>
              
              {/* Liste des derniers dons */}
              <CardFooter className="flex flex-col p-4 pt-2 border-t">
                <h3 className="text-sm font-medium mb-3">Derniers dons</h3>
                <div className="space-y-3 w-full">
                  {/* Donation 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>GN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Gad Ntenta</p>
                        <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                      </div>
                    </div>
                    <p className="font-medium">75 €</p>
                  </div>
                  
                  {/* Donation 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/05.png" />
                        <AvatarFallback>JA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Junior Asosa</p>
                        <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
                      </div>
                    </div>
                    <p className="font-medium">120 €</p>
                  </div>
                  
                  {/* Donation 3 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/03.png" />
                        <AvatarFallback>GR</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Grace Imani</p>
                        <p className="text-xs text-muted-foreground">Il y a 1 semaine</p>
                      </div>
                    </div>
                    <p className="font-medium">50 €</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
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
