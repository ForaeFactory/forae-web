import Navigation from "@/components/navigation";
import SceneLoader from "@/components/webgl/scene-loader";
import HeroSection from "@/components/sections/hero";
import ProjectsSection from "@/components/sections/projects";
import ToolkitSection from "@/components/sections/toolkit";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import ServicesSection from "@/components/sections/services";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <>
      {/* Global Navigation */}
      <Navigation />

      <main id="main" className="relative bg-surface text-ink">
        {/* WebGL background: a static image first, the 3D scene once the browser is idle */}
        <SceneLoader />

        {/* Contrast Overlay */}
        <div aria-hidden className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

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

      <SiteFooter />
    </>
  );
}
