import { initialSiteContent } from "@/data/site-content";
import type { SiteContent } from "@/types/site-content";

export const SITE_CONTENT_STORAGE_KEY = "ycomma-site-content";

export function loadStoredSiteContent(): SiteContent {
  if (typeof window === "undefined") {
    return initialSiteContent;
  }

  const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
  if (!raw) {
    return initialSiteContent;
  }

  try {
    return normalizeSiteContent(JSON.parse(raw));
  } catch {
    return initialSiteContent;
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SITE_CONTENT_STORAGE_KEY,
    JSON.stringify(content),
  );
}

function normalizeSiteContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") {
    return initialSiteContent;
  }

  const parsed = raw as Partial<SiteContent> & {
    hero?: Partial<SiteContent["hero"]> & {
      imageSrc?: string;
      imageAlt?: string;
      slides?: Array<{
        id?: string;
        buttonLabel?: string;
        mediaType?: "image" | "video";
        src?: string;
        alt?: string;
        poster?: string;
        imageSrc?: string;
        imageAlt?: string;
      }>;
    };
    products?: Partial<SiteContent["products"]> & {
      platformName?: string;
      platformSummary?: string;
      highlights?: string[];
    };
  };

  const fallbackPlatform = initialSiteContent.products.platforms[0];
  const fallbackHeroSlide = initialSiteContent.hero.slides[0];
  const parsedHeroSlides = Array.isArray((parsed.hero as { slides?: unknown[] } | undefined)?.slides)
    ? ((parsed.hero as {
        slides?: Array<{
          id?: string;
          buttonLabel?: string;
          mediaType?: "image" | "video";
          src?: string;
          alt?: string;
          poster?: string;
          imageSrc?: string;
          imageAlt?: string;
        }>;
      }).slides ?? null)
    : null;
  const heroSlides =
    parsedHeroSlides && parsedHeroSlides.length > 0
      ? parsedHeroSlides.map((slide, index) => ({
          id: slide?.id || `hero-slide-${index + 1}`,
          buttonLabel: slide?.buttonLabel || `Slide ${index + 1}`,
          mediaType: slide?.mediaType || "image",
          src: normalizeAssetPath(slide?.src || slide?.imageSrc || fallbackHeroSlide.src),
          alt: slide?.alt || slide?.imageAlt || `${slide?.buttonLabel || "Hero"} media`,
          poster: slide?.poster,
        }))
      : [
          {
            id: fallbackHeroSlide.id,
            buttonLabel: fallbackHeroSlide.buttonLabel,
            mediaType: fallbackHeroSlide.mediaType,
            src: parsed.hero?.imageSrc || fallbackHeroSlide.src,
            alt: parsed.hero?.imageAlt || fallbackHeroSlide.alt,
            poster: fallbackHeroSlide.poster,
          },
        ];
  const parsedPlatforms = Array.isArray(parsed.products?.platforms)
    ? parsed.products?.platforms
    : null;

  const platforms =
    parsedPlatforms && parsedPlatforms.length > 0
      ? parsedPlatforms.map((platform, index) => ({
          name: platform?.name || `Platform ${index + 1}`,
          summary: platform?.summary || "",
          highlights: Array.isArray(platform?.highlights)
            ? platform.highlights.filter(Boolean)
            : [],
          href:
            typeof platform?.href === "string"
              ? platform.href
              : fallbackPlatform.href,
          imageSrc: normalizeAssetPath(platform?.imageSrc || fallbackPlatform.imageSrc),
          imageAlt: platform?.imageAlt || `${platform?.name || "Platform"} image`,
        }))
      : [
          {
            name: parsed.products?.platformName || fallbackPlatform.name,
            summary: parsed.products?.platformSummary || fallbackPlatform.summary,
            highlights: Array.isArray(parsed.products?.highlights)
              ? parsed.products.highlights.filter(Boolean)
              : fallbackPlatform.highlights,
            href: fallbackPlatform.href,
            imageSrc: normalizeAssetPath(fallbackPlatform.imageSrc),
            imageAlt: fallbackPlatform.imageAlt,
          },
        ];
  const footerLinks = Array.isArray(parsed.contact?.footer?.links)
    ? parsed.contact.footer.links
        .map((link) => {
          if (typeof link === "string") {
            return { label: link, href: "#" };
          }

          if (link && typeof link === "object") {
            const item = link as { label?: string; href?: string };
            const normalizedLabel = item.label || "Footer Link";
            const normalizedHref = item.href || "#";
            return {
              label: normalizedLabel,
              href:
                /instagram/i.test(normalizedLabel) && normalizedHref === "#"
                  ? "https://www.instagram.com/drrip.official"
                  : /입점|seller|drrip/i.test(normalizedLabel) && normalizedHref === "#"
                    ? "https://seller.drrip.co.kr"
                    : normalizedHref,
            };
          }

          return null;
        })
        .filter((link): link is { label: string; href: string } => Boolean(link))
    : initialSiteContent.contact.footer.links;
  const newsItems = Array.isArray(parsed.news?.items)
    ? parsed.news.items.map((item, index) => ({
        title: item?.title || `News ${index + 1}`,
        summary: item?.summary || "",
        source: item?.source || "YCOMMA",
        date: item?.date || "",
        imageSrc: normalizeAssetPath(item?.imageSrc || "/images/news/news-cover-1.svg"),
        imageAlt: item?.imageAlt || `${item?.title || "News"} image`,
        href: item?.href || "#",
      }))
    : initialSiteContent.news.items;
  const contentItems = Array.isArray(parsed.content?.items)
    ? parsed.content.items.map((item, index) => ({
        title: item?.title || `Content ${index + 1}`,
        imageSrc: normalizeAssetPath(
          item?.imageSrc || initialSiteContent.content.items[0]?.imageSrc || "/images/content/content-1.svg",
        ),
      }))
    : initialSiteContent.content.items;

  return {
    ...initialSiteContent,
    ...parsed,
    theme: {
      ...initialSiteContent.theme,
      ...parsed.theme,
    },
    navigation: {
      ...initialSiteContent.navigation,
      ...parsed.navigation,
      items: Array.isArray(parsed.navigation?.items)
        ? parsed.navigation.items
        : initialSiteContent.navigation.items,
    },
    hero: {
      ...initialSiteContent.hero,
      ...parsed.hero,
      primaryCtaHref: parsed.hero?.primaryCtaHref || initialSiteContent.hero.primaryCtaHref,
      secondaryCtaHref: parsed.hero?.secondaryCtaHref || initialSiteContent.hero.secondaryCtaHref,
      slides: heroSlides,
    },
    solutions: {
      ...initialSiteContent.solutions,
      ...parsed.solutions,
      highlights: Array.isArray(parsed.solutions?.highlights)
        ? parsed.solutions.highlights
        : initialSiteContent.solutions.highlights,
      values: Array.isArray(parsed.solutions?.values)
        ? parsed.solutions.values
        : initialSiteContent.solutions.values,
    },
    products: {
      ...initialSiteContent.products,
      ...parsed.products,
      platforms,
    },
    metrics: {
      ...initialSiteContent.metrics,
      ...parsed.metrics,
      items: Array.isArray(parsed.metrics?.items)
        ? parsed.metrics.items
        : initialSiteContent.metrics.items,
    },
    caseStudy: {
      ...initialSiteContent.caseStudy,
      ...parsed.caseStudy,
      stories: Array.isArray(parsed.caseStudy?.stories)
        ? parsed.caseStudy.stories
        : initialSiteContent.caseStudy.stories,
    },
    partners: {
      ...initialSiteContent.partners,
      ...parsed.partners,
      milestones: Array.isArray(parsed.partners?.milestones)
        ? parsed.partners.milestones
        : initialSiteContent.partners.milestones,
      history: Array.isArray(parsed.partners?.history)
        ? parsed.partners.history
        : initialSiteContent.partners.history,
    },
    about: {
      ...initialSiteContent.about,
      ...parsed.about,
      services: Array.isArray(parsed.about?.services)
        ? parsed.about.services.map((service, index) => ({
            ...initialSiteContent.about.services[index % initialSiteContent.about.services.length],
            ...service,
            href:
              typeof service?.href === "string"
                ? service.href
                : initialSiteContent.about.services[index % initialSiteContent.about.services.length]?.href ?? "#",
            images: Array.isArray(service?.images)
              ? service.images.filter(Boolean).map((image) => ({
                  ...image,
                  src: normalizeAssetPath(image.src),
                }))
              : initialSiteContent.about.services[index % initialSiteContent.about.services.length]?.images ?? [],
          }))
        : initialSiteContent.about.services,
    },
    contact: {
      ...initialSiteContent.contact,
      ...parsed.contact,
      inquiryOptions: Array.isArray(parsed.contact?.inquiryOptions)
        ? parsed.contact.inquiryOptions
        : initialSiteContent.contact.inquiryOptions,
      formCtaLabel: parsed.contact?.formCtaLabel || initialSiteContent.contact.formCtaLabel,
      formCtaHref: parsed.contact?.formCtaHref || initialSiteContent.contact.formCtaHref,
      footer: {
        ...initialSiteContent.contact.footer,
        ...parsed.contact?.footer,
        links: footerLinks,
      },
    },
    news: {
      ...initialSiteContent.news,
      ...parsed.news,
      items: newsItems,
    },
    content: {
      ...initialSiteContent.content,
      ...parsed.content,
      items: contentItems,
    },
  };
}

function normalizeAssetPath(path: string) {
  switch (path) {
    case "/images/hero-visual.svg":
    case "/images/my-hero.gif":
      return "/images/hero/hero-visual.svg";
    case "/images/hero-commerce.svg":
      return "/images/hero/hero-commerce.svg";
    case "/images/hero-growth.svg":
      return "/images/hero/hero-growth.svg";
    case "/images/service-marketing-1.svg":
      return "/images/services/service-marketing-1.svg";
    case "/images/service-marketing-2.svg":
      return "/images/services/service-marketing-2.svg";
    case "/images/service-development-1.svg":
      return "/images/services/service-development-1.svg";
    case "/images/service-development-2.svg":
      return "/images/services/service-development-2.svg";
    case "/images/service-deck-1.svg":
      return "/images/services/service-deck-1.svg";
    case "/images/service-deck-2.svg":
      return "/images/services/service-deck-2.svg";
    case "/images/content-1.svg":
      return "/images/content/content-1.svg";
    case "/images/content-2.svg":
      return "/images/content/content-2.svg";
    default:
      return path;
  }
}
