import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/shared/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrivateUserInfo, UserProfileUpdate } from "@/types/user";

/**
 * GET /api/user
 * Récupère les informations de l'utilisateur connecté
 */
export async function GET() {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await auth.api.getSession({
      headers: await headers()
  })

    // Si l'utilisateur n'est pas authentifié, retourner une erreur
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur avec son ID depuis la session d'authentification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Si l'utilisateur n'existe pas dans la base de données
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Retourner les informations de l'utilisateur
    return NextResponse.json(user as PrivateUserInfo);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données utilisateur" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user
 * Modifie les informations de l'utilisateur connecté
 */
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await auth.api.getSession({
      headers: await headers()
  })

    // Si l'utilisateur n'est pas authentifié, retourner une erreur
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Récupérer les données de la requête
    const data = await request.json();
    
    // Valider les données reçues
    if (!data) {
      return NextResponse.json(
        { error: "Aucune donnée fournie" },
        { status: 400 }
      );
    }

    // Préparer les données à mettre à jour (uniquement les champs autorisés)
    const updateData: UserProfileUpdate = {};
    
    // Les champs que l'utilisateur peut modifier
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;
    
    // L'email nécessite une vérification spéciale et ne peut pas être modifié directement
    // car il faudrait réinitialiser emailVerified, envoyer un email de vérification, etc.

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Retourner les informations mises à jour
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des données utilisateur" },
      { status: 500 }
    );
  }
}
