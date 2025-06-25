/**
 * Services d'authentification
 * Fonctions pour gérer l'authentification des utilisateurs
 */

import { authClient } from "@/lib/shared/auth-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { api } from "@/lib/shared/api";
// import { setIsConnected } from "@/lib/shared/store";
/**
 * Déconnexion de l'utilisateur
 * @param router - L'instance du router Next.js pour la redirection
 * @param redirectUrl - URL de redirection après déconnexion (par défaut: /login)
 */
export const signOut = async (
  router: AppRouterInstance,
  redirectUrl: string = "/login"
) => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(redirectUrl); // redirection vers la page de connexion
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur est connecté
 * Utilise l'API auth pour vérifier la session
 */
export const checkAuthenticated = async () => {
  try {
    // Nous allons nous fier à une requête simple vers l'API utilisateur
    // qui vérifiera l'authentification pour nous
    const response = await api().get('/user');
    return response.data.status === 200;
  } catch (error) {
    console.error("Erreur lors de la vérification d'authentification:", error);
    return false;
  }
};
