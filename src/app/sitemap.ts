import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrl
    ? ["/", "/planos"].map((path) => ({ url: `${siteUrl}${path}` }))
    : [];
}
