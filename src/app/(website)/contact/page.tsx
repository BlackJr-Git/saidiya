import { Metadata } from "next";
import ContactSection from "@/components/website/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact - Saidiya",
  description: "Contactez notre équipe pour toute question ou information supplémentaire.",
};

export default function ContactPage() {
  return <ContactSection />;
}
