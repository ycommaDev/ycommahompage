import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ycomma.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cms", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
