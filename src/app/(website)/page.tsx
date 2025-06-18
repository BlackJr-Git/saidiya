import HeroSection from "@/components/website/home/hero-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <HeroSection />
      </main>
    </div>
  );
}
