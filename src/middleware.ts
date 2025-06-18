import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { siteConfig } from "@/config";

// Liste des chemins d'accès publics qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/about",
  "/features",
  "/pricing",
  "/contact",
  "/terms",
  "/privacy",
  "/faq",
];

// Extensions de fichiers à ignorer (ressources statiques)
const IGNORE_EXTENSIONS = [
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".css",
  ".js",
  ".json",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
];

// Regex pour les chemins d'API (souvent gérés par leur propre logique d'auth)
const API_REGEX = /^\/api\//;

/**
 * Vérifie si un chemin est public
 */
function isPublicPath(pathname: string): boolean {
  // Vérifier si le chemin est explicitement public
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  // Ignorer les extensions de fichiers de ressources statiques
  if (IGNORE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return true;
  }

  // Ignorer les chemins d'API qui ont leur propre logique d'authentification
  if (API_REGEX.test(pathname)) {
    return true;
  }

  // Sections du site publiques (début de chemin)
  if (pathname.startsWith("/_next") || 
      pathname.startsWith("/images") ||
      pathname.startsWith("/fonts") ||
      pathname.startsWith("/favicon")) {
    return true;
  }

  return false;
}

/**
 * Middleware principal pour protéger les routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorer les chemins publics
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Vérifier la présence d'un cookie d'authentification
//   const authCookie = request.cookies.get("better_auth.session-token");
  
  // Si aucun cookie d'authentification n'est trouvé, rediriger vers la page de connexion
//   if (!authCookie) {
//     const loginUrl = new URL(siteConfig.auth.loginPath, request.url);
    
//     // Ajouter le callbackUrl pour rediriger après connexion
//     loginUrl.searchParams.set("callbackUrl", pathname);
    
//     return NextResponse.redirect(loginUrl);
//   }

  // L'utilisateur est authentifié, permettre l'accès
  return NextResponse.next();
}

/**
 * Configuration des chemins sur lesquels le middleware doit s'exécuter
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /_next (static files)
     * 2. /_vercel (deployment platform)
     * 3. /favicon.ico, /fonts, /images (static resources)
     */
    "/((?!_next|_vercel|favicon.ico|fonts|images).*)",
  ],
};
