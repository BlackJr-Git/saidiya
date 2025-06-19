"use client";

// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CampagneCreateForm } from "@/features/campagne/components/campagne-create-form";
// import { ChevronRight, Home } from "lucide-react";

export default function CreateCampagnePage() {
  return (
    <div className="container py-6 md:py-10 mx-auto">
      {/* Fil d'Ariane */}
      {/* <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/campagnes">
              Campagnes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Créer une campagne
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
       */}
      <div className="mb-8 flex items-center flex-col">
        <h1 className="text-4xl font-bold mb-2">Créer une campagne</h1>
        <p className="text-muted-foreground">
          Suivez les étapes pour créer votre campagne de financement participatif.
        </p>
      </div>
      
      <CampagneCreateForm />
      
      <div className="mt-10 text-center text-sm text-muted-foreground">
        <p>Besoin d&apos;aide pour démarrer votre campagne ? Consultez notre <a href="#" className="text-primary underline">guide de création</a> ou <a href="#" className="text-primary underline">contactez-nous</a>.</p>
      </div>
    </div>
  );
}
