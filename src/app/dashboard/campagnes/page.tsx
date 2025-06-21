"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CampaignTable } from "@/features/dashboard/components";
import { useAdminCampaigns } from "@/features/dashboard/hooks";
import { CampaignActionConfig } from "@/features/dashboard/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function CampaignsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Récupérer la liste des campagnes
  const {
    data: campaigns,
    isLoading,
    error,
  } = useAdminCampaigns({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: statusFilter as any,
    searchTerm: searchTerm,
  });

  // Configuration des actions pour chaque campagne
  const campaignActions: CampaignActionConfig[] = [
    {
      label: "Voir les détails",
      action: "view",
    },
    {
      label: "Modifier le statut",
      action: "status",
    },
    {
      label: "Supprimer",
      action: "delete",
      confirmationMessage:
        "Êtes-vous sûr de vouloir supprimer cette campagne ?",
      requireConfirmation: true,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est déjà gérée par l'état searchTerm
  };

  const handleCampaignAction = (action: string, campaignId: string) => {
    switch (action) {
      case "view":
        router.push(`/campagnes/${campaignId}`);
        break;
      case "status":
        router.push(`/campagnes/status/${campaignId}`);
        break;
      case "delete":
        toast("Fonction de suppression non implémentée");
        break;
      default:
        console.log(`Action "${action}" non gérée`);
    }
  };

  return (
    <ContentLayout title="Toutes les campagnes">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Toutes les campagnes</h1>
        <Button onClick={() => router.push("/campagnes/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle campagne
        </Button>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Recherchez et filtrez les campagnes selon vos critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <form
              onSubmit={handleSearch}
              className="relative flex-1 flex items-center"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une campagne..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="ghost" className="ml-2">
                Rechercher
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm whitespace-nowrap">Statut:</span>
              <Select
                value={statusFilter || ""}
                onValueChange={(value) =>
                  setStatusFilter(value === "" ? null : value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Complétée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <div className="p-4 text-center text-destructive">
          Une erreur est survenue lors du chargement des campagnes. Veuillez
          réessayer ultérieurement.
        </div>
      ) : (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Liste des campagnes</CardTitle>
            <CardDescription>
              {campaigns?.length
                ? `${campaigns.length} campagne(s) trouvée(s)`
                : "Aucune campagne trouvée"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignTable
              campaigns={campaigns || []}
              onAction={handleCampaignAction}
              availableActions={campaignActions}
            />
          </CardContent>
        </Card>
      )}
    </ContentLayout>
  );
}
