"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useListCampagnes } from "@/features/campagne/hooks";
import { CampagneGrid } from "@/features/campagne/components";
import { PlusCircle, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicCampagneInfo } from "@/types/campagne";

// Mappage des catégories en anglais vers le français
const categoryTranslations: Record<string, string> = {
  "education": "Éducation",
  "health": "Santé",
  "environment": "Environnement",
  "humanitarian": "Humanitaire",
  "culture": "Culture",
  "tech": "Technologie",
  "community": "Communauté",
  "sport": "Sport",
  "art": "Art",
  "music": "Musique",
  "business": "Entreprise",
  "other": "Autre"
};

// Fonction pour traduire une catégorie
const translateCategory = (category: string): string => {
  return categoryTranslations[category] || category;
};

export default function CampagnesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Utilisation du hook pour récupérer les campagnes avec un filtre de statut
  const {
    data: campagnes = [],
    isLoading,
    isError,
  } = useListCampagnes({
    status: activeTab !== "all" ? activeTab : undefined,
  });
  
  // Extraire les catégories uniques des campagnes
  const categories = useMemo(() => {
    if (!campagnes.length) return [];
    const uniqueCategories = [...new Set(campagnes.map(campagne => campagne.category))];
    return uniqueCategories.sort();
  }, [campagnes]);

  // Grouper les campagnes par catégorie
  const campagnesByCategory = useMemo(() => {
    if (!campagnes.length) return {};
    
    // Si une catégorie est sélectionnée, ne filtrer que cette catégorie
    const filteredCampagnes = selectedCategory
      ? campagnes.filter(campagne => campagne.category === selectedCategory)
      : campagnes;
      
    // Grouper par catégorie
    return filteredCampagnes.reduce<Record<string, PublicCampagneInfo[]>>((acc, campagne) => {
      const category = campagne.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(campagne);
      return acc;
    }, {});
  }, [campagnes, selectedCategory]);



  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button 
                variant={selectedCategory === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(null)}
                className="flex items-center gap-1"
              >
                <Filter size={14} />
                Toutes les catégories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {translateCategory(category)}
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <CampagneGrid
              campagnes={[]}
              isLoading={true}
              emptyMessage="Chargement des campagnes..."
            />
          ) : isError ? (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          ) : Object.keys(campagnesByCategory).length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">Aucune campagne active pour le moment</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(campagnesByCategory).map(([category, categoryCampagnes]) => (
                <section key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">{translateCategory(category)}</h2>
                  <CampagneGrid
                    campagnes={categoryCampagnes}
                    isLoading={false}
                    columns={3}
                  />
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {isLoading ? (
            <CampagneGrid
              campagnes={[]}
              isLoading={true}
              emptyMessage="Chargement des campagnes..."
            />
          ) : isError ? (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          ) : Object.keys(campagnesByCategory).length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">Aucune campagne terminée</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(campagnesByCategory).map(([category, categoryCampagnes]) => (
                <section key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">{translateCategory(category)}</h2>
                  <CampagneGrid
                    campagnes={categoryCampagnes}
                    isLoading={false}
                    columns={3}
                  />
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <CampagneGrid
              campagnes={[]}
              isLoading={true}
              emptyMessage="Chargement des campagnes..."
            />
          ) : isError ? (
            <div className="mt-4 text-sm text-destructive text-center">
              Une erreur est survenue lors du chargement des campagnes. Veuillez réessayer plus tard.
            </div>
          ) : Object.keys(campagnesByCategory).length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">Aucune campagne disponible</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(campagnesByCategory).map(([category, categoryCampagnes]) => (
                <section key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">{translateCategory(category)}</h2>
                  <CampagneGrid
                    campagnes={categoryCampagnes}
                    isLoading={false}
                    columns={3}
                  />
                </section>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
