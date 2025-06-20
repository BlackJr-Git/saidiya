"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/shared/auth-client";

// Type pour l'utilisateur authentifié
interface UserSession {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: unknown; // Pour les autres propriétés dynamiques
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserSession | null;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const { data: session } = await authClient.getSession();
        console.log("Session Data:", session);
        // Vérifier si la session existe et initialiser l'authentification
        if (session) {
          // Extraire les données utilisateur de différentes structures possibles
          const userData = session.user || null;
          if (userData) {
            setIsAuthenticated(true);
            setUser(userData as UserSession);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return { isAuthenticated, isLoading, user };
}
