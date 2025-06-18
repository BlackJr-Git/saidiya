import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/shared/prisma";

/**
 * GET /api/user/[id]
 * Récupère les informations d'un utilisateur spécifique par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur non spécifié" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec son ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: false,
        image: true,
        createdAt: true,
      },
    });

    // Si l'utilisateur n'existe pas
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Retourner les informations publiques de l'utilisateur
    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données utilisateur" },
      { status: 500 }
    );
  }
}
