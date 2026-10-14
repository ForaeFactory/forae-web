import { create } from 'zustand';

interface State {
  activeSection: string;
  heroTexture: string;
  setActiveSection: (section: string) => void;
  setHeroTexture: (texture: string) => void;
}

export const DEFAULT_HERO_TEXTURE = '/images/hero/layers/rock-main.webp';

export const useStore = create<State>((set) => ({
  activeSection: 'home',
  heroTexture: DEFAULT_HERO_TEXTURE, // Default Hero
  setActiveSection: (section) => set({ activeSection: section }),
  setHeroTexture: (texture) => set({ heroTexture: texture }),
}));
