
"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

/**
 * ContactForm - Formulaire de contact
 * Permet aux utilisateurs d'envoyer un message via un formulaire
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire (à remplacer par une vraie API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setFormSubmitted(true);
  };

  if (formSubmitted) {
    return (
      <div className="bg-background border border-border rounded-lg p-8 shadow-md">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="text-2xl font-bold">Message envoyé!</h3>
          <p className="text-muted-foreground">
            Merci de nous avoir contacté. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setFormSubmitted(false)}
            className="mt-4"
          >
            Envoyer un autre message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background border border-border rounded-lg p-8 shadow-md">
      <h3 className="text-2xl font-bold">Envoyez-nous un message</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Votre nom"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Sujet
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Sujet de votre message"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          rows={5}
          required
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>
      
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>
    </form>
  );
}

export default ContactForm;
