"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useListCampagnes } from "@/features/campagne/hooks";
import { CampagneGrid } from "@/features/campagne/components";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampagnesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("active");

  // Utilisation du hook pour récupérer les campagnes avec un filtre de statut
  const {
    data: campagnes = [],
    isLoading,
    isError,
  } = useListCampagnes({
    status: activeTab !== "all" ? activeTab : undefined,
  });



  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Campagnes</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Découvrez les projets qui changent le monde et soutenez ceux qui
            vous inspirent.
          </p>
        </div>
        <div>
          <Button
            onClick={() => router.push("/campagnes/create")}
            className="flex items-center gap-2"
            size="lg"
          >
            <PlusCircle size={18} />
            Créer une campagne
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={handleTabChange}>
        <div className="mb-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-0">
          <CampagneGrid
            campagnes={campagnes}
            isLoading={isLoading}
            emptyMessage={isError ? "Impossible de charger les campagnes" : "Aucune campagne active pour le moment"}
          />
          {isError && (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <CampagneGrid
            campagnes={campagnes}
            isLoading={isLoading}
            emptyMessage={isError ? "Impossible de charger les campagnes" : "Aucune campagne terminée"}
          />
          {isError && (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <CampagneGrid
            campagnes={campagnes}
            isLoading={isLoading}
            emptyMessage={isError ? "Impossible de charger les campagnes" : "Aucune campagne disponible"}
          />
          {isError && (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
