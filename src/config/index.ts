/**
 * Project Configuration
 * Contains all the configuration settings for the application
 */

export const siteConfig = {
  // Basic site information
  name: "Saidiya",
  title: "Saidiya - Plateforme de Financement Participatif",
  description:
    "Une plateforme innovante de financement participatif pour soutenir des projets impactants et créer du changement ensemble.",
  url: "https://saidiya.com",

  // Branding and visuals
  logo: {
    main: "/images/logo.svg",
    light: "/images/logo-light.svg",
    dark: "/images/logo-dark.svg",
    favicon: "/favicon.ico",
  },

  // Contact information
  contact: {
    email: "contact@saidiya.com",
    phone: "+1 (123) 456-7890",
    address: "123 Heritage Lane, Cultural District, CA 94123",
  },

  // Social media links
  social: {
    facebook: "https://facebook.com/saidiya",
    instagram: "https://instagram.com/saidiya",
    linkedin: "https://linkedin.com/company/saidiya",
    tiktok: "https://tiktok.com/@saidiya",
    youtube: "https://youtube.com/saidiya",
    x: "https://x.com/saidiya",
    whatsapp: "https://whatsapp.com/saidiya",
    telegram: "https://telegram.org/saidiya",
    discord: "https://discord.com/saidiya",
    github: "https://github.com/saidiya",
    threads: "https://threads.net/saidiya",
  },

  // Authentication settings
  auth: {
    loginPath: "/login",
    signupPath: "/signup",
    forgotPasswordPath: "/forgot-password",
    // callbackUrl: "/dashboard",
    providers: ["credentials", "google", "facebook"],
  },

  // Navigation
  navigation: {
    main: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Features", path: "/features" },
      { name: "Pricing", path: "/pricing" },
      { name: "Contact", path: "/contact" },
    ],
    footer: [
      { name: "Privacy", path: "/privacy" },
      { name: "Terms", path: "/terms" },
      { name: "FAQ", path: "/faq" },
    ],
  },

  // Theme configuration
  theme: {
    colors: {
      primary: "#4F46E5",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827",
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
    },
  },

  // API endpoints
  api: {
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://api.saidiya.com"
        : "http://localhost:3001",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      profile: "/api/profile",
      heritage: "/api/heritage",
    },
  },

  // Feature flags
  features: {
    heritageMapping: true,
    familyTree: true,
    culturalInsights: true,
    dnaIntegration: false,
    communityForums: true,
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    enabledInDevelopment: false,
  },
};

export default siteConfig;
