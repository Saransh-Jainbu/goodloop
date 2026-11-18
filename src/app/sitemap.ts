import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";

// Reads the database, so it is built on request rather than at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/signup`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Only published events, newest first, capped so the file stays small.
  const events = await db.event.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, createdAt: true },
    orderBy: { startsAt: "desc" },
    take: 500,
  });
  return [
    ...pages,
    ...events.map((e) => ({
      url: `${base}/events/${e.id}`,
      lastModified: e.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
