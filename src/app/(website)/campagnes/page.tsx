"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useListCampagnes } from "@/features/campagne/hooks";
import { CampagneGrid } from "@/features/campagne/components";
import { PlusCircle } from "lucide-react";
import { PublicCampagneInfo } from "@/types/campagne";

// Import des données factices pour le développement
import mockData from "@/mocks/campagnes.json";

import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampagnesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [displayCampagnes, setDisplayCampagnes] = useState<PublicCampagneInfo[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  
  // Utilisation du hook pour récupérer les campagnes avec un filtre de statut
  const { data: campagnes, isLoading, isError } = useListCampagnes({
    status: activeTab !== "all" ? activeTab : undefined,
  });
  
  useEffect(() => {
    // Utiliser les données fictives en cas d'erreur ou pendant le chargement (en développement ou production)
    if (!useMockData && (isError || isLoading)) {
      console.log("Utilisation des données fictives pour les campagnes");
      
      // Filtrer les campagnes selon l'onglet actif
      const filteredMockCampagnes = mockData.campagnes
        .filter(c => {
          if (activeTab === "all") return true;
          return c.status === activeTab;
        })
        .map(c => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          createdAt: new Date(c.createdAt),
          status: c.status as "active" | "completed" | "draft" | "cancelled"
        }));
      
      setDisplayCampagnes(filteredMockCampagnes as PublicCampagneInfo[]);
      setUseMockData(true);
      return;
    }
    
    // Si nous avons des données réelles, les utiliser
    if (!useMockData && campagnes && campagnes.length > 0) {
      setDisplayCampagnes(campagnes);
    } else if (useMockData && activeTab) {
      // Si on change d'onglet avec les données fictives, filtrer à nouveau
      const filteredMockCampagnes = mockData.campagnes
        .filter(c => {
          if (activeTab === "all") return true;
          return c.status === activeTab;
        })
        .map(c => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          createdAt: new Date(c.createdAt),
          status: c.status as "active" | "completed" | "draft" | "cancelled"
        }));
      
      setDisplayCampagnes(filteredMockCampagnes as PublicCampagneInfo[]);
    }
  }, [campagnes, isLoading, isError, useMockData, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Si on utilise des données fictives, on doit filtrer manuellement
    if (useMockData) {
      const filteredMockCampagnes = mockData.campagnes
        .filter(c => {
          if (value === "all") return true;
          return c.status === value;
        })
        .map(c => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          createdAt: new Date(c.createdAt),
          status: c.status as "active" | "completed" | "draft" | "cancelled"
        }));
      
      setDisplayCampagnes(filteredMockCampagnes as PublicCampagneInfo[]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Campagnes</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Découvrez les projets qui changent le monde et soutenez ceux qui vous inspirent.
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
                campagnes={displayCampagnes} 
                isLoading={isLoading && !useMockData} 
                emptyMessage="Aucune campagne active pour le moment"
              />
              {useMockData && (
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  ⓘ Affichage de données fictives à des fins de développement
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <CampagneGrid 
                campagnes={displayCampagnes} 
                isLoading={isLoading && !useMockData}
                emptyMessage="Aucune campagne terminée"
              />
              {useMockData && (
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  ⓘ Affichage de données fictives à des fins de développement
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <CampagneGrid 
                campagnes={displayCampagnes} 
                isLoading={isLoading && !useMockData}
              />
              {useMockData && (
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  ⓘ Affichage de données fictives à des fins de développement
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
