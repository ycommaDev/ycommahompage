import snapshot from "./site-content.snapshot.json";
import { siteContentDefaults } from "@/data/site-content-defaults";
import type { SiteContent } from "@/types/site-content";

export const initialSiteContent: SiteContent = {
  ...((snapshot as unknown) as SiteContent),
  content:
    ((snapshot as unknown) as Partial<SiteContent>).content ?? siteContentDefaults.content,
};
