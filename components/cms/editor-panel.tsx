import { useEffect, useState, type ReactNode } from "react";
import type { CmsPanelKey, SiteContent } from "@/types/site-content";

interface EditorPanelProps {
  selectedPanel: CmsPanelKey;
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  onUpdateMenuItem: (
    id: string,
    patch: { label?: string; href?: string },
  ) => void;
  onMoveMenuItem: (id: string, direction: "up" | "down") => void;
  onRemoveMenuItem: (id: string) => void;
  onAddMenuItem: () => void;
}

export function EditorPanel({
  selectedPanel,
  content,
  onChange,
  onUpdateMenuItem,
  onMoveMenuItem,
  onRemoveMenuItem,
  onAddMenuItem,
}: EditorPanelProps) {
  const [activeServiceMediaIndex, setActiveServiceMediaIndex] = useState(0);
  const [newsFetchState, setNewsFetchState] = useState<Record<number, string>>({});
  const activeService = content.about.services[activeServiceMediaIndex];

  useEffect(() => {
    if (activeServiceMediaIndex > content.about.services.length - 1) {
      setActiveServiceMediaIndex(0);
    }
  }, [activeServiceMediaIndex, content.about.services.length]);

  const fetchNewsMetadata = async (index: number) => {
    const item = content.news.items[index];
    if (!item?.href) {
      setNewsFetchState((current) => ({ ...current, [index]: "URL??癒쇱? ?낅젰?댁＜?몄슂." }));
      return;
    }

    setNewsFetchState((current) => ({ ...current, [index]: "湲곗궗 ?뺣낫瑜?媛?몄삤??以?.." }));

    try {
      const response = await fetch("/api/news-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.href }),
      });

      const payload = (await response.json()) as {
        title?: string;
        imageSrc?: string;
        source?: string;
        date?: string;
        summary?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "湲곗궗 ?뺣낫瑜?媛?몄삤吏 紐삵뻽?듬땲??");
      }

      const nextItems = [...content.news.items];
      nextItems[index] = {
        ...item,
        title: payload.title || item.title,
        source: payload.source || item.source,
        date: payload.date || item.date,
        summary: payload.summary || item.summary,
      };

      onChange({ ...content, news: { ...content.news, items: nextItems } });
      setNewsFetchState((current) => ({ ...current, [index]: "湲곗궗 ?뺣낫瑜?媛?몄솕?듬땲??" }));
    } catch (error) {
      setNewsFetchState((current) => ({
        ...current,
        [index]: error instanceof Error ? error.message : "湲곗궗 ?뺣낫瑜?媛?몄삤吏 紐삵뻽?듬땲??",
      }));
    }
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#121216]/90 p-6 text-white shadow-panel backdrop-blur">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Content Editor
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Editor Workspace</h2>
      </div>

      {selectedPanel === "navigation" && (
        <div className="space-y-4">
          <PanelHeader
            title="Site Navigation"
            description="Create, reorder, and rename the main navigation items."
            actionLabel="Add Menu"
            onAction={onAddMenuItem}
          />

          <PanelBlock>
            <Field
              label="Header CTA Label"
              value={content.navigation.ctaLabel}
              onChange={(value) =>
                onChange({
                  ...content,
                  navigation: { ...content.navigation, ctaLabel: value },
                })
              }
            />
            <Field
              label="Header CTA Href"
              value={content.navigation.ctaHref}
              onChange={(value) =>
                onChange({
                  ...content,
                  navigation: { ...content.navigation, ctaHref: value },
                })
              }
            />
          </PanelBlock>

          {content.navigation.items.map((item, index) => (
            <PanelBlock key={item.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">Menu {index + 1}</p>
                <div className="flex gap-2">
                  <SmallButton onClick={() => onMoveMenuItem(item.id, "up")}>Up</SmallButton>
                  <SmallButton onClick={() => onMoveMenuItem(item.id, "down")}>Down</SmallButton>
                  <SmallButton onClick={() => onRemoveMenuItem(item.id)} destructive>
                    Delete
                  </SmallButton>
                </div>
              </div>
              <Field
                label="Menu Label"
                value={item.label}
                onChange={(value) => onUpdateMenuItem(item.id, { label: value })}
              />
              <Field
                label="Menu Href"
                value={item.href}
                onChange={(value) => onUpdateMenuItem(item.id, { href: value })}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "design" && (
        <div className="space-y-6">
          <PanelHeader
            title="Theme Controls"
            description="Change page, module, and button colors from one place."
          />

          <ThemeGroup title="Global">
            <ColorField
              label="Page Background"
              value={content.theme.pageBackground}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, pageBackground: value } })
              }
            />
            <ColorField
              label="Accent Glow 1"
              value={content.theme.pageBackgroundAccent}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, pageBackgroundAccent: value },
                })
              }
            />
            <ColorField
              label="Accent Glow 2"
              value={content.theme.pageBackgroundAccentSecondary}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, pageBackgroundAccentSecondary: value },
                })
              }
            />
            <ColorField
              label="Card Background"
              value={content.theme.cardBackground}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, cardBackground: value } })
              }
            />
            <ColorField
              label="Card Border"
              value={content.theme.cardBorder}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, cardBorder: value } })
              }
            />
            <ColorField
              label="Text Primary"
              value={content.theme.textPrimary}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, textPrimary: value } })
              }
            />
            <ColorField
              label="Text Muted"
              value={content.theme.textMuted}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, textMuted: value } })
              }
            />
          </ThemeGroup>

          <ThemeGroup title="Buttons & Gradients">
            <ColorField
              label="Primary Button From"
              value={content.theme.accentFrom}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, accentFrom: value } })
              }
            />
            <ColorField
              label="Primary Button To"
              value={content.theme.accentTo}
              onChange={(value) =>
                onChange({ ...content, theme: { ...content.theme, accentTo: value } })
              }
            />
            <ColorField
              label="Secondary Button Bg"
              value={content.theme.secondaryButtonBackground}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, secondaryButtonBackground: value },
                })
              }
            />
            <ColorField
              label="Secondary Button Border"
              value={content.theme.secondaryButtonBorder}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, secondaryButtonBorder: value },
                })
              }
            />
            <ColorField
              label="Title Gradient From"
              value={content.theme.titleGradientFrom}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, titleGradientFrom: value },
                })
              }
            />
            <ColorField
              label="Title Gradient To"
              value={content.theme.titleGradientTo}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, titleGradientTo: value },
                })
              }
            />
          </ThemeGroup>

          <ThemeGroup title="Section Backgrounds">
            <ColorField
              label="HOME"
              value={content.theme.sectionBackgroundHero}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundHero: value },
                })
              }
            />
            <ColorField
              label="WHO WE ARE"
              value={content.theme.sectionBackgroundSolutions}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundSolutions: value },
                })
              }
            />
            <ColorField
              label="OUR PLATFORM"
              value={content.theme.sectionBackgroundProducts}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundProducts: value },
                })
              }
            />
            <ColorField
              label="METRICS"
              value={content.theme.sectionBackgroundMetrics}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundMetrics: value },
                })
              }
            />
            <ColorField
              label="MILESTONE"
              value={content.theme.sectionBackgroundPartners}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundPartners: value },
                })
              }
            />
            <ColorField
              label="SERVICES"
              value={content.theme.sectionBackgroundAbout}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundAbout: value },
                })
              }
            />
            <ColorField
              label="CONTACT"
              value={content.theme.sectionBackgroundContact}
              onChange={(value) =>
                onChange({
                  ...content,
                  theme: { ...content.theme, sectionBackgroundContact: value },
                })
              }
            />
          </ThemeGroup>
        </div>
      )}

      {selectedPanel === "hero" && (
        <div className="space-y-4">
          <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => onChange({ ...content, hero: { ...content.hero, eyebrow: value } })} />
          <TextAreaField
            label="Title"
            value={content.hero.title}
            onChange={(value) => onChange({ ...content, hero: { ...content.hero, title: value } })}
          />
          <TextAreaField label="Description" value={content.hero.description} onChange={(value) => onChange({ ...content, hero: { ...content.hero, description: value } })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary CTA" value={content.hero.primaryCta} onChange={(value) => onChange({ ...content, hero: { ...content.hero, primaryCta: value } })} />
            <Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(value) => onChange({ ...content, hero: { ...content.hero, secondaryCta: value } })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Primary CTA Href"
              value={content.hero.primaryCtaHref}
              onChange={(value) => onChange({ ...content, hero: { ...content.hero, primaryCtaHref: value } })}
            />
            <Field
              label="Secondary CTA Href"
              value={content.hero.secondaryCtaHref}
              onChange={(value) => onChange({ ...content, hero: { ...content.hero, secondaryCtaHref: value } })}
            />
          </div>
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  hero: {
                    ...content.hero,
                    slides: [
                      ...content.hero.slides,
                      {
                        id: createEditorId("hero-slide"),
                        buttonLabel: `Slide ${content.hero.slides.length + 1}`,
                        mediaType: "image",
                        src: "/images/hero/hero-visual.svg",
                        alt: "New hero slide",
                      },
                    ],
                  },
                })
              }
            >
              + Add Slide
            </SmallButton>
          </div>
          {content.hero.slides.map((slide, index) => (
            <PanelBlock key={slide.id}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      hero: {
                        ...content.hero,
                        slides: content.hero.slides.filter((item) => item.id !== slide.id),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <Field
                label="Media Type"
                value={slide.mediaType}
                onChange={(value) => {
                  const nextSlides = [...content.hero.slides];
                  nextSlides[index] = {
                    ...slide,
                    mediaType: value === "video" ? "video" : "image",
                  };
                  onChange({ ...content, hero: { ...content.hero, slides: nextSlides } });
                }}
              />
              <Field
                label={`Slide ${index + 1} Button Label`}
                value={slide.buttonLabel}
                onChange={(value) => {
                  const nextSlides = [...content.hero.slides];
                  nextSlides[index] = { ...slide, buttonLabel: value };
                  onChange({ ...content, hero: { ...content.hero, slides: nextSlides } });
                }}
              />
              <Field
                label="Media Src"
                value={slide.src}
                onChange={(value) => {
                  const nextSlides = [...content.hero.slides];
                  nextSlides[index] = {
                    ...slide,
                    src: value,
                    mediaType: inferHeroMediaType(value),
                  };
                  onChange({ ...content, hero: { ...content.hero, slides: nextSlides } });
                }}
              />
              <Field
                label="Alt"
                value={slide.alt}
                onChange={(value) => {
                  const nextSlides = [...content.hero.slides];
                  nextSlides[index] = { ...slide, alt: value };
                  onChange({ ...content, hero: { ...content.hero, slides: nextSlides } });
                }}
              />
              <Field
                label="Poster (video optional)"
                value={slide.poster ?? ""}
                onChange={(value) => {
                  const nextSlides = [...content.hero.slides];
                  nextSlides[index] = { ...slide, poster: value || undefined };
                  onChange({ ...content, hero: { ...content.hero, slides: nextSlides } });
                }}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "solutions" && (
        <div className="space-y-4">
          <Field label="Section Title" value={content.solutions.title} onChange={(value) => onChange({ ...content, solutions: { ...content.solutions, title: value } })} />
          <TextAreaField label="Description" value={content.solutions.description} onChange={(value) => onChange({ ...content, solutions: { ...content.solutions, description: value } })} />
          <TextAreaField label="Team Intro" value={content.solutions.teamIntro} onChange={(value) => onChange({ ...content, solutions: { ...content.solutions, teamIntro: value } })} />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  solutions: {
                    ...content.solutions,
                    highlights: [
                      ...content.solutions.highlights,
                      { label: "New Highlight", value: "New Value" },
                    ],
                  },
                })
              }
            >
              + Add Highlight
            </SmallButton>
          </div>
          {content.solutions.highlights.map((item, index) => (
            <PanelBlock key={`solution-highlight-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      solutions: {
                        ...content.solutions,
                        highlights: content.solutions.highlights.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <Field
                label={`Highlight ${index + 1} Label`}
                value={item.label}
                onChange={(value) => {
                  const nextHighlights = [...content.solutions.highlights];
                  nextHighlights[index] = { ...item, label: value };
                  onChange({ ...content, solutions: { ...content.solutions, highlights: nextHighlights } });
                }}
              />
              <TextAreaField
                label="Value"
                value={item.value}
                onChange={(value) => {
                  const nextHighlights = [...content.solutions.highlights];
                  nextHighlights[index] = { ...item, value };
                  onChange({ ...content, solutions: { ...content.solutions, highlights: nextHighlights } });
                }}
              />
            </PanelBlock>
          ))}
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  solutions: {
                  ...content.solutions,
                    values: [
                      ...content.solutions.values,
                      { title: "New Value", description: "Add value description" },
                    ],
                  },
                })
              }
            >
              + Add Value
            </SmallButton>
          </div>
          {content.solutions.values.map((item, index) => (
            <PanelBlock key={`solution-value-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      solutions: {
                        ...content.solutions,
                        values: content.solutions.values.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Value ${index + 1} Title`}
                value={item.title}
                onChange={(value) => {
                  const nextValues = [...content.solutions.values];
                  nextValues[index] = { ...item, title: value };
                  onChange({ ...content, solutions: { ...content.solutions, values: nextValues } });
                }}
              />
              <TextAreaField
                label="Description"
                value={item.description}
                onChange={(value) => {
                  const nextValues = [...content.solutions.values];
                  nextValues[index] = { ...item, description: value };
                  onChange({ ...content, solutions: { ...content.solutions, values: nextValues } });
                }}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "products" && (
        <div className="space-y-4">
          <Field label="Section Title" value={content.products.title} onChange={(value) => onChange({ ...content, products: { ...content.products, title: value } })} />
          <TextAreaField label="Description" value={content.products.description} onChange={(value) => onChange({ ...content, products: { ...content.products, description: value } })} />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  products: {
                    ...content.products,
                    platforms: [
                      ...content.products.platforms,
                      {
                        name: "New Platform",
                        summary: "Add platform summary",
                        highlights: ["New highlight"],
                        href: "#",
                        imageSrc: "/images/platforms/drrip-overview.svg",
                        imageAlt: "New platform image",
                      },
                    ],
                  },
                })
              }
            >
              + Add Platform
            </SmallButton>
          </div>
          {content.products.platforms.map((platform, index) => (
            <PanelBlock key={`product-platform-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      products: {
                        ...content.products,
                        platforms: content.products.platforms.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Platform ${index + 1} Name`}
                value={platform.name}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = { ...platform, name: value };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
              <TextAreaField
                label="Platform Summary"
                value={platform.summary}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = { ...platform, summary: value };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
              <Field
                label="Platform URL"
                value={platform.href ?? "#"}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = { ...platform, href: value };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
              <Field
                label="Image Src"
                value={platform.imageSrc}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = { ...platform, imageSrc: value };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
              <Field
                label="Image Alt"
                value={platform.imageAlt}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = { ...platform, imageAlt: value };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
              <TextAreaField
                label="Highlights (one per line)"
                value={platform.highlights.join("\n")}
                onChange={(value) => {
                  const nextPlatforms = [...content.products.platforms];
                  nextPlatforms[index] = {
                    ...platform,
                    highlights: value.split("\n").map((item) => item.trim()).filter(Boolean),
                  };
                  onChange({ ...content, products: { ...content.products, platforms: nextPlatforms } });
                }}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "metrics" && (
        <div className="space-y-4">
          <Field label="Section Title" value={content.metrics.title} onChange={(value) => onChange({ ...content, metrics: { ...content.metrics, title: value } })} />
          <TextAreaField label="Description" value={content.metrics.description} onChange={(value) => onChange({ ...content, metrics: { ...content.metrics, description: value } })} />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  metrics: {
                    ...content.metrics,
                    items: [
                      ...content.metrics.items,
                      { label: "New Metric", value: "0+" },
                    ],
                  },
                })
              }
            >
              + Add Metric
            </SmallButton>
          </div>
          {content.metrics.items.map((item, index) => (
            <PanelBlock key={`metric-item-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      metrics: {
                        ...content.metrics,
                        items: content.metrics.items.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Metric ${index + 1} Label`}
                value={item.label}
                onChange={(value) => {
                  const nextItems = [...content.metrics.items];
                  nextItems[index] = { ...item, label: value };
                  onChange({ ...content, metrics: { ...content.metrics, items: nextItems } });
                }}
              />
              <Field
                label="Value"
                value={item.value}
                onChange={(value) => {
                  const nextItems = [...content.metrics.items];
                  nextItems[index] = { ...item, value };
                  onChange({ ...content, metrics: { ...content.metrics, items: nextItems } });
                }}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "partners" && (
        <div className="space-y-4">
          <Field label="Section Title" value={content.partners.title} onChange={(value) => onChange({ ...content, partners: { ...content.partners, title: value } })} />
          <TextAreaField label="Description" value={content.partners.description} onChange={(value) => onChange({ ...content, partners: { ...content.partners, description: value } })} />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  partners: {
                    ...content.partners,
                    milestones: [
                      ...content.partners.milestones,
                      {
                        label: "New Label",
                        title: "New Milestone",
                        detail: "Add milestone detail",
                      },
                    ],
                  },
                })
              }
            >
              + Add Milestone
            </SmallButton>
          </div>
          {content.partners.milestones.map((milestone, index) => (
            <PanelBlock key={`partner-milestone-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      partners: {
                        ...content.partners,
                        milestones: content.partners.milestones.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Milestone ${index + 1} Label`}
                value={milestone.label}
                onChange={(value) => {
                  const nextItems = [...content.partners.milestones];
                  nextItems[index] = { ...milestone, label: value };
                  onChange({ ...content, partners: { ...content.partners, milestones: nextItems } });
                }}
              />
              <TextAreaField
                label="Title"
                value={milestone.title}
                onChange={(value) => {
                  const nextItems = [...content.partners.milestones];
                  nextItems[index] = { ...milestone, title: value };
                  onChange({ ...content, partners: { ...content.partners, milestones: nextItems } });
                }}
              />
              <TextAreaField
                label="Detail"
                value={milestone.detail}
                onChange={(value) => {
                  const nextItems = [...content.partners.milestones];
                  nextItems[index] = { ...milestone, detail: value };
                  onChange({ ...content, partners: { ...content.partners, milestones: nextItems } });
                }}
              />
            </PanelBlock>
          ))}
          <div className="border-t border-white/10 pt-2">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-300">History</p>
              <SmallButton
                onClick={() =>
                  onChange({
                    ...content,
                    partners: {
                      ...content.partners,
                      history: [
                        ...content.partners.history,
                        {
                          period: "2026",
                          detail: "Add history detail",
                        },
                      ],
                    },
                  })
                }
              >
                + Add History
              </SmallButton>
            </div>
            <div className="space-y-4">
              {content.partners.history.map((item, index) => (
                <PanelBlock key={`partner-history-${index}`}>
                  <div className="flex justify-end">
                    <SmallButton
                      destructive
                      onClick={() =>
                        onChange({
                          ...content,
                          partners: {
                            ...content.partners,
                            history: content.partners.history.filter((_, itemIndex) => itemIndex !== index),
                          },
                        })
                      }
                    >
                      Delete
                    </SmallButton>
                  </div>
                  <TextAreaField
                    label={`History ${index + 1} Period`}
                    value={item.period}
                    onChange={(value) => {
                      const nextItems = [...content.partners.history];
                      nextItems[index] = { ...item, period: value };
                      onChange({ ...content, partners: { ...content.partners, history: nextItems } });
                    }}
                  />
                  <TextAreaField
                    label="History Detail"
                    value={item.detail}
                    onChange={(value) => {
                      const nextItems = [...content.partners.history];
                      nextItems[index] = { ...item, detail: value };
                      onChange({ ...content, partners: { ...content.partners, history: nextItems } });
                    }}
                  />
                </PanelBlock>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedPanel === "about" && (
        <div className="space-y-4">
          <Field label="Section Title" value={content.about.title} onChange={(value) => onChange({ ...content, about: { ...content.about, title: value } })} />
          <TextAreaField label="Description" value={content.about.description} onChange={(value) => onChange({ ...content, about: { ...content.about, description: value } })} />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  about: {
                    ...content.about,
                    services: [
                      ...content.about.services,
                      {
                        name: "New Service",
                        summary: "Add service summary",
                        href: "#",
                        images: [{ src: "/images/services/service-marketing-1.webp", alt: "New service image" }],
                      },
                    ],
                  },
                })
              }
            >
              + Add Service
            </SmallButton>
          </div>
          {content.about.services.map((service, index) => (
            <PanelBlock key={`about-service-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      about: {
                        ...content.about,
                        services: content.about.services.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Service ${index + 1} Name`}
                value={service.name}
                onChange={(value) => {
                  const nextServices = [...content.about.services];
                  nextServices[index] = { ...service, name: value };
                  onChange({ ...content, about: { ...content.about, services: nextServices } });
                }}
              />
              <TextAreaField
                label="Summary"
                value={service.summary}
                onChange={(value) => {
                  const nextServices = [...content.about.services];
                  nextServices[index] = { ...service, summary: value };
                  onChange({ ...content, about: { ...content.about, services: nextServices } });
                }}
              />
            </PanelBlock>
          ))}

          {activeService ? (
            <PanelBlock>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Service Carousel Media</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Choose a service, then manage the images shown in the shared carousel below the cards.
                  </p>
                </div>
                <SmallButton
                  onClick={() => {
                    const nextServices = [...content.about.services];
                    nextServices[activeServiceMediaIndex] = {
                      ...activeService,
                      images: [
                        ...(activeService.images ?? []),
                        { src: "/images/services/service-marketing-1.webp", alt: "New service image" },
                      ],
                    };
                    onChange({ ...content, about: { ...content.about, services: nextServices } });
                  }}
                >
                  + Add Image
                </SmallButton>
              </div>

              <div className="flex flex-wrap gap-2">
                {content.about.services.map((service, index) => (
                  <button
                    key={`service-media-tab-${index}`}
                    type="button"
                    onClick={() => setActiveServiceMediaIndex(index)}
                    className={
                      index === activeServiceMediaIndex
                        ? "rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black"
                        : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200"
                    }
                  >
                    {service.name}
                  </button>
                ))}
              </div>

              {(activeService.images ?? []).map((image, imageIndex) => (
                <PanelBlock key={`service-media-image-${activeServiceMediaIndex}-${imageIndex}`}>
                  <div className="flex justify-end">
                    <SmallButton
                      destructive
                      onClick={() => {
                        const nextServices = [...content.about.services];
                        nextServices[activeServiceMediaIndex] = {
                          ...activeService,
                          images: (activeService.images ?? []).filter((_, itemIndex) => itemIndex !== imageIndex),
                        };
                        onChange({ ...content, about: { ...content.about, services: nextServices } });
                      }}
                    >
                      Delete
                    </SmallButton>
                  </div>
                  <Field
                    label={`Image ${imageIndex + 1} Src`}
                    value={image.src}
                    onChange={(value) => {
                      const nextServices = [...content.about.services];
                      const nextImages = [...(activeService.images ?? [])];
                      nextImages[imageIndex] = { ...image, src: value };
                      nextServices[activeServiceMediaIndex] = { ...activeService, images: nextImages };
                      onChange({ ...content, about: { ...content.about, services: nextServices } });
                    }}
                  />
                  <Field
                    label="Image Alt"
                    value={image.alt}
                    onChange={(value) => {
                      const nextServices = [...content.about.services];
                      const nextImages = [...(activeService.images ?? [])];
                      nextImages[imageIndex] = { ...image, alt: value };
                      nextServices[activeServiceMediaIndex] = { ...activeService, images: nextImages };
                      onChange({ ...content, about: { ...content.about, services: nextServices } });
                    }}
                  />
                </PanelBlock>
              ))}
            </PanelBlock>
          ) : null}
        </div>
      )}

      {selectedPanel === "contact" && (
        <div className="space-y-4">
          <Field
            label="Section Title"
            value={content.contact.title}
            onChange={(value) => onChange({ ...content, contact: { ...content.contact, title: value } })}
          />
          <TextAreaField
            label="Description"
            value={content.contact.description}
            onChange={(value) => onChange({ ...content, contact: { ...content.contact, description: value } })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Email"
              value={content.contact.footer.email}
              onChange={(value) =>
                onChange({
                  ...content,
                  contact: {
                    ...content.contact,
                    footer: { ...content.contact.footer, email: value },
                  },
                })
              }
            />
            <Field
              label="Phone"
              value={content.contact.footer.phone}
              onChange={(value) =>
                onChange({
                  ...content,
                  contact: {
                    ...content.contact,
                    footer: { ...content.contact.footer, phone: value },
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {selectedPanel === "news" && (
        <div className="space-y-4">
          <Field
            label="Section Title"
            value={content.news.title}
            onChange={(value) => onChange({ ...content, news: { ...content.news, title: value } })}
          />
          <TextAreaField
            label="Description"
            value={content.news.description}
            onChange={(value) => onChange({ ...content, news: { ...content.news, description: value } })}
          />
          <div className="flex justify-end">
            <SmallButton
              onClick={() =>
                onChange({
                  ...content,
                  news: {
                    ...content.news,
                    items: [
                      ...content.news.items,
                      {
                        title: "New News Title",
                        summary: "Add news summary",
                        source: "YCOMMA",
                        date: "2026.03.20",
                        imageSrc: "/images/news/news-cover-1.svg",
                        imageAlt: "News preview image",
                        href: "#",
                      },
                    ],
                  },
                })
              }
            >
              + Add News
            </SmallButton>
          </div>
          {content.news.items.map((item, index) => (
            <PanelBlock key={`news-item-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      news: {
                        ...content.news,
                        items: content.news.items.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`News ${index + 1} Title`}
                value={item.title}
                onChange={(value) => {
                  const nextItems = [...content.news.items];
                  nextItems[index] = { ...item, title: value };
                  onChange({ ...content, news: { ...content.news, items: nextItems } });
                }}
              />
              <TextAreaField
                label="Summary"
                value={item.summary}
                onChange={(value) => {
                  const nextItems = [...content.news.items];
                  nextItems[index] = { ...item, summary: value };
                  onChange({ ...content, news: { ...content.news, items: nextItems } });
                }}
              />
              <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Source"
                value={item.source}
                  onChange={(value) => {
                    const nextItems = [...content.news.items];
                    nextItems[index] = { ...item, source: value };
                    onChange({ ...content, news: { ...content.news, items: nextItems } });
                  }}
                />
                <Field
                  label="Date"
                  value={item.date}
                  onChange={(value) => {
                    const nextItems = [...content.news.items];
                    nextItems[index] = { ...item, date: value };
                    onChange({ ...content, news: { ...content.news, items: nextItems } });
                  }}
                />
              </div>
              <Field
                label="News Href"
                value={item.href}
                onChange={(value) => {
                  const nextItems = [...content.news.items];
                  nextItems[index] = { ...item, href: value };
                  onChange({ ...content, news: { ...content.news, items: nextItems } });
                }}
              />
              <div className="flex items-center justify-between gap-3">
                <SmallButton onClick={() => void fetchNewsMetadata(index)}>
                  Fetch from URL
                </SmallButton>
                {newsFetchState[index] ? (
                  <p className="text-xs text-zinc-400">{newsFetchState[index]}</p>
                ) : null}
              </div>
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "content" && (
        <div className="space-y-4">
          <PanelHeader
            title="Content Visuals"
            description="Manage the image-only content strip shown under the news cards."
            actionLabel="Add Content"
            onAction={() =>
              onChange({
                ...content,
                content: {
                  ...content.content,
                  items: [
                    ...content.content.items,
                    {
                      title: `Content ${content.content.items.length + 1}`,
                      imageSrc: "/images/content/content-1.webp",
                    },
                  ],
                },
              })
            }
          />

          {content.content.items.map((item, index) => (
            <PanelBlock key={`content-item-${index}`}>
              <div className="flex justify-end">
                <SmallButton
                  destructive
                  onClick={() =>
                    onChange({
                      ...content,
                      content: {
                        ...content.content,
                        items: content.content.items.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                >
                  Delete
                </SmallButton>
              </div>
              <TextAreaField
                label={`Content ${index + 1} Title`}
                value={item.title}
                onChange={(value) => {
                  const nextItems = [...content.content.items];
                  nextItems[index] = { ...item, title: value };
                  onChange({ ...content, content: { ...content.content, items: nextItems } });
                }}
              />
              <Field
                label="Image Src"
                value={item.imageSrc}
                onChange={(value) => {
                  const nextItems = [...content.content.items];
                  nextItems[index] = { ...item, imageSrc: value };
                  onChange({ ...content, content: { ...content.content, items: nextItems } });
                }}
              />
            </PanelBlock>
          ))}
        </div>
      )}

      {selectedPanel === "footer" && (
        <div className="space-y-4">
          <PanelHeader
            title="Footer Content"
            description="Edit the company information shown at the bottom of the homepage."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextAreaField
              label="CEO"
              value={content.contact.footer.ceo}
              onChange={(value) =>
                onChange({
                  ...content,
                  contact: {
                    ...content.contact,
                    footer: { ...content.contact.footer, ceo: value },
                  },
                })
              }
            />
            <TextAreaField
              label="Phone"
              value={content.contact.footer.phone}
              onChange={(value) =>
                onChange({
                  ...content,
                  contact: {
                    ...content.contact,
                    footer: { ...content.contact.footer, phone: value },
                  },
                })
              }
            />
          </div>
          <TextAreaField
            label="Address"
            value={content.contact.footer.address}
            onChange={(value) =>
              onChange({
                ...content,
                contact: {
                  ...content.contact,
                  footer: { ...content.contact.footer, address: value },
                },
              })
            }
          />
          <TextAreaField
            label="Email"
            value={content.contact.footer.email}
            onChange={(value) =>
              onChange({
                ...content,
                contact: {
                  ...content.contact,
                  footer: { ...content.contact.footer, email: value },
                },
              })
            }
          />
        </div>
      )}
    </section>
  );
}

function PanelHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PanelBlock({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-zinc-300">{label}</label>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-zinc-300">{label}</label>
      <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  destructive,
}: {
  children: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        destructive
          ? "rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-200"
          : "rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200"
      }
    >
      {children}
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-zinc-300">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={normalizeColor(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
        />
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  );
}

function ThemeGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function normalizeColor(value: string) {
  return /^#([0-9a-fA-F]{6})$/.test(value) ? value : "#000000";
}

function inferHeroMediaType(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src.trim()) ? "video" : "image";
}

function createEditorId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
