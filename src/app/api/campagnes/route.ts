import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/prisma";
import { cloudinaryUpload } from "@/features/campagne/services/cloudinary-upload";

// GET /api/campagnes - Liste des campagnes avec filtres optionnels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const userId = searchParams.get("userId");

    // Construire les conditions de filtrage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {};

    // Filtre par statut
    if (status) {
      whereConditions.status = status;
    }

    // Filtre par utilisateur (mes campagnes)
    if (userId) {
      // Si on filtre par utilisateur, vérifier que l'utilisateur actuel est autorisé
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session || !session.user || session.user.id !== userId) {
        return NextResponse.json(
          { error: "Non autorisé à voir ces campagnes" },
          { status: 403 }
        );
      }
      whereConditions.userId = userId;
    }

    // Récupérer les campagnes selon les filtres
    const campaigns = await prisma.campaign.findMany({
      where: whereConditions,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Dernier créé en premier
      },
    });

    // Ajouter le pourcentage de progression à chaque campagne
    const campaignsWithProgress = campaigns.map((campaign) => {
      const progress =
        campaign.targetAmount > 0
          ? (campaign.currentAmount / campaign.targetAmount) * 100
          : 0;

      return {
        ...campaign,
        progress: Math.round(progress * 10) / 10, // Arrondir à 1 décimale
      };
    });

    return NextResponse.json(campaignsWithProgress);
  } catch (error) {
    console.error("Erreur lors de la récupération des campagnes:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des campagnes" },
      { status: 500 }
    );
  }
}

// POST /api/campagnes - Création d'une nouvelle campagne
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Vérifier si l'utilisateur est authentifié
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour créer une campagne" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Valider les données requises
    if (!body.title || !body.targetAmount || !body.category) {
      return NextResponse.json(
        { error: "Données incomplètes pour la création de la campagne" },
        { status: 400 }
      );
    }

    const base64 = body.coverImage;

    const imageUri = `data:${"image/jpeg"};base64,${base64}`;

    const coverImage = await cloudinaryUpload(imageUri);

    // Créer la campagne
    const campaign = await prisma.campaign.create({
      data: {
        title: body.title,
        description: body.description,
        coverImage: coverImage,
        targetAmount: body.targetAmount,
        currentAmount: 0, // Commence à zéro
        category: body.category,
        status: body.status || "draft",
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        localisation: body.localisation,
        userId: userId,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la campagne:", error);
    return NextResponse.json(
      { error: "Impossible de créer la campagne" },
      { status: 500 }
    );
  }
}
