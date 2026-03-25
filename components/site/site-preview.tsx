"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { SiteContent } from "@/types/site-content";
import Image from "next/image";

interface SitePreviewProps {
  content: SiteContent;
}

export function SitePreview({ content }: SitePreviewProps) {
  const theme = content.theme;
  const heroSlides: SiteContent["hero"]["slides"] = content.hero.slides.length > 0 ? content.hero.slides : [{
    id: "hero-fallback",
    buttonLabel: "Slide 1",
    mediaType: "image",
    src: "/images/hero/hero-visual.svg",
    alt: "Hero fallback image",
  }];
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const heroVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const newsCarouselRef = useRef<HTMLDivElement | null>(null);
  const contentCarouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollNewsLeft, setCanScrollNewsLeft] = useState(false);
  const [canScrollNewsRight, setCanScrollNewsRight] = useState(false);
  const [canScrollContentLeft, setCanScrollContentLeft] = useState(false);
  const [canScrollContentRight, setCanScrollContentRight] = useState(false);

  useEffect(() => {
    if (activeHeroSlide > heroSlides.length - 1) {
      setActiveHeroSlide(0);
    }
  }, [activeHeroSlide, heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    if (isRenderableVideo(heroSlides[activeHeroSlide])) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeHeroSlide, heroSlides]);

  useEffect(() => {
    heroSlides.forEach((slide, index) => {
      const video = heroVideoRefs.current[slide.id];

      if (!video) {
        return;
      }

      if (index !== activeHeroSlide) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      if (!isRenderableVideo(slide)) {
        return;
      }

      void video.play().catch(() => {
        // Ignore autoplay errors in preview environments.
      });
    });
  }, [activeHeroSlide, heroSlides]);
  const metricGroups = chunkItems(content.metrics.items, 4);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const instagramLink =
    content.contact.footer.links.find((link) => /instagram/i.test(link.label)) ?? {
      label: "Instagram",
      href: "https://www.instagram.com/drrip.official",
    };
  const sellerLink =
    content.contact.footer.links.find((link) => /입점|seller|drrip/i.test(`${link.label} ${link.href}`)) ?? {
      label: "drrip 입점 신청",
      href: "https://seller.drrip.co.kr",
    };
  const footerQuickLinks = [instagramLink, sellerLink].filter(
    (link, index, links) =>
      links.findIndex(
        (item) => item.label === link.label && item.href === link.href,
      ) === index,
  );
  const contactTitle = withFallback(content.contact.title, "Contact Us");
  const contactDescription = withFallback(
    content.contact.description,
    "와이콤마와 drrip 관련 문의는 아래 채널로 바로 연결하실 수 있습니다.",
  );
  const footerCeo = withFallback(content.contact.footer.ceo, "김현중");
  const footerAddress = withFallback(
    content.contact.footer.address,
    "서울창업허브 공덕 별관 418호",
  );
  const footerEmail = withFallback(content.contact.footer.email, "contact@ycomma.com");
  const footerPhone = withFallback(content.contact.footer.phone, "070-9000-7824");

  useEffect(() => {
    if (activeServiceIndex > content.about.services.length - 1) {
      setActiveServiceIndex(0);
    }
  }, [activeServiceIndex, content.about.services.length]);

  useEffect(() => {
    updateCarouselState(newsCarouselRef.current, setCanScrollNewsLeft, setCanScrollNewsRight);
  }, [content.news.items.length]);

  useEffect(() => {
    updateCarouselState(
      contentCarouselRef.current,
      setCanScrollContentLeft,
      setCanScrollContentRight,
    );
  }, [content.content.items.length]);

  return (
    <div
      style={{
        background: `radial-gradient(circle at top left, ${toRgba(theme.pageBackgroundAccent, 0.16)}, transparent 24%), radial-gradient(circle at top right, ${toRgba(theme.pageBackgroundAccentSecondary, 0.14)}, transparent 30%), ${theme.pageBackground}`,
        color: theme.textPrimary,
      }}
    >
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{
          backgroundColor: toRgba(theme.headerBackground, 0.82),
          borderColor: toRgba(theme.cardBorder, 0.45),
        }}
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-6 py-4 sm:px-8">
          <a
            href="#home"
            className="text-lg font-extrabold tracking-[0.12em] text-white sm:text-xl"
          >
            YCOMMA
          </a>

          <nav className="hidden gap-5 text-sm lg:flex" style={{ color: theme.textMuted }}>
            {content.navigation.items.map((item) => (
              <a key={item.id} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={content.navigation.ctaHref}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{
              backgroundImage: `linear-gradient(90deg, ${theme.accentFrom}, ${theme.accentTo})`,
            }}
          >
            {content.navigation.ctaLabel}
          </a>
        </div>
      </header>

      <section
        id="home"
        className="px-6 pb-24 pt-12 sm:px-8 sm:pb-28 sm:pt-16"
        style={{ backgroundColor: theme.sectionBackgroundHero }}
      >
        <div className="mx-auto w-full max-w-[1220px]">
          <div className="relative mt-2 w-full overflow-hidden rounded-[24px] sm:rounded-[34px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
              <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap gap-2 sm:left-5 sm:right-5 sm:top-5">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveHeroSlide(index)}
                    className="rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition sm:text-sm"
                    style={{
                      borderColor: toRgba(theme.cardBorder, index === activeHeroSlide ? 0.7 : 0.45),
                      backgroundColor:
                        index === activeHeroSlide
                          ? toRgba(theme.cardBackground, 0.76)
                          : toRgba(theme.cardBackground, 0.4),
                      color: theme.textPrimary,
                    }}
                  >
                    {slide.buttonLabel}
                  </button>
                ))}
              </div>

              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: index === activeHeroSlide ? 1 : 0 }}
                >
                  {isRenderableVideo(slide) ? (
                    <video
                      ref={(node) => {
                        heroVideoRefs.current[slide.id] = node;
                      }}
                      src={slide.src}
                      poster={slide.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="h-full w-full object-contain sm:object-cover"
                    />
                  ) : (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      quality={100}
                      sizes="(max-width: 1280px) 100vw, 660px"
                      className="object-contain sm:object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center text-center">
            <h1 className="max-w-[14ch] text-[clamp(3rem,8vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.04em] break-keep">
              {formatHeroTitle(
                content.hero.title,
                theme.titleGradientFrom,
                theme.titleGradientTo,
              )}
            </h1>

            <p
              className="mt-8 max-w-[42rem] text-base leading-8 sm:text-lg"
              style={{ color: theme.textMuted }}
            >
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={content.hero.primaryCtaHref}
                className="rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${theme.accentFrom}, ${theme.accentTo})`,
                }}
              >
                {content.hero.primaryCta}
              </a>
              <a
                href={content.hero.secondaryCtaHref}
                className="rounded-full border px-5 py-3 text-sm font-semibold"
                style={{
                  backgroundColor: theme.secondaryButtonBackground,
                  borderColor: theme.secondaryButtonBorder,
                  color: theme.textPrimary,
                }}
              >
                {content.hero.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        id="who-we-are"
        eyebrow=""
        title={content.solutions.title}
        description={content.solutions.description}
        backgroundColor={theme.sectionBackgroundSolutions}
        theme={theme}
        tone="featured"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <CardSurface
            theme={theme}
            className="flex min-h-[420px] flex-col justify-between"
            style={{
              background: `linear-gradient(145deg, ${toRgba(theme.accentFrom, 0.18)}, ${toRgba(theme.accentTo, 0.1)}), ${toRgba(theme.cardBackground, 0.96)}`,
            }}
          >
            <div>
              <p className="max-w-[24ch] text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-[1.18] tracking-[-0.04em]" style={{ color: theme.textPrimary }}>
                {renderMultilineText(content.solutions.teamIntro)}
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {content.solutions.highlights.map((item, index) => (
                <MiniStat key={`${item.label}-${item.value}-${index}`} label={item.label} value={item.value} theme={theme} />
              ))}
            </div>
          </CardSurface>

            <div className="grid gap-4 md:grid-cols-2">
              {content.solutions.values.map((value) => (
              <CardSurface key={value.title} theme={theme} className="min-h-[200px]">
                <h3 className="text-[clamp(1.25rem,2vw,1.55rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 sm:text-[0.98rem]" style={{ color: theme.textMuted }}>
                  {renderMultilineText(value.description)}
                </p>
              </CardSurface>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="milestones"
        eyebrow=""
        title={content.partners.title}
        description={content.partners.description}
        backgroundColor={theme.sectionBackgroundPartners}
        theme={theme}
        tone="supporting"
      >
        <div className="grid justify-center gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.partners.milestones.map((milestone, index) => (
            <CardSurface
              key={milestone.title}
              theme={theme}
              className="mx-auto flex min-h-[220px] w-full max-w-[320px] flex-col justify-between text-center sm:min-h-[240px]"
              style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}
            >
              <div>
                <p
                  className="text-[0.72rem] font-medium uppercase tracking-[0.14em] sm:text-xs"
                  style={{ color: theme.textMuted }}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mx-auto mt-3 max-w-[18ch] text-[1.22rem] font-semibold leading-[1.16] tracking-[-0.03em] sm:text-[1.42rem]">
                  {milestone.title}
                </h3>
              </div>

              <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3">
                <p
                  className="text-[0.58rem] font-medium uppercase tracking-[0.18em] sm:text-[0.64rem]"
                  style={{ color: toRgba(theme.textMuted, 0.88) }}
                >
                  {milestone.label}
                </p>
                <p
                  className="mx-auto max-w-[28ch] text-[0.92rem] leading-7 sm:text-[0.96rem]"
                  style={{ color: theme.textMuted }}
                >
                  {renderMultilineText(milestone.detail)}
                </p>
              </div>
            </CardSurface>
          ))}
        </div>
        {content.partners.history.length > 0 ? (
          <div className="mt-10">
            <div className="mb-6 border-t pt-6" style={{ borderColor: toRgba(theme.cardBorder, 0.32) }}>
              <h3 className="text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-none tracking-[-0.04em]">
                History
              </h3>
            </div>
            <div className="grid gap-x-12 gap-y-8 xl:grid-cols-2">
              {chunkItems(content.partners.history, Math.ceil(content.partners.history.length / 2)).map(
                (group, groupIndex) => (
                  <div
                    key={`history-column-${groupIndex}`}
                    className="space-y-6 xl:border-l xl:pl-8"
                    style={{ borderColor: toRgba(theme.cardBorder, 0.28) }}
                  >
                    {group.map((item, index) => (
                      <div
                        key={`${item.period}-${index}`}
                        className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4"
                      >
                        <p className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] sm:text-[2rem]">
                          {item.period}
                        </p>
                        <p
                          className="break-keep pt-1 text-[0.98rem] leading-7 sm:text-[1.02rem]"
                          style={{ color: theme.textMuted }}
                        >
                          {renderMultilineText(item.detail)}
                        </p>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </SectionShell>

      <SectionShell
        id="our-platform"
        eyebrow=""
        title={content.products.title}
        description={content.products.description}
        backgroundColor={theme.sectionBackgroundProducts}
        theme={theme}
        tone="featured"
      >
        <div className="grid gap-6">
          {content.products.platforms.map((platform, index) => (
            <div key={`${platform.name}-${index}`} className="space-y-4">
              <CardSurface
                theme={theme}
                className="overflow-hidden p-0"
                style={{
                  background: `linear-gradient(145deg, ${toRgba(theme.accentFrom, 0.08)}, ${toRgba(theme.accentTo, 0.05)}), ${toRgba(theme.cardBackground, 0.92)}`,
                }}
              >
                <div className="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                  <div
                    className="relative min-h-[260px] overflow-hidden sm:min-h-[340px] xl:min-h-[520px]"
                    style={{ backgroundColor: toRgba(theme.pageBackground, 0.34) }}
                  >
                    <Image
                      src={platform.imageSrc}
                      alt={platform.imageAlt}
                      fill
                      quality={100}
                      sizes="(max-width: 1280px) 100vw, 820px"
                      className="object-contain sm:object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-8 p-7 sm:p-9">
                    <div>
                      <h3 className="text-[clamp(2.2rem,4.5vw,4rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
                        {platform.name}
                      </h3>
                      <p
                        className="mt-5 max-w-[34ch] text-base leading-8 sm:text-[1.06rem]"
                        style={{ color: theme.textMuted }}
                      >
                        {platform.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {platform.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border px-4 py-2.5 text-xs sm:text-[0.82rem]"
                          style={{
                            borderColor: toRgba(theme.cardBorder, 0.45),
                            backgroundColor: toRgba(theme.cardBackground, 0.32),
                            color: theme.textPrimary,
                          }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardSurface>

              {metricGroups[index] && metricGroups[index].length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {metricGroups[index].map((item) => (
                    <CardSurface
                      key={`${platform.name}-${item.label}`}
                      theme={theme}
                      className="flex min-h-[180px] flex-col justify-between"
                      style={{ backgroundColor: toRgba(theme.cardBackground, 0.36) }}
                    >
                      <p
                        className="max-w-[12ch] text-sm uppercase leading-6 tracking-[0.14em] sm:text-[0.95rem]"
                        style={{ color: theme.textMuted }}
                      >
                        {item.label}
                      </p>
                      <p className="mt-8 text-[clamp(2.6rem,4.4vw,3.8rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
                        {item.value}
                      </p>
                    </CardSurface>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="our-services"
        eyebrow=""
        title={content.about.title}
        description={content.about.description}
        backgroundColor={theme.sectionBackgroundAbout}
        theme={theme}
        tone="supporting"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.about.services.map((service, index) => (
            <button
              key={service.name}
              type="button"
              onClick={() => setActiveServiceIndex(index)}
              className={`text-left ${index === 2 ? "md:col-span-2 xl:col-span-1" : ""}`}
            >
              <CardSurface
                theme={theme}
                className="flex min-h-[280px] flex-col"
                style={{
                  backgroundColor:
                    index === activeServiceIndex
                      ? toRgba(theme.cardBackground, 0.54)
                      : toRgba(theme.cardBackground, 0.36),
                  borderColor:
                    index === activeServiceIndex
                      ? toRgba(theme.cardBorder, 0.8)
                      : toRgba(theme.cardBorder, 0.45),
                }}
              >
                <h3 className="mt-4 text-[clamp(1.55rem,2.4vw,1.9rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{service.name}</h3>
                <p className="mt-4 text-sm leading-7" style={{ color: theme.textMuted }}>
                  {service.summary}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-7">
                  {(index === 0
                    ? ["Short-form", "Viral", "Performance"]
                    : index === 1
                      ? ["Commerce App", "Custom Build", "Operations"]
                      : ["Sales Deck", "Storytelling", "Promotion Page"]
                  ).map((tag) => (
                    <Tag key={tag} theme={theme}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </CardSurface>
            </button>
          ))}
        </div>

        {content.about.services[activeServiceIndex] ? (
          <div className="mt-6">
            <ServiceMediaCarousel
              images={content.about.services[activeServiceIndex].images}
              serviceName={content.about.services[activeServiceIndex].name}
              theme={theme}
            />
          </div>
        ) : null}
      </SectionShell>

      <SectionShell
        id="contact"
        eyebrow="CONTACT US"
        title={contactTitle}
        description={contactDescription}
        backgroundColor={theme.sectionBackgroundContact}
        theme={theme}
        tone="supporting"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CardSurface theme={theme} style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}>
            <div className="flex items-start gap-4">
              <ContactIcon theme={theme} type="email" />
              <div>
                <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.textMuted }}>
                  Email
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">{footerEmail}</p>
              </div>
            </div>
          </CardSurface>

          <CardSurface theme={theme} style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}>
            <div className="flex items-start gap-4">
              <ContactIcon theme={theme} type="phone" />
              <div>
                <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.textMuted }}>
                  Phone
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">{footerPhone}</p>
              </div>
            </div>
          </CardSurface>

          <a href={instagramLink.href} target="_blank" rel="noreferrer">
            <CardSurface theme={theme} className="h-full transition hover:border-white/30" style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}>
              <div className="flex items-start gap-4">
                <ContactIcon theme={theme} type="instagram" />
                <div>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.textMuted }}>
                    Instagram
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">drrip.official</p>
                </div>
              </div>
            </CardSurface>
          </a>

          <a href={sellerLink.href} target="_blank" rel="noreferrer">
            <CardSurface theme={theme} className="h-full transition hover:border-white/30" style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}>
              <div className="flex items-start gap-4">
                <ContactIcon theme={theme} type="link" />
                <div>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.textMuted }}>
                    Seller
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">drrip 입점 신청</p>
                </div>
              </div>
            </CardSurface>
          </a>
        </div>
      </SectionShell>

      <SectionShell
        id="news-content"
        eyebrow="NEWS CONTENTS"
        title={content.news.title}
        description={content.news.description}
        backgroundColor={theme.sectionBackgroundContact}
        theme={theme}
        tone="supporting"
      >
        <CarouselControls
          canScrollLeft={canScrollNewsLeft}
          canScrollRight={canScrollNewsRight}
          onScrollLeft={() =>
            scrollCarousel(newsCarouselRef.current, -Math.min(window.innerWidth * 0.72, 420))
          }
          onScrollRight={() =>
            scrollCarousel(newsCarouselRef.current, Math.min(window.innerWidth * 0.72, 420))
          }
          theme={theme}
        />
        <div
          ref={newsCarouselRef}
          onScroll={(event) =>
            updateCarouselState(
              event.currentTarget,
              setCanScrollNewsLeft,
              setCanScrollNewsRight,
            )
          }
          className="overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-max gap-4">
            {content.news.items.map((item, index) => (
              <a
                key={`${item.title}-${index}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="w-[min(88vw,420px)] shrink-0 snap-start"
              >
                <CardSurface theme={theme} className="h-full" style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}>
                  <div className="p-1 sm:p-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em]" style={{ color: theme.textMuted }}>
                      <span>{item.source}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="mt-4 text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                      {renderMultilineText(item.title)}
                    </h3>
                    <p className="mt-3 text-sm leading-7 sm:text-[0.98rem]" style={{ color: theme.textMuted }}>
                      {renderMultilineText(item.summary)}
                    </p>
                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em]" style={{ color: theme.textPrimary }}>
                      Read article
                    </p>
                  </div>
                </CardSurface>
              </a>
            ))}
          </div>
        </div>

        {content.content.items.length > 0 ? (
          <div className="mt-6">
            <CarouselControls
              canScrollLeft={canScrollContentLeft}
              canScrollRight={canScrollContentRight}
              onScrollLeft={() =>
                scrollCarousel(contentCarouselRef.current, -Math.min(window.innerWidth * 0.8, 520))
              }
              onScrollRight={() =>
                scrollCarousel(contentCarouselRef.current, Math.min(window.innerWidth * 0.8, 520))
              }
              theme={theme}
            />
          <div
            ref={contentCarouselRef}
            onScroll={(event) =>
              updateCarouselState(
                event.currentTarget,
                setCanScrollContentLeft,
                setCanScrollContentRight,
              )
            }
            className="overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max gap-4">
              {content.content.items.map((item, index) => (
                <CardSurface
                  key={`${item.title}-${index}`}
                  theme={theme}
                  className="w-[min(76vw,420px)] shrink-0 snap-start overflow-hidden p-0"
                  style={{ backgroundColor: toRgba(theme.cardBackground, 0.34) }}
                >
                  <div
                    className="relative aspect-[4/5] w-full"
                    style={{ backgroundColor: toRgba(theme.pageBackground, 0.34) }}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      quality={100}
                      sizes="(max-width: 1280px) 76vw, 420px"
                      className="object-contain sm:object-cover"
                    />
                  </div>
                  <div className="px-5 pb-5 pt-4">
                    <p className="text-lg font-semibold tracking-[-0.03em]">
                      {renderMultilineText(item.title)}
                    </p>
                  </div>
                </CardSurface>
              ))}
            </div>
          </div>
          </div>
        ) : null}
      </SectionShell>
      <footer className="px-6 pb-16 pt-8 sm:px-8" style={{ color: theme.textMuted }}>
        <div
          className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 border-t pt-6 xl:flex-row xl:items-start xl:justify-between"
          style={{ borderColor: toRgba(theme.cardBorder, 0.45) }}
        >
          <div>
            <div className="text-base font-extrabold tracking-[0.12em] text-white sm:text-lg">
              YCOMMA
            </div>
            <p className="mt-3">대표자 {footerCeo}</p>
            <p className="mt-2">{footerAddress}</p>
          </div>

          <div>
            <p>{footerEmail}</p>
            <p className="mt-2">{footerPhone}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {footerQuickLinks.map((link, index) => (
                <a
                  key={`${link.label}-${link.href}-${index}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border px-3 py-2 text-xs"
                  style={{
                    borderColor: toRgba(theme.cardBorder, 0.45),
                    backgroundColor: toRgba(theme.cardBackground, 0.35),
                    color: theme.textPrimary,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function formatHeroTitle(title: string, from: string, to: string) {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return null;
  }

  if (normalizedTitle.includes("\n")) {
    const lines = normalizedTitle
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return (
      <>
        {lines.map((line, index) => (
          <span
            key={`${line}-${index}`}
            className="block pr-[0.08em]"
          >
            {index === 0 ? (
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
              >
                {line}
              </span>
            ) : (
              line
            )}
          </span>
        ))}
      </>
    );
  }

  const words = normalizedTitle.split(/\s+/);

  if (words.length === 0) {
    return null;
  }

  const [firstWord, ...restWords] = words;

  return (
    <>
      <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      >
        {firstWord}
      </span>
      {restWords.length > 0 ? ` ${restWords.join(" ")}` : null}
    </>
  );
}

function renderMultilineText(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return value;
  }

  return lines.map((line, index) => (
    <span key={`${line}-${index}`} className="block">
      {line}
    </span>
  ));
}

function ServiceMediaCarousel({
  images,
  serviceName,
  theme,
}: {
  images: Array<{ src: string; alt: string }>;
  serviceName: string;
  theme: SiteContent["theme"];
}) {
  const slides = images.length > 0 ? images : [{ src: "/images/services/service-marketing-1.webp", alt: `${serviceName} showcase` }];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      className="overflow-hidden rounded-[22px] border"
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.24),
      }}
    >
      <div
        className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[16/6]"
        style={{ backgroundColor: toRgba(theme.pageBackground, 0.34) }}
      >
        {slides.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: index === activeIndex ? 1 : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={100}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, (max-width: 1440px) 78vw, 960px"
              className="object-contain sm:object-cover"
            />
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="flex items-center justify-center gap-2 px-4 py-3">
          {slides.map((image, index) => (
            <button
              key={`${image.alt}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: index === activeIndex ? 24 : 10,
                backgroundColor:
                  index === activeIndex
                    ? theme.textPrimary
                    : toRgba(theme.textMuted, 0.45),
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  backgroundColor,
  theme,
  tone = "supporting",
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  backgroundColor: string;
  theme: SiteContent["theme"];
  tone?: "featured" | "supporting";
}) {
  const isFeatured = tone === "featured";

  return (
    <section
      id={id}
      className={isFeatured ? "px-6 py-24 sm:px-8 sm:py-[7.5rem]" : "px-6 py-[4.5rem] sm:px-8 sm:py-[5.5rem]"}
      style={{ backgroundColor }}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className={isFeatured ? "mb-14 w-full sm:mb-18" : "mb-12 w-full sm:mb-14"}>
          <div>
            {eyebrow ? <Pill theme={theme}>{eyebrow}</Pill> : null}
            <h2
              className={
                isFeatured
                  ? `${eyebrow ? "mt-5" : "mt-0"} w-full max-w-none text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em]`
                  : `${eyebrow ? "mt-4" : "mt-0"} w-full max-w-none text-[clamp(2.1rem,3.3vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.045em]`
              }
            >
              {title}
            </h2>
            <p
              className={
                isFeatured
                  ? "mt-6 w-full max-w-none break-keep text-base leading-8 sm:text-[1.06rem]"
                  : "mt-5 w-full max-w-none break-keep text-sm leading-7 sm:text-[0.98rem]"
              }
              style={{ color: theme.textMuted }}
            >
              {description}
            </p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function CardSurface({
  children,
  theme,
  className,
  style,
}: {
  children: ReactNode;
  theme: SiteContent["theme"];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`min-w-0 rounded-[28px] border p-6 sm:p-8 ${className ?? ""}`}
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.45),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({
  children,
  theme,
}: {
  children: ReactNode;
  theme: SiteContent["theme"];
}) {
  return (
    <span
      className="inline-flex rounded-full border px-4 py-2 text-sm leading-none"
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.35),
        color: theme.textPrimary,
      }}
    >
      {children}
    </span>
  );
}

function Tag({
  children,
  theme,
}: {
  children: ReactNode;
  theme: SiteContent["theme"];
}) {
  return (
    <span
      className="rounded-full border px-3 py-2 text-xs leading-none"
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.35),
        color: theme.textPrimary,
      }}
    >
      {children}
    </span>
  );
}

function MiniStat({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: SiteContent["theme"];
}) {
  return (
    <div
      className="rounded-[22px] border p-5"
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.35),
      }}
      >
        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.textMuted }}>
          {label}
        </p>
      <p className="mt-3 text-[clamp(1.24rem,2.4vw,1.56rem)] font-semibold leading-[1.08]">
        {renderMultilineText(value)}
      </p>
    </div>
  );
}

function ContactIcon({
  theme,
  type,
}: {
  theme: SiteContent["theme"];
  type: "email" | "phone" | "instagram" | "link";
}) {
  const stroke = theme.textPrimary;

  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl border"
      style={{
        borderColor: toRgba(theme.cardBorder, 0.45),
        backgroundColor: toRgba(theme.cardBackground, 0.35),
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {type === "email" ? (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M4 7l8 6 8-6" />
          </>
        ) : type === "phone" ? (
          <>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72l.34 2.3a2 2 0 0 1-.57 1.72l-1.65 1.65a16 16 0 0 0 5.66 5.66l1.65-1.65a2 2 0 0 1 1.72-.57l2.3.34A2 2 0 0 1 22 16.92z" />
          </>
        ) : type === "instagram" ? (
          <>
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="17.5" cy="6.5" r="1" fill={stroke} stroke="none" />
          </>
        ) : (
          <>
            <path d="M10 14l8-8" />
            <path d="M14 6h4v4" />
            <path d="M20 14v4H4V4h4" />
          </>
        )}
      </svg>
    </div>
  );
}

function CarouselControls({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  theme,
}: {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  theme: SiteContent["theme"];
}) {
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className="flex h-10 w-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35"
        style={{
          borderColor: toRgba(theme.cardBorder, 0.45),
          backgroundColor: toRgba(theme.cardBackground, 0.35),
          color: theme.textPrimary,
        }}
        aria-label="Scroll left"
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className="flex h-10 w-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35"
        style={{
          borderColor: toRgba(theme.cardBorder, 0.45),
          backgroundColor: toRgba(theme.cardBackground, 0.35),
          color: theme.textPrimary,
        }}
        aria-label="Scroll right"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function withFallback(value: string, fallback: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed;
}

function isRenderableVideo(slide: SiteContent["hero"]["slides"][number]) {
  return slide.mediaType === "video" && isVideoSource(slide.src);
}

function isVideoSource(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src.trim());
}

function toRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function chunkItems<T>(items: T[], size: number) {
  const groups: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }

  return groups;
}

function scrollCarousel(container: HTMLDivElement | null, left: number) {
  if (!container) {
    return;
  }

  container.scrollBy({
    left,
    behavior: "smooth",
  });
}

function updateCarouselState(
  container: HTMLDivElement | null,
  setCanScrollLeft: (value: boolean) => void,
  setCanScrollRight: (value: boolean) => void,
) {
  if (!container) {
    setCanScrollLeft(false);
    setCanScrollRight(false);
    return;
  }

  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  setCanScrollLeft(container.scrollLeft > 4);
  setCanScrollRight(maxScrollLeft - container.scrollLeft > 4);
}
