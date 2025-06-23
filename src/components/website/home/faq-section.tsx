"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "Comment créer une campagne de financement ?",
    answer: "Pour créer une campagne, inscrivez-vous ou connectez-vous à votre compte, puis cliquez sur le bouton 'Créer une campagne'. Remplissez le formulaire avec les détails de votre projet, ajoutez une image attrayante et définissez votre objectif de financement."
  },
  {
    question: "Quels types de projets peuvent être financés ?",
    answer: "Notre plateforme accepte une grande variété de projets dans des domaines comme l'éducation, la santé, l'environnement, la culture, la technologie, et bien d'autres. Tous les projets doivent respecter nos conditions d'utilisation et avoir un impact positif."
  },
  {
    question: "Comment sont versés les fonds collectés ?",
    answer: "Une fois votre campagne terminée avec succès, les fonds sont transférés sur votre compte bancaire dans un délai de 5 à 7 jours ouvrables. Nous prélevons une commission de 5% sur le montant total collecté pour assurer le fonctionnement de la plateforme."
  },
  {
    question: "Que se passe-t-il si ma campagne n'atteint pas son objectif ?",
    answer: "Nous fonctionnons selon le modèle 'tout ou rien'. Si votre campagne n'atteint pas son objectif, les contributeurs sont remboursés intégralement et aucuns frais ne sont prélevés."
  },
  {
    question: "Comment puis-je promouvoir ma campagne ?",
    answer: "Nous vous recommandons de partager votre campagne sur les réseaux sociaux, d'envoyer des emails à vos contacts, d'organiser des événements de lancement et d'utiliser notre guide de promotion disponible dans votre tableau de bord."
  }
];

export function FAQSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Questions fréquentes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vous avez des questions sur notre plateforme ? Consultez nos réponses aux questions les plus fréquemment posées.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-10 text-center">
            <p className="mb-4 text-muted-foreground">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <Button asChild>
              <Link href="/contact">Contactez-nous</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
