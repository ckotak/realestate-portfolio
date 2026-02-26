import { defineCollection, z } from 'astro:content';

const listings = defineCollection({
  type: 'content',
  schema: z.object({
    address: z.string().optional(),
    price: z.string().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    sqft: z.number().optional(),
    status: z.enum(['Active', 'Under Contract', 'Sold']),
    photo: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    heading: z.string(),
    stats: z.array(z.object({
      number: z.string(),
      label: z.string(),
    })),
  }),
});

const whyme = defineCollection({
  type: 'content',
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    body: z.string(),
    order: z.number(),
  }),
});

export const collections = { listings, about, whyme };
