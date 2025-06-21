"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserCampagnes } from "@/features/campagne/hooks";
// import { CampagneGrid } from "@/features/campagne/components";
import { Plus, PenLine, Trash2, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/features/auth/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Campaign, Status } from "@/types/campagne";
import Link from "next/link";
import { formatDate } from "@/utils/date";

export default function MesCampagnesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  //   const { status: authStatus } = useAuth();

  // Utilisation du hook pour récupérer les campagnes de l'utilisateur
  const { data: campagnes = [], isLoading, isError } = useUserCampagnes();

  // Redirection vers la page de login si l'utilisateur n'est pas connecté
  // if (authStatus === "unauthenticated") {
  //   router.push("/login?callbackURL=/mes-campagnes");
  //   return null;
  // }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredCampaigns =
    activeTab === "all"
      ? campagnes
      : campagnes.filter((campaign) => campaign.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Terminée</Badge>;
      case "draft":
        return <Badge className="bg-yellow-500">Brouillon</Badge>;
      case "closed":
        return <Badge className="bg-red-500">Fermée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // if (authStatus === "loading") {
  //   return <div className="container mx-auto py-8">Chargement...</div>;
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Mes Campagnes</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Gérez vos campagnes, suivez leurs progrès et modifiez leurs
            paramètres.
          </p>
        </div>
        <div>
          <Button
            onClick={() => router.push("/campagnes/create")}
            className="flex items-center gap-2"
            size="lg"
          >
            <Plus size={18} />
            Créer une campagne
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <div className="mb-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="closed">Fermées</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">
              Chargement de vos campagnes...
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Une erreur est survenue lors du chargement de vos campagnes.
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="mb-4">
                  Vous n&apos;avez pas encore de campagnes{" "}
                  {activeTab !== "all" && `avec le statut "${activeTab}"`}.
                </p>
                <Button onClick={() => router.push("/campagnes/create")}>
                  Créer votre première campagne
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Création</TableHead>
                    <TableHead>Objectif</TableHead>
                    <TableHead>Collecté</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/campagnes/${campaign.id}`}
                          className="hover:underline"
                        >
                          {campaign.title}
                        </Link>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                      <TableCell>
                        {campaign.targetAmount.toLocaleString()} $
                      </TableCell>
                      <TableCell>
                        {campaign.currentAmount.toLocaleString()} $
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                campaign.progress || 0,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {campaign.progress || 0}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/campagnes/${campaign.id}/edit`)
                            }
                          >
                            <PenLine size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/campagnes/${campaign.id}/statistiques`
                              )
                            }
                          >
                            <BarChart size={16} />
                          </Button>
                          {campaign.status === "draft" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Êtes-vous sûr de vouloir supprimer cette campagne ?"
                                  )
                                ) {
                                  // Ajouter la logique de suppression ici
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
