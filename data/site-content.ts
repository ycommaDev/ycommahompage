import snapshot from "./site-content.snapshot.json";
import { siteContentDefaults } from "@/data/site-content-defaults";
import type { SiteContent } from "@/types/site-content";

export const initialSiteContent: SiteContent = {
  ...(snapshot as SiteContent),
  content:
    (snapshot as Partial<SiteContent>).content ?? siteContentDefaults.content,
};
