import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import { siteConfig } from "@/config";

/**
 * ContactSection - Section principale de la page de contact
 * Combine le formulaire de contact et les informations de contact
 */
export function ContactSection() {
  return (
    <section className="relative w-full py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vous avez des questions ou besoin d&apos;informations supplémentaires ? 
            Notre équipe est là pour vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ContactForm />
          <ContactInfo />
        </div>

        {/* Carte Google Maps */}
        <div className="mt-16 rounded-lg overflow-hidden border border-border shadow-md">
          <div className="aspect-[16/9] w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.95410694165!2d2.2646349499999997!3d48.8589713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1687523939200!5m2!1sfr!2sfr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Comment puis-je créer une campagne ?</h3>
              <p className="text-muted-foreground">
                Pour créer une campagne, inscrivez-vous ou connectez-vous à votre compte, 
                puis cliquez sur &quot;Démarrer une campagne&quot; et suivez les instructions.
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Comment fonctionne le financement ?</h3>
              <p className="text-muted-foreground">
                Nous utilisons un modèle de financement flexible où vous recevez les fonds 
                collectés même si l&apos;objectif n&apos;est pas atteint, moins les frais de service.
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Quels sont les frais de service ?</h3>
              <p className="text-muted-foreground">
                Nos frais de service sont de 5% du montant collecté, plus les frais de 
                traitement des paiements (environ 3%).
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Comment puis-je contacter le support ?</h3>
              <p className="text-muted-foreground">
                Vous pouvez nous contacter via le formulaire sur cette page ou en envoyant 
                un email directement à {siteConfig.contact.email}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
