import { Metadata } from "next";
import AboutSection from "@/components/website/about/AboutSection";

export const metadata: Metadata = {
  title: "À propos - Saidiya",
  description: "Découvrez notre histoire, notre mission et nos valeurs.",
};

export default function AboutPage() {
  return <AboutSection />;
}
