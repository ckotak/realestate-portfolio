/**
 * Brand configuration starter template.
 * Copy brand.json.example to brand.json and fill in your values.
 * See brand.types.ts for the full BrandConfig interface.
 */
import type { BrandConfig } from './brand.types';
import brandData from './brand.json';

export type { BrandConfig };
export const brand: BrandConfig = brandData as BrandConfig;
