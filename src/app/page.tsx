"use client";

import Navigation from "@/components/navigation";
import Scene from "@/components/webgl/scene";
import HeroSection from "@/components/sections/hero";
import ProjectsSection from "@/components/sections/projects";
import ToolkitSection from "@/components/sections/toolkit";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import ServicesSection from "@/components/sections/services";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <main className="relative bg-portfolio-bg text-portfolio-text">
      {/* WebGL Background Layer */}
      {isMounted && <Scene />}

      {/* Contrast Overlay */}
      <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

      {/* Global Navigation */}
      <Navigation />

      {/* Sections (Body Scroll) */}
      <div className="w-full relative z-10">
        <HeroSection />
        <ProjectsSection />
        <ServicesSection />
        <ToolkitSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}
