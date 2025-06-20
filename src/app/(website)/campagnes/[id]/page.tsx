"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCampagneById } from "@/features/campagne/hooks";
import { CampagneDetail } from "@/features/campagne/components";
import { Button } from "@/components/ui/button";
import { PublicCampagneInfo } from "@/types/campagne";

export default function CampagnePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Utiliser React.use() pour déballer les params qui sont maintenant une Promise
  const { id } = use(params);

  // Récupérer les données de la campagne depuis l'API
  const { data: campagne, isLoading, isError } = useCampagneById(id);



  // Si nous n'avons pas encore de données et que le chargement est en cours
  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>
        <CampagneDetail campagne={{} as PublicCampagneInfo} isLoading={true} />
      </div>
    );
  }

  // Si nous n'avons pas trouvé de campagne
  if (!campagne && !isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Campagne introuvable</h1>
          <p className="mb-8 text-muted-foreground">
            La campagne que vous recherchez n&apos;existe pas ou a été
            supprimée.
          </p>
          <Link href="/campagnes">
            <Button>Voir toutes les campagnes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <BackButton />
      </div>

      {campagne && <CampagneDetail campagne={campagne} />}

      {isError && (
        <div className="mt-8 text-sm text-destructive text-center">
          Une erreur est survenue lors du chargement de la campagne. Veuillez réessayer plus tard.
        </div>
      )}
    </div>
  );
}

function BackButton() {
  return (
    <Link href="/campagnes">
      <Button variant="ghost" className="flex items-center gap-1 pl-1">
        <ChevronLeft className="h-4 w-4" />
        Retour aux campagnes
      </Button>
    </Link>
  );
}
