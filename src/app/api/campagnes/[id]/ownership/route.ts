import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/shared/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { isOwner: false },
        { status: 200 }
      );
    }

    const { id } = await params;

    // Récupérer la campagne et vérifier si l'utilisateur est le propriétaire
    const campagne = await prisma.campaign.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
      }
    });

    if (!campagne) {
      return NextResponse.json(
        { isOwner: false },
        { status: 200 }
      );
    }

    // Vérifier si l'utilisateur est le propriétaire
    const isOwner = campagne.userId === session.user.id;

    return NextResponse.json(
      { isOwner },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la vérification de la propriété:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification de la propriété" },
      { status: 500 }
    );
  }
}
