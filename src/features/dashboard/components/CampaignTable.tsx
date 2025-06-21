import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, Star } from "lucide-react";
import { formatDate } from "@/utils/date";
// import Link from "next/link";
import { CampaignActionConfig } from "../types";

interface CampaignTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  campaigns: any[];
  isLoading?: boolean;
  onAction: (action: string, campaignId: string) => void;
  availableActions?: CampaignActionConfig[];
}

export function CampaignTable({
  campaigns = [],
  isLoading = false,
  onAction,
  availableActions = defaultActions,
}: CampaignTableProps) {
  // Fonction pour générer un badge selon le statut
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Complétée</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejetée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créateur</TableHead>
            <TableHead>Créée le</TableHead>
            <TableHead className="text-right">Montant cible</TableHead>
            <TableHead className="text-right">Montant collecté</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune campagne trouvée
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell>{campaign.creator?.name || "Anonyme"}</TableCell>
                <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {campaign.targetAmount?.toLocaleString()} $
                </TableCell>
                <TableCell className="text-right">
                  {campaign.raisedAmount?.toLocaleString()} $
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({Math.round((campaign.raisedAmount / campaign.targetAmount) * 100) || 0}%)
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label="Ouvrir le menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {availableActions.map((actionConfig) => (
                        <DropdownMenuItem
                          key={actionConfig.action}
                          disabled={actionConfig.disabled}
                          onClick={() => onAction(actionConfig.action, campaign.id)}
                        >
                          {actionConfig.icon}
                          <span className="ml-2">{actionConfig.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const defaultActions: CampaignActionConfig[] = [
  {
    action: "view",
    label: "Voir",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    action: "edit",
    label: "Modifier",
    icon: <Edit className="h-4 w-4" />,
  },
  {
    action: "delete",
    label: "Supprimer",
    icon: <Trash2 className="h-4 w-4" />,
    requireConfirmation: true,
    confirmationMessage: "Êtes-vous sûr de vouloir supprimer cette campagne ?",
  },
  {
    action: "feature",
    label: "Mettre en avant",
    icon: <Star className="h-4 w-4" />,
  },
];
