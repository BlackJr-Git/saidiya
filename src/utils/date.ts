/**
 * Utilitaires pour le formatage des dates
 */

/**
 * Formate une date pour l'affichage
 * @param date Date à formater (Date ou string)
 * @returns Date formatée en string (JJ/MM/AAAA)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  // Format français JJ/MM/AAAA
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formate une date avec l'heure pour l'affichage
 * @param date Date à formater (Date ou string)
 * @returns Date et heure formatées en string (JJ/MM/AAAA HH:MM)
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(d.getTime())) {
    return 'Date invalide';
  }
  
  // Format français JJ/MM/AAAA HH:MM
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
