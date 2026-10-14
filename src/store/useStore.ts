import { create } from 'zustand';
import type Lenis from 'lenis';

interface State {
  activeSection: string;
  heroTexture: string;
  lenis: Lenis | null;
  setActiveSection: (section: string) => void;
  setHeroTexture: (texture: string) => void;
  setLenis: (lenis: Lenis | null) => void;
}

export const DEFAULT_HERO_TEXTURE = '/images/hero/layers/rock-main.png';

export const useStore = create<State>((set) => ({
  activeSection: 'home',
  heroTexture: DEFAULT_HERO_TEXTURE, // Default Hero
  lenis: null,
  setActiveSection: (section) => set({ activeSection: section }),
  setHeroTexture: (texture) => set({ heroTexture: texture }),
  setLenis: (lenis) => set({ lenis }),
}));
