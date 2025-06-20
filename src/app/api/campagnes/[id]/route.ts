import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/prisma";

// GET /api/campagnes/[id] - Récupération d'une campagne par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;

    // Récupérer la campagne avec les informations de base
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        contributions: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    // Calculer le pourcentage de progression
    const progress =
      campaign.targetAmount > 0
        ? (campaign.currentAmount / campaign.targetAmount) * 100
        : 0;

    // Formater la réponse
    const campaignResponse = {
      ...campaign,
      progress: Math.round(progress * 10) / 10, // Arrondir à 1 décimale
    };

    return NextResponse.json(campaignResponse);
  } catch (error) {
    console.error("Erreur lors de la récupération de la campagne:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les données de la campagne" },
      { status: 500 }
    );
  }
}

// PUT /api/campagnes/[id] - Mise à jour d'une campagne
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Vérifier si l'utilisateur est authentifié
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour mettre à jour une campagne" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Vérifier si la campagne existe et appartient à l'utilisateur
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
        userId: userId,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        {
          error:
            "Campagne non trouvée ou vous n'avez pas les droits nécessaires",
        },
        { status: 404 }
      );
    }

    // Mettre à jour la campagne
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        title: body.title !== undefined ? body.title : existingCampaign.title,
        description:
          body.description !== undefined
            ? body.description
            : existingCampaign.description,
        coverImage:
          body.coverImage !== undefined
            ? body.coverImage
            : existingCampaign.coverImage,
        targetAmount:
          body.targetAmount !== undefined
            ? body.targetAmount
            : existingCampaign.targetAmount,
        currentAmount:
          body.currentAmount !== undefined
            ? body.currentAmount
            : existingCampaign.currentAmount,
        category:
          body.category !== undefined
            ? body.category
            : existingCampaign.category,
        status:
          body.status !== undefined ? body.status : existingCampaign.status,
        startDate:
          body.startDate !== undefined
            ? new Date(body.startDate)
            : existingCampaign.startDate,
        endDate:
          body.endDate !== undefined
            ? new Date(body.endDate)
            : existingCampaign.endDate,
        localisation:
          body.localisation !== undefined
            ? body.localisation
            : existingCampaign.localisation,
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la campagne:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la campagne" },
      { status: 500 }
    );
  }
}

// DELETE /api/campagnes/[id] - Supprimer une campagne
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Vérifier si l'utilisateur est authentifié
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour supprimer une campagne" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Vérifier si la campagne existe et appartient à l'utilisateur
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
        userId: userId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        {
          error:
            "Campagne non trouvée ou vous n'avez pas les droits nécessaires",
        },
        { status: 404 }
      );
    }

    // Supprimer la campagne (les contributions seront supprimées en cascade grâce à la relation définie)
    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la campagne:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la campagne" },
      { status: 500 }
    );
  }
}
