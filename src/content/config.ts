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

export const collections = { listings };
