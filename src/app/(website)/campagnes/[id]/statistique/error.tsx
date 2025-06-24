"use client";

// import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function StatistiqueError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Récupérer l'ID de la campagne depuis l'URL
  const id = window.location.pathname.split('/')[2];

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <Link href={`/campagnes/${id}`}>
          <Button variant="ghost" className="flex items-center gap-1 pl-1">
            <ChevronLeft className="h-4 w-4" />
            Retour à la campagne
          </Button>
        </Link>
      </div>
      
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Erreur de chargement</h1>
        <p className="mb-2 text-muted-foreground">
          Une erreur est survenue lors du chargement des statistiques.
        </p>
        <p className="mb-8 text-sm text-destructive">
          {error.message || "Erreur inattendue"}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => reset()} variant="default">
            Réessayer
          </Button>
          <Link href={`/campagnes/${id}`}>
            <Button variant="outline">Retour à la campagne</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
