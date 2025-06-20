"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CampagneGrid } from "@/features/campagne/components";
import { useListCampagnes } from "@/features/campagne/hooks";
import { PublicCampagneInfo } from "@/types/campagne";

export default function FeaturedCampagnes() {
  const [displayCount, setDisplayCount] = useState(3);
  const [featuredCampagnes, setFeaturedCampagnes] = useState<PublicCampagneInfo[]>([]);
  
  // Récupérer les campagnes actives avec une limite
  const { data: campagnes = [], isLoading, isError } = useListCampagnes({
    status: "active",
    limit: 6, // Récupérer 6 campagnes pour avoir plus d'options
  });

  useEffect(() => {
    // Si nous avons des données réelles, les trier et les utiliser
    if (campagnes.length > 0) {
      const sorted = [...campagnes].sort((a, b) => b.progress - a.progress);
      setFeaturedCampagnes(sorted);
    }
  }, [campagnes]);

  const visibleCampagnes = featuredCampagnes.slice(0, displayCount);
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto p-4 md:p-0">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Campagnes en vedette</h2>
            <p className="mt-2 text-muted-foreground">
              Découvrez les projets qui gagnent en popularité
            </p>
          </div>
          <Link href="/campagnes" className="inline-block">
            <Button variant="outline">Voir toutes les campagnes</Button>
          </Link>
        </div>

        <CampagneGrid
          campagnes={visibleCampagnes}
          isLoading={isLoading}
          emptyMessage={isError ? "Impossible de charger les campagnes" : "Aucune campagne à afficher pour le moment"}
          columns={3}
        />
        
        {isError && (
          <div className="mt-4 text-sm text-destructive text-center">
            Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
          </div>
        )}

        {featuredCampagnes.length > displayCount && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="secondary" 
              onClick={() => setDisplayCount(prev => prev + 3)}
            >
              Voir plus de campagnes
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
