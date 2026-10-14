export type MosaicImage = {
  src: string;
  /** Tailwind col/row spans for the 5-column desktop grid, e.g. "col-span-2 row-span-3". */
  span?: string;
};

export type StoryBlock =
  | { type: "centered-text"; text: string }
  | { type: "text-block"; title: string; text: string }
  | { type: "full-image"; src: string }
  | { type: "image-row"; images: string[] }
  | {
      type: "split";
      title: string;
      text: string;
      images?: string[];
      src?: string;
      layout?: "stacked";
    }
  | { type: "horizontal-gallery"; title?: string; text?: string; images: string[] }
  | { type: "mosaic-gallery"; images: MosaicImage[] }
  | { type: "centered-video"; src: string; title?: string }
  | {
      type: "theme-toggle";
      title: string;
      text: string;
      images: { light: string; dark: string };
    };

export type Project = {
  slug: string;
  title: string;
  client: string;
  location: string;
  tools: string[];
  type: string;
  visuals: {
    hero: string;
    video?: string;
    gallery: string[];
  };
  description: string;
  year: string;
  role: string;
  story?: StoryBlock[];
};

export const projects: Project[] = [
  {
    slug: "blseltzer",
    title: "Bud Light Seltzer",
    client: "Anheuser-Busch",
    location: "Dallas, Texas",
    tools: [
      "Campaign Strategy",
      "Photography",
      "Multicultural",
      "Art Direction",
    ],
    type: "Campaign Strategy",
    visuals: {
      hero: "/images/projects/blseltzer-hero.png",
      gallery: [],
    },
    description:
      "An immersive digital campaign featuring vibrant interactive elements and fluid transitions.",
    year: "2021",
    role: "Campaign Strategy",
    story: [
      {
        type: "centered-text",
        text: "We were tasked with launching the new Bud Light Seltzer to a Gen-Z audience. The goal was to create a digital experience that felt as refreshing and vibrant as the product itself.",
      },
      {
        type: "full-image",
        src: "/images/projects/blseltzer/blsFill-1.png",
      },
      {
        type: "split",
        title: "The Strategy",
        text: "Despite triple digit growth with Bon & Viv, Anheuser-Busch had fallen behind in the seltzer category. To compensate, they threw all their brewing power and their biggest brand into the category to create... \n Bud Light Seltzer: An easy-drinking hard seltzer with a hint of delicious fruit flavor. We make spiked seltzer the same way we make beer - with a superior process made to deliver refreshing taste.",
        images: [
          "/images/projects/blseltzer/blsIntro-1.png",
          "/images/projects/blseltzer/blsIntro-2.png",
        ],
      },
      {
        type: "horizontal-gallery",
        title: "Full Flavored Imagery",
        text: "Bud Light Seltzer entered the market as a challenger brand. Recognizing the parent brand, Bud Light lacked cultural texture or relevance to diverse young adults, they sought to flip the script with a targeted regional launch in Dallas—a city rich in cultural identity, music, art, and entrepreneurial energy. First step was casting and producing a vibrant, multicultural photoshoot in Dallas, Texas.",
        images: [
          "/images/projects/blseltzer/blsCarousel-1.png",
          "/images/projects/blseltzer/blsCarousel-2.png",
          "/images/projects/blseltzer/blsCarousel-3.png",
          "/images/projects/blseltzer/blsCarousel-4.png",
          "/images/projects/blseltzer/blsCarousel-5.png",
          "/images/projects/blseltzer/blsCarousel-6.png",
          "/images/projects/blseltzer/blsCarousel-7.png",
          "/images/projects/blseltzer/blsCarousel-8.png",
        ],
      },
      {
        type: "text-block",
        title: "Core Messaging",
        text: "We all have a unique flavor that we bring to the world. It should be championed and unapologetic. Now more than ever, being yourself is encouraged. Every interaction needs some flavor. Why not bring yours?",
      },
      {
        type: "mosaic-gallery",
        images: [
          {
            src: "/images/projects/blseltzer/blsMosaic-1.png",
            span: "col-span-2 row-span-3",
          }, // Big Box
          {
            src: "/images/projects/blseltzer/blsMosaic-2.png",
            span: "col-span-3 row-span-2",
          }, // Wide Box
          {
            src: "/images/projects/blseltzer/blsMosaic-3.png",
            span: "col-span-3 row-span-1",
          }, // Wide Strip
          {
            src: "/images/projects/blseltzer/blsMosaic-4.png",
            span: "col-span-3 row-span-1",
          }, // Standard Strip
          {
            src: "/images/projects/blseltzer/blsMosaic-5.png",
            span: "col-span-1 row-span-1",
          }, // Big Box
          {
            src: "/images/projects/blseltzer/blsMosaic-6.png",
            span: "col-span-1 row-span-1",
          }, // Small
          {
            src: "/images/projects/blseltzer/blsMosaic-7.png",
            span: "col-span-2 row-span-2",
          }, // Small
          {
            src: "/images/projects/blseltzer/blsMosaic-8.png",
            span: "col-span-2 row-span-3",
          }, // Small
          {
            src: "/images/projects/blseltzer/blsMosaic-11.png",
            span: "col-span-1 row-span-3",
          }, // Wide Box
          {
            src: "/images/projects/blseltzer/blsMosaic-9.png",
            span: "col-span-2 row-span-2",
          }, // Big Box
          {
            src: "/images/projects/blseltzer/blsMosaic-10.png",
            span: "col-span-3 row-span-1",
          }, // Wide Box
          // Wide Box
        ],
      },
      {
        type: "full-image",
        src: "/images/projects/blseltzer/blsClose.png",
      },
    ],
  },
  {
    slug: "kraft-heinz",
    title: "Kraft Heinz",
    client: "The Kraft Heinz Co.",
    location: "Chicago, IL",
    tools: ["UX/UI Design", "Accessibility", "Next.js", "Content Strategy"],
    type: "Corporate Platform",
    visuals: {
      hero: "/images/projects/khc-hero.png",
      video: "/videos/projects/khc.mp4",
      gallery: [],
    },
    description:
      "Redefining the corporate digital landscape with a focus on storytelling and accessibility.",
    year: "2023",
    role: "Full Stack",
    story: [
      {
        type: "centered-text",
        text: "The Kraft Heinz Company sought to transform its corporate presence into a storytelling platform. The goal was to humanize the brand, highlighting innovation, sustainability, and the people behind the products.",
      },
      {
        type: "full-image",
        src: "/images/projects/khc/khMainImage.png",
      },
      {
        type: "text-block",
        title: "Background",
        text: "In a world that’s focused on the future, Kraft Heinz’s 150-year legacy is our differentiator - we’re steeped in history, but we’re at an inflection point. We might not be a tech company, or be building the next leading software product, but we are commited to transforming the food industry. With bold thinking and unprecedented passion, we can make a meaningful difference to what people eat.",
      },
      {
        type: "horizontal-gallery",
        title: "The Strategy",
        images: [
          "/images/projects/khc/khCarousel1.png",
          "/images/projects/khc/khCarousel2.png",
          "/images/projects/khc/khCarousel3.png",
          "/images/projects/khc/khCarousel4.png",
          "/images/projects/khc/khCarousel5.png",
        ],
      },
      {
        type: "text-block",
        title: "The Re-Designed Digital Suite",
        text: 'The overall thought process was: How do we "fill the gaps" KraftHeinz is experiencing to complete the picture? With that in mind, the new designs were built from the concept of Tangram Puzzles. Knowing we have the necessary resources, let\'s leverage the basic shapes extracted from the whitespace within KH to build a minimal, yet fun icon set that\'s consistent with the brand. The color choices were chosen as variants of the existing identity to impart a more "delicious" look and feel.',
      },
      {
        type: "full-image",
        src: "/images/projects/khc/khCarousel6.png",
      },
      {
        type: "theme-toggle",
        title: "KH InsightSuite",
        text: "A comprehensive design system supporting both light and dark viewing modes for maximum accessibility.",
        images: {
          light: "/images/projects/khc/khIconsLight.png",
          dark: "/images/projects/khc/khIconsDark2.png",
        },
      },
    ],
  },
  {
    slug: "budweiser",
    title: "Budweiser",
    client: "Anheuser-Busch",
    location: "Houston, TX",
    tools: ["Trade Marketing", "Experiential", "Multicultural", "Production"],
    type: "Brand Experience",
    visuals: {
      hero: "/images/projects/budweiser-hero.png",
      video: "/videos/projects/budweiser.mp4",
      gallery: [],
    },
    description:
      "A global digital presence unifying the brand's legacy with modern web technologies.",
    year: "2020",
    role: "Creative Director",
    story: [
      {
        type: "text-block",
        title: "Background",
        text: "Budweiser, an American-style lager, was introduced in 1876 by Adolphus Busch. Budweiser is now positioned as “The King of Beers”—a classic American lager that represents tradition, pride, and authenticity. It’s rooted in values of hard work, camaraderie, and national pride, while increasingly evolving to stay relevant with younger, more diverse drinkers. Over the years, Budweiser has become one of the most recognizable beer brands in the world, with a rich history and a loyal following of fans.",
      },
      {
        type: "full-image",
        src: "/images/projects/budweiser/budCover.png",
      },

      {
        type: "horizontal-gallery",
        title: "Tricks of the 'Trade'",
        text: "The brand’s marketing efforts have often leaned on national, one-size-fits-all strategies that underdeliver in culturally specific experiences. At a macro level, we needed to develop trade assets that can scale and align with current initiatives. That was our focus when for the first portion of the project.",
        images: [
          "/images/projects/budweiser/budCarousel-1.png",
          "/images/projects/budweiser/budCarousel-2.png",
          "/images/projects/budweiser/budCarousel-3.png",
          "/images/projects/budweiser/budCarousel-4.png",
          "/images/projects/budweiser/budCarousel-5.png",
        ],
      },

      {
        type: "horizontal-gallery",
        title: "Visual Vibes",
        text: "With macro trade assets done, we switched focus to regional experiences and imagery. The goal was simple: Reconnect with Houston’s consumer base that was driving sales through culturally relevant storytelling and vibrant imagery.",
        images: [
          "/images/projects/budweiser/BudCulture.png",
          "/images/projects/budweiser/BudCulture1.png",
          "/images/projects/budweiser/BudCulture2.png",
          "/images/projects/budweiser/BudCulture3.png",
        ],
      },
      {
        type: "text-block",
        title: "Celebration Fit for a King",
        text: "We built and hosted an event that celebrated our target consumer's culture in Houston. The event included a Q&A session followed by a live concert by Slim Thug, a prominent name in Houston music. We produced and live-streamed the event as well.",
      },
      {
        type: "full-image",
        src: "/images/projects/budweiser/budCulture2.png",
      },
    ],
  },
  {
    slug: "michelob-ultra",
    title: "Michelob Ultra",
    client: "Anheuser-Busch",
    location: "New York City, NY",
    tools: ["Mobile App", "React Native", "HealthKit", "Social Integration"],
    type: "Lifestyle Hub",
    visuals: {
      hero: "/images/projects/ultra-hero.png",
      gallery: [],
    },
    description:
      "A dynamic lifestyle hub connecting fitness enthusiasts with the brand's active philosophy.",
    year: "2017",
    role: "Lead Engineer",
    story: [
      {
        type: "centered-text",
        text: "As the national strategy was being finalized, ULTRA noticed opportunities to address issues involving their visuals and processes that could unleash the true potential of the brand.",
      },
      {
        type: "full-image",
        src: "/images/projects/ultra/muPlace.png",
      },
      {
        type: "horizontal-gallery",
        title: "Trade: Clear Straightforward Benefits",
        text: "To fortify ULTRA's position as the 'Look of the Leader,' our execution centers on a clean brand re-envisioning across all lifestyle and trade touchpoints. This demands optimizing and simplifying the product story to ensure maximum impact and crystal-clear messaging. A key pillar of our approach will be to articulate the direct benefits to the consumer, this will be achieved through direct, easy-to-understand language and an intentional use of whitespace that maintains the brand's established premium visual identity and tone.",
        images: [
          "/images/projects/ultra/mulTrade1_1.png",
          "/images/projects/ultra/mulTrade2.png",
          "/images/projects/ultra/mulTrade3_1.png",
          "/images/projects/ultra/mulTrade4_1.png",
          "/images/projects/ultra/mulTrade5.png",
        ],
      },
      {
        type: "full-image",
        src: "/images/projects/ultra/mulPGFill.png",
      },
      {
        type: "text-block",
        title: "Set the Stage for ULTRA Experiences",
        text: "Like the brand, ULTRA FitFest was built on community, offering workouts and training sessions led by relatable trainers, influencers and celebrities, By focusing on participation, positive reinforcement, and real-world activation. Agency partners aimed to weave the brand into the narrative of health, moderation, and an active, social lifestyle, demonstrating that enjoying a beer doesn't mean compromising your well-being. Credit: Infinite Agency",
      },
      {
        type: "mosaic-gallery",
        images: [
          {
            src: "/images/projects/ultra/mulExp1.png",
            span: "col-span-2 row-span-2",
          },
          {
            src: "/images/projects/ultra/mulExp2.png",
            span: "col-span-3 row-span-2",
          },
          {
            src: "/images/projects/ultra/mulExp3.png",
            span: "col-span-3 row-span-1",
          },
          {
            src: "/images/projects/ultra/mulExp4.png",
            span: "col-span-2 row-span-1",
          },
          {
            src: "/images/projects/ultra/mulExp5.png",
            span: "col-span-2 row-span-2",
          },
          {
            src: "/images/projects/ultra/mulExp6.png",
            span: "col-span-3 row-span-2",
          },
          {
            src: "/images/projects/ultra/mulExp7.png",
            span: "col-span-1 row-span-1",
          },
          {
            src: "/images/projects/ultra/mulExp9.png",
            span: "col-span-2 row-span-1",
          },
        ],
      },
      {
        type: "full-image",
        src: "/images/projects/ultra/mulFill3.png",
      },
    ],
  },
  {
    slug: "queue",
    title: "Queue",
    client: "Private Client",
    location: "Austin, TX",
    tools: ["Product Design", "Prototyping", "Motion Design", "UI/UX"],
    type: "Product Design",
    visuals: {
      hero: "/images/projects/queue-hero.png",
      video: "/videos/projects/queue.mp4",
      gallery: [],
    },
    description:
      "A specialized B2B portal streamlining partner interactions and resource management.",
    year: "2023",
    role: "Tech Lead",
    story: [
      {
        type: "centered-text",
        text: "In social settings, music often becomes a point of friction—someone always dominates the aux cord, and others have no say in the playlist. The result? Disengaged listeners and an unbalanced music experience. There is a need for a democratic, real-time way for everyone to contribute to and influence the music being played.",
      },
      {
        type: "full-image",
        src: "/images/projects/queue/qIntro.png",
      },
      {
        type: "horizontal-gallery",
        title: "User Research",
        text: "Key feedback highlights the importance of seamless onboarding, personalized interaction, and social recognition within the app experience. It seems engagement is driven by a blend of technical curiosity and emotional connection to music.",
        images: [
          "/images/projects/queue/Data_q.png",
          "/images/projects/queue/Personas_q.png",
          "/images/projects/queue/Journeys_q.png",
          "/images/projects/queue/Sketches_q.png",
        ],
      },
      {
        type: "horizontal-gallery",
        title: "Design System",
        text: "To engage and retain users, Queue must balance intelligent design with opportunities for discovery, contribution, and community.",
        images: [
          "/images/projects/queue/Logos_q.png",
          "/images/projects/queue/Fonts_q.png",
          "/images/projects/queue/Colors_q.png",
          "/images/projects/queue/Buttons_q.png",
          "/images/projects/queue/Components_q.png",
          "/images/projects/queue/HeadFoot_q.png",
          "/images/projects/queue/ui_q.png",
          "/images/projects/queue/HifiRoutes_q.png",
        ],
      },
      {
        type: "centered-video",
        title: "Building the Vibe",
        src: "/videos/projects/queue.mp4",
      },
    ],
  },
  {
    slug: "bewell",
    title: "BeWell",
    client: "BeWell",
    location: "Chicago, IL",
    tools: ["Rebranding", "Typography", "Logo Design", "Color System"],
    type: "E-Commerce",
    visuals: {
      hero: "/images/projects/bewell-hero.png",
      gallery: [],
    },
    description:
      "A concept e-commerce experience focusing on motion and fluid product transitions.",
    year: "2021",
    role: "Creative Dev",
    story: [
      {
        type: "centered-text",
        text: "What started as a quick logo redesign, evolved into building the brand's base visual identity to better reflect the current vision.",
      },
      {
        type: "full-image",
        src: "/images/projects/bewell/bw-1_brand.png",
      },
      {
        type: "horizontal-gallery",
        title: "Getting Acclimated",
        text: "The aim is to evolve its visual identity and messaging to better reflect its current values and market position. This initiative will strategically refine Bewell's core assets, including its logo, color palette, and brand voice, to create a more modern, cohesive, and compelling brand presence that resonates with its target audience and supports future growth.",
        images: [
          "/images/projects/bewell/bw-3_brand.png",
          "/images/projects/bewell/bw-4_brand.png",
          "/images/projects/bewell/bw-5_brand.png",
        ],
      },
      {
        type: "full-image",
        src: "/images/projects/bewell/bw-6_brand.png",
      },
      {
        type: "horizontal-gallery",
        images: [
          "/images/projects/bewell/bw-8_brand.png",
          "/images/projects/bewell/bw-9_brand.png",
          "/images/projects/bewell/bw-10_brand.png",
          "/images/projects/bewell/bw-2_brand.png",
        ],
      },
      {
        type: "centered-video",
        src: "/videos/projects/beWell-Social.mp4",
      },
    ],
  },
];

export const agency = {
  name: "Forae",
  tagline: "Digital Products for the Bold.",
  founded: "2017",
  description:
    "We bridge the gap between creative chaos and technical precision. An independent digital design studio helping brands tell better stories through code and motion.",
  socials: {
    /*github: "https://github.com/foraefactory",*/
    linkedin: "https://linkedin.com/in/craigbrooks",
    github: "https://github.com/foraefactory",
  },
  portrait: "/images/projects/khc-hero.png", // Studio Architecture Placeholder
};

export const services = [
  {
    title: "Creative Direction",
    description:
      "Guiding the visual and technical narrative of digital products.",
    tags: ["Brand Strategy", "Art Direction"],
    image: "/images/projects/blseltzer-hero.png",
  },
  {
    title: "Immersive Experiences",
    description: "3D environments and WebGL interactions that define brands.",
    tags: ["Three.js", "Shaders", "Physics"],
    image: "/images/projects/bewell-hero.png",
  },
  {
    title: "Motion & Interaction",
    description:
      "Meaningful micro-interactions that delight users and drive engagement.",
    tags: ["Prototyping", "Framer Motion", "GSAP"],
    image: "/images/projects/queue-hero.png",
  },
  {
    title: "Technical Strategy",
    description:
      "Scalable architecture for complex, high-performance applications.",
    tags: ["Next.js", "Headless CMS", "Systems Design"],
    image: "/images/projects/khc-hero.png",
  },
];

export const toolkit = {
  strategy: [
    "Branding",
    "Creative Direction",
    "Systems Thinking",
    "User Research",
    "Technical Architecture",
    "Motion Systems",
    "Design Systems",
  ],
  creative: [
    "WebGL",
    "Adobe Creative Cloud",
    "Figma",
    "Framer Motion",
    "Typography",
    "Visual Design",
  ],
  development: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "Three.js",
    "Python",
  ],
};
