import type { SiteContent } from "@/types/site-content";

export const siteContentDefaults: Pick<SiteContent, "content"> = {
  content: {
    items: [
      {
        title: "Content Visual 1",
        imageSrc: "/images/content/content-1.svg",
      },
      {
        title: "Content Visual 2",
        imageSrc: "/images/content/content-2.svg",
      },
    ],
  },
};
