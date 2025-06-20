import React from "react";
import Image from "next/image";
import { base64ToImgSrc } from "@/utils/file";

interface Base64ImageProps {
  base64String: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  mimeType?: string;
}

/**
 * Composant pour afficher une image à partir d'une string base64
 */
export function Base64Image({
  base64String,
  alt,
  width,
  height,
  className = "",
  mimeType = "image/jpeg",
}: Base64ImageProps) {
  // Si pas de base64, afficher un placeholder
  if (!base64String) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">Image non disponible</span>
      </div>
    );
  }

  // Convertir la string base64 en src pour l'image
  const imgSrc = base64ToImgSrc(base64String, mimeType);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

/**
 * Version simplifiée qui utilise une balise img native au lieu de next/image
 * Utile quand on ne connaît pas les dimensions à l'avance
 */
export function Base64Img({ 
  base64String, 
  alt, 
  className = "",
  mimeType = "image/jpeg" 
}: Omit<Base64ImageProps, "width" | "height"> & { className?: string }) {
  // Si pas de base64, afficher un placeholder
  if (!base64String) {
    return (
      <div className={`bg-muted flex items-center justify-center h-32 ${className}`}>
        <span className="text-muted-foreground text-sm">Image non disponible</span>
      </div>
    );
  }

  // Convertir la string base64 en src pour l'image
  const imgSrc = base64ToImgSrc(base64String, mimeType);
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
    />
  );
}
