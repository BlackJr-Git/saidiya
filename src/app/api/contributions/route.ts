import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// GET /api/contributions?campaignId=xyz
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return NextResponse.json(
      { message: "Campaign ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get all contributions for a campaign
    const contributions = await prisma.contribution.findMany({
      where: {
        campaignId: campaignId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Calculate total amount contributed
    const totalAmount = await prisma.contribution.aggregate({
      where: {
        campaignId: campaignId,
      },
      _sum: {
        amount: true,
      },
    });

    // Count number of contributors
    const uniqueContributors = await prisma.contribution.groupBy({
      by: ["userId"],
      where: {
        campaignId: campaignId,
      },
    });

    return NextResponse.json({
      contributions,
      stats: {
        totalAmount: totalAmount._sum.amount || 0,
        contributorsCount: uniqueContributors.length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch contributions:", error);
    return NextResponse.json(
      { message: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

// POST /api/contributions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { amount, campaignId } = body;
    if (!amount || !campaignId) {
      return NextResponse.json(
        { message: "Amount and campaignId are required" },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Vérifier si l'utilisateur est authentifié
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour créer une contribution" },
        { status: 401 }
      );
    }

    // Create the contribution
    // Utilisation d'une transaction pour créer la contribution et mettre à jour le montant de la campagne
    // Augmenter le timeout à 10 secondes (10000ms) pour éviter l'expiration
    const contribution = await prisma.$transaction(
      async (tx) => {
        // 1. Créer la contribution
        const newContribution = await tx.contribution.create({
          data: {
            amount: body.amount,
            message: body.message || "",
            anonymous: body.anonymous || false,
            campaign: {
              connect: {
                id: campaignId,
              },
            },
            // Lier à l'utilisateur si authentifié
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        // 2. Mettre à jour le montant actuel de la campagne
        await tx.campaign.update({
          where: {
            id: campaignId,
          },
          data: {
            currentAmount: {
              increment: body.amount,
            },
          },
        });

        return newContribution;
      },
      {
        timeout: 10000, // Augmenter le timeout à 10 secondes (10000ms)
        maxWait: 5000, // 5 secondes max d'attente pour acquérir une connexion
      }
    );

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error("Failed to create contribution:", error);
    return NextResponse.json(
      { message: "Failed to create contribution" },
      { status: 500 }
    );
  }
}
