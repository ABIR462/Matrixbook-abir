export type Template = {
  id: string;
  title: string;
  tag: string;
  description: string;
  prompt: string;
  gradient: string;
  image: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "saas",
    title: "SaaS Landing",
    tag: "Marketing",
    description: "A bold dark SaaS landing page with hero, features grid, pricing, and CTA.",
    prompt:
      "A premium dark SaaS landing page for an AI productivity tool called 'Flow'. Bold neon gradient hero with a product mockup image, three feature cards with icons, a pricing section with 3 tiers, customer logos, testimonial, and footer. Modern, glowing, with subtle animations.",
    gradient: "from-fuchsia-500 via-violet-500 to-cyan-400",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  },
  {
    id: "portfolio",
    title: "Designer Portfolio",
    tag: "Personal",
    description: "Editorial portfolio with hero, work grid, about section, and contact form.",
    prompt:
      "An editorial designer portfolio for 'Maya Chen'. Oversized serif typography, big intro paragraph, a 3-column case study grid using unsplash images, an about section with photo, and an elegant contact form. Cream background, black text, accent of coral.",
    gradient: "from-orange-400 via-rose-400 to-pink-500",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "startup",
    title: "AI Startup",
    tag: "Tech",
    description: "Animated AI startup with glowing hero, demo, social proof, and waitlist.",
    prompt:
      "An AI startup landing page for 'Nimbus AI'. Pitch-black background, glowing purple-cyan gradient hero with animated blob, 'How it works' 3-step section with numbered cards, scrolling logo strip, FAQ accordion-look, waitlist form. Premium and futuristic.",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
  },
  {
    id: "ecom",
    title: "Product Store",
    tag: "E-commerce",
    description: "Boutique e-commerce landing for a single hero product with gallery.",
    prompt:
      "A boutique e-commerce landing page for a premium ceramic mug brand 'Kiln'. Warm beige background, large hero with product photo (unsplash), feature highlights with icons, materials section, customer reviews with stars, and an add-to-cart CTA. Refined and tactile.",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599&auto=format&fit=crop",
  },
  {
    id: "event",
    title: "Event / Conference",
    tag: "Event",
    description: "Conference page with countdown, speakers, schedule, and tickets.",
    prompt:
      "A landing page for an indie tech conference 'Signal 2026'. Dark background with electric green and pink gradient accents. Hero with date/location, speakers grid (6 placeholder portraits using picsum), schedule list with times, ticket pricing tiers, and venue section.",
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "blog",
    title: "Magazine Blog",
    tag: "Content",
    description: "Editorial blog homepage with featured article and post grid.",
    prompt:
      "An editorial magazine-style blog homepage for 'Loop Journal' covering design and technology. Top featured article with large image and headline, secondary featured row, then a 3-column grid of recent posts each with image/category/title/excerpt. Newsletter signup at bottom. Light theme, sharp serif headlines, clean sans body.",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop",
  },
];