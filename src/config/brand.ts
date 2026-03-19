/** Brand configuration — edit this file to re-brand the site. */

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

export const brand: BrandConfig = {
  agent: {
    name: "Chetan Kotak",
    title: "Licensed Real Estate Agent",
    dreNumber: "DRE #XXXXXXX",
  },
  contact: {
    phone: "+1 (415) 555-0100",
    phoneRaw: "+1-415-555-0100",
    email: "chetan@example.com",
  },
  social: {
    twitter: "@chetankotak",
    twitterUrl: "https://twitter.com/chetankotak",
    linkedinUrl: "https://linkedin.com/in/chetankotak",
  },
  location: {
    city: "San Francisco",
    region: "CA",
    country: "US",
    areaServed: "Bay Area, California",
  },
  site: {
    name: "Chetan Kotak Real Estate",
    url: "https://chetankotak.github.io/realestate-portfolio",
    ogImage: "/og-image.png",
    twitterCard: "summary_large_image",
  },
  theme: {
    colors: {
      primary: "#0f0f0f",
      primaryLight: "#1a1a1a",
      accent: "#C9A84C",
      accentHover: "#dbb96a",
      background: "#f9f9f7",
      backgroundAlt: "#f2f2f0",
    },
    fonts: {
      display: "'Bebas Neue', 'Arial Narrow', sans-serif",
      body: "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  },
};
