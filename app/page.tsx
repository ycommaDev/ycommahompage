import { SitePreview } from "@/components/site/site-preview";
import { initialSiteContent } from "@/data/site-content";

export default function HomePage() {
  return <SitePreview content={initialSiteContent} />;
}
