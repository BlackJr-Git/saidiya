"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Member card component for the team section
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio }) => (
  <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md transition-all hover:shadow-lg">
    <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
      />
    </div>
    <h3 className="text-xl font-bold mb-1">{name}</h3>
    <p className="text-muted-foreground mb-3">{role}</p>
    <p className="text-sm">{bio}</p>
  </div>
);

// Value card component
interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon }) => (
  <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md">
    <div className="text-primary text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function AboutSection() {
  return (
    <div className="container py-16 space-y-24 mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">À propos de Saidiya</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Une plateforme innovante dédiée à la promotion et au financement de projets culturels africains.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src="/images/about/story.jpg"
            alt="Notre histoire"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Notre Histoire</h2>
          <p className="text-lg text-muted-foreground">
            Fondée en 2023, Saidiya est née d&apos;une passion commune pour l&apos;art et la culture africaine. Nos fondateurs, ayant constaté le manque de visibilité et de financement pour les projets culturels africains, ont décidé de créer une plateforme qui comblerait ce vide.
          </p>
          <p className="text-lg text-muted-foreground">
            Le nom &quot;Saidiya&quot; vient du swahili et signifie &quot;aider&quot; ou &quot;assister&quot;, ce qui reflète parfaitement notre mission d&apos;accompagner les artistes et porteurs de projets culturels dans leur développement.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 space-y-4">
          <h2 className="text-3xl font-bold">Notre Mission</h2>
          <p className="text-lg text-muted-foreground">
            Saidiya a pour mission de démocratiser l&apos;accès au financement pour les projets culturels africains, tout en leur offrant une visibilité internationale.
          </p>
          <p className="text-lg text-muted-foreground">
            Nous croyons fermement que l&apos;art et la culture sont des vecteurs essentiels de développement économique et social, et nous nous engageons à soutenir les initiatives qui valorisent le patrimoine culturel africain.
          </p>
          <div className="pt-4">
            <Button size="lg" variant="outline" className="mr-4">
              Nos projets
            </Button>
            <Button size="lg">
              Nous contacter
            </Button>
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl order-1 md:order-2">
          <Image
            src="/images/about/mission.jpg"
            alt="Notre mission"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Nos Valeurs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos valeurs fondamentales guident chacune de nos actions et décisions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            title="Transparence"
            description="Nous nous engageons à maintenir une communication claire et honnête avec nos utilisateurs et nos partenaires."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            }
          />
          <ValueCard
            title="Innovation"
            description="Nous explorons constamment de nouvelles façons de soutenir et de promouvoir les projets culturels africains."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            }
          />
          <ValueCard
            title="Communauté"
            description="Nous valorisons la diversité et la collaboration, créant un espace où chacun peut contribuer et bénéficier des échanges culturels."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Notre Équipe</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rencontrez les personnes passionnées qui travaillent chaque jour pour faire de Saidiya une plateforme de référence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TeamMember
            name="Aminata Diallo"
            role="Fondatrice &amp; CEO"
            image="/images/team/team-1.jpg"
            bio="Passionnée d&#39;art contemporain africain, Aminata a travaillé pendant 10 ans dans le secteur culturel avant de fonder Saidiya."
          />
          <TeamMember
            name="Jean Kouassi"
            role="Directeur Technique"
            image="/images/team/team-2.jpg"
            bio="Ingénieur en informatique, Jean a développé plusieurs plateformes innovantes avant de rejoindre l&#39;aventure Saidiya."
          />
          <TeamMember
            name="Fatou Sy"
            role="Responsable Marketing"
            image="/images/team/team-3.jpg"
            bio="Avec une expérience dans les plus grandes agences de communication, Fatou met son expertise au service de la visibilité de nos projets."
          />
        </div>
      </div>

      {/* Partnerships Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Nos Partenaires</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous collaborons avec des organisations qui partagent notre vision et soutiennent notre mission.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 justify-center items-center opacity-75">
          {/* Placeholder for partner logos */}
          <div className="h-12 w-36 bg-muted rounded-md"></div>
          <div className="h-12 w-36 bg-muted rounded-md"></div>
          <div className="h-12 w-36 bg-muted rounded-md"></div>
          <div className="h-12 w-36 bg-muted rounded-md"></div>
          <div className="h-12 w-36 bg-muted rounded-md"></div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 p-8 md:p-12 rounded-xl text-center space-y-6">
        <h2 className="text-3xl font-bold">Rejoignez l&#39;aventure Saidiya</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez un artiste à la recherche de financement, un passionné d&#39;art africain ou simplement curieux, il y a une place pour vous dans notre communauté.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" variant="default">
            Créer un compte
          </Button>
          <Button size="lg" variant="outline">
            Explorer les projets
          </Button>
        </div>
      </div>
    </div>
  );
}
