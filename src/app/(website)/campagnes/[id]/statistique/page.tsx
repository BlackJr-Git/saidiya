"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";
// La session n'est plus nécessaire car nous utilisons useCampagneOwnership
import { useCampagneOwnership } from "@/features/campagne/hooks/ownership";
import { useCampagneById } from "@/features/campagne/hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampagneStatistics } from "@/features/campagne/hooks/statistics";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CampagneStatistiquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Utiliser React.use() pour déballer les params qui sont maintenant une Promise
  const { id } = use(params);

  // Récupérer les données de la campagne depuis l'API
  const { data: campagne, isLoading: isLoadingCampagne } = useCampagneById(id);
  
  // Nous n'avons plus besoin de la session car nous utilisons le hook de vérification de propriété
  
  // Vérifier si l'utilisateur est le propriétaire de la campagne
  // Cette vérification est faite côté serveur via l'API
  const { data: isOwner } = useCampagneOwnership(id);
  
  // Récupérer les statistiques de la campagne seulement si l'utilisateur est le propriétaire
  const { data: statistics, isLoading: isLoadingStats, isError } = useCampagneStatistics(id);

  // Si nous n'avons pas encore de données et que le chargement est en cours
  if (isLoadingCampagne || isLoadingStats) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton id={id} />
        </div>
        <h1 className="text-3xl font-bold mb-6">
          <Skeleton className="h-9 w-3/4 max-w-md" />
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Afficher un message si l'utilisateur n'est pas le propriétaire de la campagne
  if (campagne && !isLoadingCampagne && !isOwner) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton id={id} />
        </div>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
          <p className="mb-8 text-muted-foreground">
            Seul le propriétaire de cette campagne peut accéder à ses statistiques.
          </p>
          <Link href={`/campagnes/${id}`}>
            <Button>Retour à la campagne</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Si nous n'avons pas trouvé de campagne ou ses statistiques
  if ((!campagne || !statistics) && !isLoadingCampagne && !isLoadingStats) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <BackButton id={id} />
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Données introuvables</h1>
          <p className="mb-8 text-muted-foreground">
            Les statistiques de cette campagne ne sont pas disponibles pour le moment.
          </p>
          <Link href={`/campagnes/${id}`}>
            <Button>Retour à la campagne</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <BackButton id={id} />
      </div>

      <h1 className="text-3xl font-bold mb-6">
        Statistiques: {campagne?.title || 'Campagne'}
      </h1>

      <Tabs defaultValue="apercu" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="apercu">Aperçu général</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apercu">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Vues totales" 
              value={statistics?.totalViews || 0} 
              change={statistics?.viewsChange || 0} 
            />
            <StatCard 
              title="Engagement" 
              value={statistics?.engagementRate ? `${statistics.engagementRate}%` : "0%"} 
              change={statistics?.engagementChange || 0} 
            />
            <StatCard 
              title="Conversions" 
              value={statistics?.conversions || 0} 
              change={statistics?.conversionChange || 0} 
            />
          </div>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Évolution des vues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statistics?.viewsOverTime || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card className="w-full mb-8">
            <CardHeader>
              <CardTitle>{"Taux d'engagement par source"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statistics?.engagementBySource || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statistics?.conversionData || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isError && (
        <div className="mt-8 text-sm text-destructive text-center">
          Une erreur est survenue lors du chargement des statistiques. Veuillez réessayer plus tard.
        </div>
      )}
    </div>
  );
}

function BackButton({ id }: { id: string }) {
  return (
    <Link href={`/campagnes/${id}`}>
      <Button variant="ghost" className="flex items-center gap-1 pl-1">
        <ChevronLeft className="h-4 w-4" />
        Retour à la campagne
      </Button>
    </Link>
  );
}

function StatCard({ 
  title, 
  value, 
  change 
}: { 
  title: string; 
  value: number | string; 
  change: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-sm mt-2 ${change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
          {change > 0 ? '+' : ''}{change}% depuis la dernière période
        </p>
      </CardContent>
    </Card>
  );
}
