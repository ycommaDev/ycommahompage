"use client";

import { useEffect, useState } from "react";
import { initialSiteContent } from "@/data/site-content";
import { loadStoredSiteContent } from "@/lib/site-content-storage";
import { SitePreview } from "@/components/site/site-preview";
import type { SiteContent } from "@/types/site-content";

export function SitePreviewPage() {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);

  useEffect(() => {
    setContent(loadStoredSiteContent());
  }, []);

  return <SitePreview content={content} />;
}
