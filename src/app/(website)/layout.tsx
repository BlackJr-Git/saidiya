import FooterSection from "@/components/website/footer";
import Header from "@/components/website/header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <FooterSection />
    </div>
  );
}
