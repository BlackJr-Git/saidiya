import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Saidiya | Plateforme de Financement Participatif",
  description:
    "Une plateforme innovante de financement participatif pour soutenir des projets impactants et créer du changement ensemble.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Saidiya | Financement Participatif",
    description:
      "Découvrez Saidiya, la plateforme de crowdfunding qui connecte les porteurs de projets avec des investisseurs passionnés pour réaliser des initiatives inspirantes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saidiya | Financement Participatif",
    description:
      "Découvrez Saidiya, la plateforme de crowdfunding qui connecte les porteurs de projets avec des investisseurs passionnés pour réaliser des initiatives inspirantes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
