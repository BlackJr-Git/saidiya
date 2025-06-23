import { Metadata } from "next";
import FAQSection from "@/components/website/faq/FAQSection";

export const metadata: Metadata = {
  title: "FAQ - Saidiya",
  description: "Questions fréquemment posées sur notre plateforme de financement participatif.",
};

export default function FAQPage() {
  return <FAQSection />;
}
