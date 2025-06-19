"use client";

import { useState } from "react";
import { useListCampagnes } from "@/features/campagne/hooks";
import { CampagneGrid } from "@/features/campagne/components";

import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampagnesPage() {
  const [activeTab, setActiveTab] = useState<string>("active");
  
  // Utilisation du hook pour récupérer les campagnes avec un filtre de statut
  const { data: campagnes, isLoading } = useListCampagnes({
    status: activeTab !== "all" ? activeTab : undefined,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Campagnes</h1>
        <p className="mt-2 text-muted-foreground">
          Découvrez et soutenez des projets exceptionnels
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Campagnes en cours</CardTitle>
          <CardDescription>
            Explorez les projets qui recherchent actuellement des financements
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                campagnes={campagnes || []} 
                isLoading={isLoading} 
                emptyMessage="Aucune campagne active pour le moment"
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <CampagneGrid 
                campagnes={campagnes || []} 
                isLoading={isLoading}
                emptyMessage="Aucune campagne terminée"
              />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <CampagneGrid 
                campagnes={campagnes || []} 
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
