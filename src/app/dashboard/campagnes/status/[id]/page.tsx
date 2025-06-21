"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  useAdminCampaignDetail,
  useUpdateCampaign,
} from "@/features/dashboard/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDate } from "@/utils/date";

export default function CampaignStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Récupérer les détails de la campagne
  const { data: campaign, isLoading, error } = useAdminCampaignDetail(id);

  // Mutation pour mettre à jour le statut
  const { mutate: updateCampaign, isPending: isUpdating } = useUpdateCampaign();

  // Options de statut
  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Complétée" },
    { value: "cancelled", label: "Annulée" },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) {
      toast("Veuillez sélectionner un statut");
      return;
    }

    updateCampaign(
      {
        id,
        data: {
          status: status as "draft" | "active" | "completed" | "cancelled",
        },
      },
      {
        onSuccess: () => {
          toast("Statut mis à jour avec succès");
          router.push("/dashboard/campagnes");
        },
        onError: (error) => {
          toast("Une erreur est survenue lors de la mise à jour du statut.");
          console.error("Erreur lors de la mise à jour du statut:", error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de la campagne. Veuillez réessayer
            ultérieurement.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Modifier le statut</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{campaign.title}</CardTitle>
          <CardDescription>
            Créée le {formatDate(campaign.createdAt || new Date())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Statut actuel</p>
                <div className="px-3 py-2 border rounded-md bg-muted">
                  {statusOptions.find((opt) => opt.value === campaign.status)
                    ?.label || campaign.status}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Objectif</p>
                <div className="px-3 py-2 border rounded-md bg-muted">
                  {campaign.targetAmount} $
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau statut</label>
                <Select
                  defaultValue={campaign.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  La modification du statut peut affecter la visibilité et les
                  fonctionnalités de la campagne.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à jour le statut"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
