import HeroSection from "@/components/website/home/hero-section";
import FeaturedCampagnes from "@/components/website/home/featured-campagnes";
import HowItWorks from "@/components/website/home/how-it-works";
import Testimonials from "@/components/website/home/testimonials";
import StatsSection from "@/components/website/home/stats-section";
import FAQSection from "@/components/website/home/faq-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturedCampagnes />
        <StatsSection />
        <Testimonials />
        <FAQSection />
      </main>
    </div>
  );
}
