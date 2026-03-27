/** Brand configuration — data loaded from brand.json, editable via CMS. */
import type { BrandConfig } from './brand.types';
import brandData from './brand.json';

export type { BrandConfig };
export const brand: BrandConfig = brandData as BrandConfig;
