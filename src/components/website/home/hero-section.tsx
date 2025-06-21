import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import Image from "next/image";
import Link from "next/link";

/**
 * HeroSection - Section principale de la page d'accueil
 * Présente le titre, sous-titre, CTA et éléments visuels principaux
 */
export function HeroSection() {
  return (
    <section className="relative w-full min-h-[75vh] bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Disposition en grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Élément visuel latéral gauche */}
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="bg-muted/50 border border-border rounded-lg p-2 shadow-md transform hover:scale-105 transition-transform duration-300">
              <Image 
                src="/images/mother-project.jpg" 
                alt="Projet financé" 
                width={300} 
                height={200}
                className="rounded-2xl w-full h-auto object-cover"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>

          {/* Contenu central */}
          <div className="lg:col-span-8 text-center flex flex-col items-center justify-center space-y-8">
            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {siteConfig.title.split(' - ')[0]}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
              {siteConfig.description}
            </p>

            {/* Bouton d'action (CTA) */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <Button size="lg" asChild>
                <Link href="/campagnes/create">Démarrer une campagne</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/campagnes">Voir les campagnes</Link>
              </Button>
            </div>

            {/* Image décorative sous le CTA */}
            <div className="relative mt-8 max-w-xs mx-auto">
              <div className="bg-background border border-border rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image 
                  src="/images/nature-project.jpg" 
                  alt="Projet financé" 
                  width={350} 
                  height={200}
                  className="rounded-md w-full h-auto object-cover"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </div>
          </div>

          {/* Élément visuel latéral droit */}
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="bg-muted/50 border border-border rounded-lg p-2 shadow-md transform hover:scale-105 transition-transform duration-300">
              <Image 
                src="/images/plant-project.jpg" 
                alt="Projet financé" 
                width={400} 
                height={300}
                className="rounded-md w-full h-auto object-cover"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* Cartes d'informations flottantes */}
        <div className="absolute left-[10%] top-[15%] opacity-90 hidden lg:block">
          <div className="bg-background border border-primary/20 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform -rotate-6 hover:-rotate-3 w-52">
            <div className="flex flex-col gap-2">
              <div className="text-primary text-sm font-semibold">STATISTIQUES</div>
              <div className="text-2xl font-bold">5.2M$</div>
              <div className="text-muted-foreground text-sm">Fonds collectés</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="text-[#10B981] font-medium">+24%</div>
                <div className="text-xs text-muted-foreground">ce mois</div>
              </div>
              <div className="w-full bg-muted/50 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">75% de l&apos;objectif annuel</div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-[10%] bottom-[20%] opacity-90 hidden lg:block">
          <div className="bg-background border border-accent/20 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform rotate-6 hover:rotate-3 w-52">
            <div className="flex flex-col gap-2">
              <div className="text-accent text-sm font-semibold">PROJETS FINANCÉS</div>
              <div className="text-2xl font-bold">234</div>
              <div className="text-muted-foreground text-sm">Campagnes réussies</div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-semibold">56</div>
                  <div className="text-xs text-muted-foreground">En cours</div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-semibold">15k</div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forme décorative */}
      {/* <div className="absolute -bottom-32 left-0 right-0 h-64 bg-primary/5 -skew-y-3 z-0"></div> */}
    </section>
  );
}

export default HeroSection;
