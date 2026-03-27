// src/config/brand.types.ts
/** Brand configuration type — shared by brand.json and brand.ts */

export interface BrandConfig {
  agent: {
    name: string;
    title: string;
    dreNumber: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    email: string;
  };
  social: {
    twitter: string;
    twitterUrl: string;
    linkedinUrl: string;
  };
  location: {
    city: string;
    region: string;
    country: string;
    areaServed: string;
  };
  site: {
    name: string;
    url: string;
    ogImage: string;
    twitterCard: "summary" | "summary_large_image";
  };
  theme: {
    colors: {
      primary: string;
      primaryLight: string;
      accent: string;
      accentHover: string;
      background: string;
      backgroundAlt: string;
    };
    fonts: {
      display: string;
      body: string;
    };
  };
}
