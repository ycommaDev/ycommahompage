export type CmsPanelKey = "navigation" | "design" | "footer" | SiteSectionKey;

export type SiteSectionKey =
  | "hero"
  | "solutions"
  | "products"
  | "metrics"
  | "caseStudy"
  | "partners"
  | "about"
  | "contact"
  | "news"
  | "content";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface NavigationSection {
  items: NavigationItem[];
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteTheme {
  pageBackground: string;
  pageBackgroundAccent: string;
  pageBackgroundAccentSecondary: string;
  headerBackground: string;
  sectionBackgroundHero: string;
  sectionBackgroundSolutions: string;
  sectionBackgroundProducts: string;
  sectionBackgroundMetrics: string;
  sectionBackgroundCaseStudy: string;
  sectionBackgroundPartners: string;
  sectionBackgroundAbout: string;
  sectionBackgroundContact: string;
  cardBackground: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  accentFrom: string;
  accentTo: string;
  titleGradientFrom: string;
  titleGradientTo: string;
  logoGradientFrom: string;
  logoGradientTo: string;
  secondaryButtonBackground: string;
  secondaryButtonBorder: string;
}

export interface HeroSection {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  slides: Array<{
    id: string;
    buttonLabel: string;
    mediaType: "image" | "video";
    src: string;
    alt: string;
    poster?: string;
  }>;
}

export interface SolutionsSection {
  title: string;
  description: string;
  teamIntro: string;
  highlights: Array<{
    label: string;
    value: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
}

export interface ProductsSection {
  title: string;
  description: string;
  platforms: Array<{
    name: string;
    summary: string;
    highlights: string[];
    imageSrc: string;
    imageAlt: string;
  }>;
}

export interface MetricsSection {
  title: string;
  description: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export interface CaseStudySection {
  title: string;
  description: string;
  stories: Array<{
    brand: string;
    growth: string;
    note: string;
  }>;
}

export interface PartnersSection {
  title: string;
  description: string;
  milestones: Array<{
    label: string;
    title: string;
    detail: string;
  }>;
}

export interface AboutSection {
  title: string;
  description: string;
  services: Array<{
    name: string;
    summary: string;
    images: Array<{
      src: string;
      alt: string;
    }>;
  }>;
}

export interface ContactSection {
  title: string;
  description: string;
  inquiryOptions: string[];
  formCtaLabel: string;
  formCtaHref: string;
  footer: {
    ceo: string;
    address: string;
    email: string;
    phone: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

export interface NewsSection {
  title: string;
  description: string;
  items: Array<{
    title: string;
    summary: string;
    source: string;
    date: string;
    imageSrc: string;
    imageAlt: string;
    href: string;
  }>;
}

export interface ContentSection {
  items: Array<{
    title: string;
    imageSrc: string;
  }>;
}

export interface SiteContent {
  theme: SiteTheme;
  navigation: NavigationSection;
  hero: HeroSection;
  solutions: SolutionsSection;
  products: ProductsSection;
  metrics: MetricsSection;
  caseStudy: CaseStudySection;
  partners: PartnersSection;
  about: AboutSection;
  contact: ContactSection;
  news: NewsSection;
  content: ContentSection;
}

export const sectionLabels: Record<SiteSectionKey, string> = {
  hero: "HOME",
  solutions: "WHO WE ARE",
  products: "OUR PLATFORM",
  metrics: "Platform Metrics",
  caseStudy: "Success Stories",
  partners: "Milestones",
  about: "OUR SERVICES",
  contact: "CONTACT",
  news: "NEWS CONTENTS",
  content: "CONTENT",
};

export const cmsPanelLabels: Record<CmsPanelKey, string> = {
  navigation: "Navigation",
  design: "Design",
  footer: "Footer",
  ...sectionLabels,
};
