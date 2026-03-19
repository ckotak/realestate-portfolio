/**
 * Brand configuration starter template.
 * Copy this file to brand.ts and fill in your values.
 */
import type { BrandConfig } from './brand';

export const brand: BrandConfig = {
  agent: {
    name: "Your Name",                    // Agent's full name
    title: "Licensed Real Estate Agent",  // Professional title
    dreNumber: "DRE #0000000",            // License number
  },
  contact: {
    phone: "+1 (555) 555-0000",           // Display format
    phoneRaw: "+1-555-555-0000",          // For tel: links and schema.org
    email: "you@example.com",
  },
  social: {
    twitter: "@yourhandle",
    twitterUrl: "https://twitter.com/yourhandle",
    linkedinUrl: "https://linkedin.com/in/yourprofile",
  },
  location: {
    city: "Your City",
    region: "ST",                          // Two-letter state/region code
    country: "US",
    areaServed: "Your Area, State",
  },
  site: {
    name: "Your Name Real Estate",         // og:site_name
    url: "https://yourdomain.com",         // Canonical URL (no trailing slash)
    ogImage: "/og-image.png",              // Path relative to site root
    twitterCard: "summary_large_image",
  },
  theme: {
    colors: {
      primary: "#0f0f0f",                  // Main dark background
      primaryLight: "#1a1a1a",             // Lighter dark variant
      accent: "#C9A84C",                   // Brand accent color
      accentHover: "#dbb96a",              // Accent hover state
      background: "#f9f9f7",              // Light background
      backgroundAlt: "#f2f2f0",            // Alternate light background
    },
    fonts: {
      display: "'Bebas Neue', 'Arial Narrow', sans-serif",  // Full CSS font-family for headings
      body: "'Inter', ui-sans-serif, system-ui, sans-serif", // Full CSS font-family for body
    },
  },
};
