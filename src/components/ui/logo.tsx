import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { HTMLAttributes } from "react";

/**
 * Props du composant Logo
 */
interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  /** URL de redirection lors du clic sur le logo */
  href?: string;
  /** Afficher le texte du logo */
  showText?: boolean;
  /** Taille du logo */
  size?: "sm" | "md" | "lg";
  /** Texte à afficher comme titre */
  title?: string;
  /** Chemin de l'image du logo */
  imageSrc?: string;
  /** Texte alternatif pour l'image */
  imageAlt?: string;
  /** Classes CSS personnalisées pour l'image */
  imageClassName?: string;
  /** Classes CSS personnalisées pour le texte */
  textClassName?: string;
}

/**
 * Composant Logo
 * Affiche un logo avec une icône et optionnellement du texte
 */
export function Logo({
  href = "/",
  showText = true,
  size = "md",
  title = "Saidiya",
  imageSrc = "/images/logo-sa.png", // Chemin par défaut vers l'image du logo
  imageAlt = "Logo",
  className,
  imageClassName,
  textClassName,
  ...props
}: LogoProps) {
  // Définition des tailles
  const sizes = {
    sm: {
      image: { width: 20, height: 20 },
      text: "text-lg font-semibold",
      wrapper: "gap-1.5",
    },
    md: {
      image: { width: 24, height: 24 },
      text: "text-xl font-bold",
      wrapper: "gap-2",
    },
    lg: {
      image: { width: 32, height: 32 },
      text: "text-2xl font-bold",
      wrapper: "gap-3",
    },
  };

  // Contenu du logo
  const content = (
    <div
      className={cn("flex items-center", sizes[size].wrapper, className)}
      {...props}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={sizes[size].image.width}
        height={sizes[size].image.height}
        className={cn("shrink-0", imageClassName)}
      />
      {showText && (
        <span
          className={cn(
            "text-foreground transition-colors",
            sizes[size].text,
            textClassName
          )}
        >
          {title}
        </span>
      )}
    </div>
  );

  // Si un href est fourni, envelopper dans un Link
  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center outline-none focus:outline-none"
      >
        {content}
      </Link>
    );
  }

  // Sinon, retourner simplement le contenu
  return content;
}
