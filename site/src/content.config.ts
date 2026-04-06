import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    featured: z.boolean(),
    tags: z.array(z.string()),
    hero: z.string(),
    logo: z.string(),
    concept_images: z.array(z.string()).default([]),
    results_images: z.array(z.string()).default([]),
    appendix_images: z.array(z.string()).default([]),
    has_appendix: z.boolean().default(false),
    video_embed: z.string().optional(),
  }),
});

export const collections = { projects };
