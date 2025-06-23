"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    content: "Grâce à cette plateforme, j'ai pu financer mon projet d'école communautaire en seulement 3 semaines. L'interface est intuitive et les outils de partage sont très efficaces.",
    author: "Marie Kabongo",
    role: "Fondatrice de l'École des Savoirs",
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    id: 2,
    content: "J'ai soutenu plusieurs projets sur cette plateforme et j'ai toujours été impressionné par la transparence et le suivi. On se sent vraiment impliqué dans les projets qu'on finance.",
    author: "Thomas Mutombo",
    role: "Contributeur régulier",
    avatar: "/images/avatars/avatar-2.jpg",
  },
  {
    id: 3,
    content: "Notre startup a pu lever les fonds nécessaires pour lancer notre application mobile. Le support technique a été exceptionnel tout au long du processus.",
    author: "Sarah Lukusa",
    role: "CEO de TechInnovate",
    avatar: "/images/avatars/avatar-3.jpg",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ce qu&apos;ils disent de nous</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les expériences de nos utilisateurs qui ont réussi à financer leurs projets ou qui ont contribué à des initiatives inspirantes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-muted/30 rounded-2xl p-8 md:p-12 shadow-sm border border-border">
            <Quote className="absolute text-primary/10 w-24 h-24 -top-6 -left-6" />
            
            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={cn(
                    "transition-opacity duration-300",
                    activeIndex === index ? "opacity-100" : "opacity-0 absolute top-0 left-0"
                  )}
                >
                  <blockquote className="text-lg md:text-xl italic mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation des témoignages */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  activeIndex === index 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Voir le témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
