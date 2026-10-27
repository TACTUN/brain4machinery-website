import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each collection reads src/content/<name>/*.md(x); the file name is the entry id.
const mdx = (name: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${name}` });

const baseFields = {
  title: z.string().max(70),
  description: z.string().max(160),
  publishedDate: z.date(),
  updatedDate: z.date().optional(),
  author: z.string().default('Rafayel Ghasabyan'),
  draft: z.boolean().default(false),
  canonical: z.url().optional(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()).default([]),
  tlDr: z.string().min(40).max(400).optional(),
  faq: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    )
    .default([]),
};

const blog = defineCollection({
  loader: mdx('blog'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['BlogPosting', 'TechArticle']).default('BlogPosting'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: mdx('guides'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['TechArticle', 'HowTo']).default('TechArticle'),
    difficulty: z.enum(['intro', 'intermediate', 'advanced']).default('intro'),
    estimatedReadMinutes: z.number().int().positive().default(8),
  }),
});

const glossary = defineCollection({
  loader: mdx('glossary'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['DefinedTerm']).default('DefinedTerm'),
    term: z.string(),
    relatedTerms: z.array(z.string()).default([]),
  }),
});

const compare = defineCollection({
  loader: mdx('compare'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['Article']).default('Article'),
    products: z
      .array(
        z.object({
          name: z.string(),
          vendor: z.string(),
          url: z.url().optional(),
        })
      )
      .min(2),
  }),
});

const useCases = defineCollection({
  loader: mdx('use-cases'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['Article']).default('Article'),
    industry: z.string(),
    machineExamples: z.array(z.string()).default([]),
  }),
});

const news = defineCollection({
  loader: mdx('news'),
  schema: z.object({
    ...baseFields,
    jsonLdType: z.enum(['NewsArticle']).default('NewsArticle'),
  }),
});

export const collections = {
  blog,
  guides,
  glossary,
  compare,
  'use-cases': useCases,
  news,
};
