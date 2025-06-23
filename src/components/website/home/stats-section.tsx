"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Award, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  iconColor: string;
  delay: number;
}

function StatItem({ icon: Icon, value, label, color, iconColor, delay }: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="flex flex-col items-center p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", color)}>
        <Icon className={cn("w-8 h-8", iconColor)} />
      </div>
      <div className={cn(
        "text-3xl md:text-4xl font-bold transition-all duration-1000",
        isVisible ? "opacity-100 transform-none" : "opacity-0 -translate-y-4"
      )}>
        {value}
      </div>
      <div className="text-muted-foreground mt-2 text-center">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Notre impact en chiffres</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment notre plateforme aide à concrétiser des projets et à créer un impact positif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatItem 
            icon={TrendingUp}
            value="5.2M€"
            label="Fonds collectés au total"
            color="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
            delay={100}
          />
          
          <StatItem 
            icon={Award}
            value="234"
            label="Projets financés avec succès"
            color="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
            delay={300}
          />
          
          <StatItem 
            icon={Users}
            value="15K+"
            label="Contributeurs actifs"
            color="bg-amber-100 dark:bg-amber-900/20"
            iconColor="text-amber-600 dark:text-amber-400"
            delay={500}
          />
          
          <StatItem 
            icon={Calendar}
            value="4 ans"
            label="D'expérience dans le crowdfunding"
            color="bg-purple-100 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
            delay={700}
          />
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
