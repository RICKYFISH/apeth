import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    category: z.enum(["Football", "Betting", "Golf", "Lifestyle", "Food"]),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    imageAlt: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const quotes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/quotes" }),
  schema: z.object({
    quote: z.string(),
    person: z.string(),
    date: z.coerce.date(),
    context: z.string().optional(),
    sport: z.string().default("Football"),
    source: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, quotes };
