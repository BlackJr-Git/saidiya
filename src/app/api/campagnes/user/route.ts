import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/shared/prisma";

// GET /api/campagnes/user - Récupère toutes les campagnes de l'utilisateur connecté
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à vos campagnes" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Récupérer toutes les campagnes de l'utilisateur
    const userCampaigns = await prisma.campaign.findMany({
      where: {
        userId: userId
      },  
      orderBy: {
        createdAt: "desc" // Plus récentes en premier
      },
      include: {
        contributions: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Ajouter le pourcentage de progression à chaque campagne
    const campaignsWithProgress = userCampaigns.map(campaign => {
      const progress = campaign.targetAmount > 0 
        ? (campaign.currentAmount / campaign.targetAmount) * 100 
        : 0;
      
      return {
        ...campaign,
        progress: Math.round(progress * 10) / 10, // Arrondir à 1 décimale
      };
    });

    return NextResponse.json(campaignsWithProgress);
  } catch (error) {
    console.error("Erreur lors de la récupération des campagnes de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer vos campagnes" },
      { status: 500 }
    );
  }
}
