"use client";

import { useStore, DEFAULT_HERO_TEXTURE } from "@/store/useStore";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import ProjectInquiryForm from "../project-inquiry-form";

export default function ContactSection() {
  const { setActiveSection, setHeroTexture } = useStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 }); // Lowered threshold for better mobile trigger

  useEffect(() => {
    if (isInView) {
      setActiveSection("contact");
      setHeroTexture(DEFAULT_HERO_TEXTURE);
    }
  }, [isInView, setActiveSection, setHeroTexture]);

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen w-full flex items-center justify-center relative px-6 md:px-10 py-24"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start z-10">
        {/* Left: Heading & Context */}
        <div className="flex flex-col space-y-8 sticky top-32">
          <span className="eyebrow mb-2">
            Inquiry
          </span>
          <h2 className="text-5xl md:text-7xl font-bold leading-none text-white">
            START A<br />
            PROJECT
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-md leading-relaxed">
            Ready to separate yourself from the competition? Let&apos;s build a
            digital ecosystem that drives real business results.
          </p>

          <div className="pt-10 border-t border-white/10 mt-10">
            <span className="block text-xs uppercase tracking-widest text-muted mb-2">
              Direct Contact
            </span>
            <a
              href="mailto:create@foraefactory.com"
              className="text-lg hover:text-accent transition-colors"
            >
              create@foraefactory.com
            </a>
          </div>
        </div>

        {/* Right: The Form */}
        <div className="w-full bg-black/20 backdrop-blur-sm p-4 md:p-0 rounded-2xl">
          <ProjectInquiryForm />
        </div>
      </div>
    </section>
  );
}
