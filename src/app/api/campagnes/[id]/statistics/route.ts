import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/shared/prisma";

// GET /api/campagnes/[id]/statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    // Vérifier si l'utilisateur est authentifié
    if (!session?.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à cette ressource" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Vérifier que la campagne existe et que l'utilisateur en est le propriétaire
    const campagne = await prisma.campaign.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        userId: true,
      }
    });

    if (!campagne) {
      return NextResponse.json(
        { error: "Campagne introuvable" },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur connecté est bien le propriétaire de la campagne
    if (campagne.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à accéder à ces statistiques" },
        { status: 403 }
      );
    }

    // Dans une application réelle, vous récupéreriez ces données depuis une base de données
    // Pour cet exemple, nous générons des données fictives

    // Création de données d'exemple pour les vues au fil du temps
    const today = new Date();
    const viewsOverTime = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (13 - i));
      return {
        date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
        views: Math.floor(Math.random() * 100) + 10,
      };
    });
    
    // Données d'engagement par source
    const engagementBySource = [
      { source: "Réseaux sociaux", rate: Math.floor(Math.random() * 30) + 10 },
      { source: "Email", rate: Math.floor(Math.random() * 20) + 15 },
      { source: "Recherche", rate: Math.floor(Math.random() * 15) + 5 },
      { source: "Direct", rate: Math.floor(Math.random() * 25) + 20 },
      { source: "Référents", rate: Math.floor(Math.random() * 10) + 5 },
    ];
    
    // Données de conversion
    const conversionData = [
      { step: "Visite", value: 100 },
      { step: "Engagement", value: Math.floor(Math.random() * 60) + 20 },
      { step: "Inscription", value: Math.floor(Math.random() * 40) + 10 },
      { step: "Contribution", value: Math.floor(Math.random() * 20) + 5 },
    ];

    // Calcul du total des vues (somme des vues de tous les jours)
    const totalViews = viewsOverTime.reduce((sum, day) => sum + day.views, 0);
    
    // Engagement moyen
    const engagementRate = Math.floor(Math.random() * 30) + 10;
    
    // Nombre de conversions
    const conversions = Math.floor(Math.random() * 50) + 5;

    // Créer l'objet de statistiques
    const statisticsData = {
      id: campagne.id,
      campaignTitle: campagne.title,
      totalViews,
      viewsChange: Math.floor(Math.random() * 30) - 10, // Entre -10% et +20%
      engagementRate,
      engagementChange: Math.floor(Math.random() * 20) - 5, // Entre -5% et +15%
      conversions,
      conversionChange: Math.floor(Math.random() * 25) - 5, // Entre -5% et +20%
      viewsOverTime,
      engagementBySource,
      conversionData
    };

    return NextResponse.json(statisticsData);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
