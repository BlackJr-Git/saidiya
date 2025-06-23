"use client";

import { ArrowRight, Lightbulb, Users, Target, Award } from "lucide-react";
// import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Lightbulb,
    title: "Proposez votre idée",
    description: "Créez une campagne détaillée pour présenter votre projet et définir votre objectif de financement.",
    color: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    title: "Mobilisez votre communauté",
    description: "Partagez votre campagne sur les réseaux sociaux et invitez vos proches à vous soutenir.",
    color: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Target,
    title: "Atteignez votre objectif",
    description: "Suivez la progression de votre campagne et interagissez avec vos contributeurs.",
    color: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Award,
    title: "Réalisez votre projet",
    description: "Recevez les fonds et concrétisez votre projet en tenant vos contributeurs informés.",
    color: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Comment ça marche</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Notre plateforme vous accompagne à chaque étape de votre projet, de sa conception à sa réalisation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Ligne de connexion entre les étapes */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-20px)] w-[calc(100%-40px)] z-0">
                    <div className="h-0.5 w-full bg-muted-foreground/20 flex items-center justify-center">
                      <ArrowRight className="text-muted-foreground/40 bg-muted/30 p-1 box-content rounded-full" size={16} />
                    </div>
                  </div>
                )}
                
                {/* Carte d'étape */}
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative z-10">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-4", step.color)}>
                    <Icon className={cn("w-7 h-7", step.iconColor)} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
