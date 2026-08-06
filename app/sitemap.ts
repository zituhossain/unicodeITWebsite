import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://aexo.design"; return ["", "/works", "/pricing", "/about", "/contact", "/policy/our-privacy-policy", "/policy/our-terms-conditions", ...projects.map((project) => `/works/${project.slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })); }
