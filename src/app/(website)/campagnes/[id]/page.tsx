"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCampagneById } from "@/features/campagne/hooks";
import { CampagneDetail } from "@/features/campagne/components";
import { Button } from "@/components/ui/button";
import { PublicCampagneInfo } from "@/types/campagne";

// Import des données factices pour le développement
import mockData from "@/mocks/campagnes.json";

export default function CampagnePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Utiliser React.use() pour déballer les params qui sont maintenant une Promise
  const { id } = use(params);

  const [campagne, setCampagne] = useState<PublicCampagneInfo | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Récupérer les données de la campagne depuis l'API
  const { data, isLoading, isError } = useCampagneById(id);

  useEffect(() => {
    // Utiliser les données factices si l'API échoue ou en développement
    if (
      !useMockData &&
      (isError || (isLoading && process.env.NODE_ENV === "development"))
    ) {
      console.log("Utilisation des données fictives pour la campagne", id);

      // Rechercher la campagne dans les données mock
      const mockCampagne = mockData.campagnes.find((c) => c.id === id);

      if (mockCampagne) {
        // Convertir les dates string en objets Date
        const formattedCampagne = {
          ...mockCampagne,
          startDate: new Date(mockCampagne.startDate),
          endDate: new Date(mockCampagne.endDate),
          createdAt: new Date(mockCampagne.createdAt),
          // Assurer que le statut est du bon type
          status: mockCampagne.status as
            | "active"
            | "completed"
            | "draft"
            | "cancelled",
        };

        setCampagne(formattedCampagne as PublicCampagneInfo);
        setUseMockData(true);
      }
      return;
    }

    // Utiliser les données réelles si disponibles
    if (!useMockData && data) {
      setCampagne(data);
    }
  }, [id, data, isLoading, isError, useMockData]);

  // Si nous n'avons pas encore de données et que le chargement est en cours
  if (!campagne && isLoading && !useMockData) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>
        <CampagneDetail campagne={{} as PublicCampagneInfo} isLoading={true} />
      </div>
    );
  }

  // Si nous n'avons pas trouvé de campagne (ni dans l'API ni dans les mocks)
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

      {useMockData && (
        <div className="mt-8 text-xs text-muted-foreground text-center">
          ⓘ Affichage de données fictives à des fins de développement
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
