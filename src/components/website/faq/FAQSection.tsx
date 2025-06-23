"use client"

import { siteConfig } from "@/config";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

/**
 * FAQSection - Section principale de la page FAQ
 * Affiche une liste de questions fréquemment posées et leurs réponses
 */
export function FAQSection() {
  // Liste des questions et réponses
  const faqItems = [
    {
      question: "Comment puis-je créer une campagne de financement ?",
      answer: "Pour créer une campagne, inscrivez-vous ou connectez-vous à votre compte, puis cliquez sur le bouton \"Démarrer une campagne\" sur la page d'accueil. Suivez ensuite les instructions pour remplir les informations nécessaires, ajouter des photos et définir votre objectif de financement."
    },
    {
      question: "Quels sont les frais prélevés sur ma campagne ?",
      answer: "Nos frais de service sont de 5% du montant total collecté, auxquels s'ajoutent les frais de traitement des paiements (environ 3%). Ces frais nous permettent de maintenir la plateforme, d'assurer le support client et de développer de nouvelles fonctionnalités."
    },
    {
      question: "Quand vais-je recevoir les fonds collectés ?",
      answer: "Les fonds sont généralement versés dans les 7 jours ouvrables après la fin de votre campagne, à condition que l'objectif minimum ait été atteint. Si votre campagne est de type \"flexible\", vous recevrez les fonds même si l'objectif n'est pas atteint."
    },
    {
      question: "Puis-je modifier ma campagne après son lancement ?",
      answer: "Oui, vous pouvez modifier certains éléments de votre campagne après son lancement, comme la description, les photos ou les mises à jour. Cependant, l'objectif de financement et la durée de la campagne ne peuvent pas être modifiés une fois la campagne lancée."
    },
    {
      question: "Comment puis-je promouvoir ma campagne ?",
      answer: "Nous recommandons de partager votre campagne sur les réseaux sociaux, d'envoyer des emails à vos contacts, et d'utiliser votre réseau personnel et professionnel. Plus vous communiquez activement sur votre projet, plus vous avez de chances d'atteindre votre objectif. Nous proposons également des options de promotion sur notre plateforme pour augmenter la visibilité de votre campagne."
    },
    {
      question: "Que se passe-t-il si je n'atteins pas mon objectif de financement ?",
      answer: "Cela dépend du type de campagne que vous avez choisi. Pour les campagnes \"tout ou rien\", si vous n'atteignez pas votre objectif, les contributeurs sont remboursés et vous ne recevez pas les fonds. Pour les campagnes \"flexibles\", vous recevez tous les fonds collectés, même si l'objectif n'est pas atteint."
    },
    {
      question: "Comment les contributeurs peuvent-ils me contacter ?",
      answer: "Les contributeurs peuvent vous contacter via la section commentaires de votre campagne. Vous recevrez également des notifications par email lorsque quelqu'un commente ou pose une question sur votre campagne."
    },
    {
      question: "Puis-je lancer plusieurs campagnes simultanément ?",
      answer: "Oui, vous pouvez lancer plusieurs campagnes simultanément, mais nous recommandons de vous concentrer sur une seule campagne à la fois pour maximiser vos chances de succès et ne pas diviser votre audience."
    },
    {
      question: "Comment puis-je remercier mes contributeurs ?",
      answer: "Vous pouvez remercier vos contributeurs en publiant des mises à jour régulières sur votre campagne, en leur envoyant des messages personnalisés, et bien sûr en leur livrant les contreparties promises dans les délais prévus."
    },
    {
      question: "Que faire si j'ai des problèmes avec ma campagne ?",
      answer: `Notre équipe de support est là pour vous aider. Vous pouvez nous contacter à ${siteConfig.contact.email} ou via le formulaire de contact sur notre site. Nous répondons généralement dans les 24 heures ouvrables.`
    }
  ];

  return (
    <section className="relative w-full py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4">
            Questions fréquemment posées
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez des réponses aux questions les plus courantes sur notre plateforme de financement participatif.
          </p>
        </div>

        {/* Recherche de FAQ */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une question..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Liste des FAQ avec Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg overflow-hidden bg-background shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <AccordionTrigger className="px-4 py-4 text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Section de contact */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Vous n&apos;avez pas trouvé votre réponse ?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe est là pour vous aider avec toutes vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Contactez-nous
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Envoyez-nous un email
            </a>
          </div>
        </div>

        {/* Catégories de FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Parcourir par catégorie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Création de campagne", "Contributions", "Paiements", "Après la campagne", "Contreparties", "Compte utilisateur", "Sécurité", "Légal"].map((category, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-medium">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
