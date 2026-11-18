import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Public pages can be indexed; account, admin and API pages cannot.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/me", "/organiser", "/api/", "/login"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
