import { defineCollection, z } from 'astro:content';

const listings = defineCollection({
  type: 'content',
  schema: z.object({
    address: z.string(),
    price: z.string(),
    beds: z.number(),
    baths: z.number(),
    sqft: z.number(),
    status: z.enum(['Active', 'Under Contract', 'Sold']),
    photo: z.string().optional(),
    description: z.string(),
  }),
});

export const collections = { listings };
