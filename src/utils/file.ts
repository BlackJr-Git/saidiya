/**
 * Utilitaires pour la gestion des fichiers
 */

/**
 * Convertit un fichier en string base64
 * @param file Fichier à convertir
 * @returns Promise avec la string base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extraire uniquement la partie base64 (après "data:image/xxx;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Échec de conversion en base64'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Convertit un fichier en URL pour prévisualisation 
 * (à utiliser pour l'affichage temporaire uniquement)
 * @param file Fichier à convertir
 * @returns URL de prévisualisation
 */
export const fileToPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Convertit une string base64 en source utilisable dans une balise img
 * @param base64String String base64 (sans le préfixe data:image)
 * @param mimeType Type MIME de l'image (par défaut 'image/jpeg')
 * @returns Source complète pour l'attribut src d'une balise img
 */
export const base64ToImgSrc = (base64String: string, mimeType: string = 'image/jpeg'): string => {
  // Vérifier si la string contient déjà le préfixe data:image
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  
  // Ajouter le préfixe data:image avec le type MIME approprié
  return `data:${mimeType};base64,${base64String}`;
};
