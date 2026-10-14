'use client';

import { useTexture, shaderMaterial } from '@react-three/drei';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { heroVertexShader, heroFragmentShader } from './shaders';

// Create custom material
const HeroMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uTexture: null,
  },
  heroVertexShader,
  heroFragmentShader
);

extend({ HeroMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heroMaterial: any;
    }
  }
}

export default function ParallaxHero() {
  const { viewport } = useThree();
  
  // Load all 9 layers
  const textures = useTexture([
    '/images/hero/layers/rock-main.webp',
    '/images/hero/layers/rock-2.webp',
    '/images/hero/layers/rock-3.webp',
    '/images/hero/layers/rock-4.webp',
    '/images/hero/layers/rock-5.webp',
    '/images/hero/layers/rock-6.webp',
    '/images/hero/layers/rock-7.webp',
    '/images/hero/layers/rock-8.webp',
    '/images/hero/layers/rock-9.webp',
  ]);

  const group = useRef<THREE.Group>(null);

  // Configuration for each rock
  // Index 0 = Main, 1 = Rock-2, 2-8 = Rocks 3-9
  // Configuration for each rock
  // Index 0 = Main, 1 = Rock-2, 2-8 = Rocks 3-9
  const layerConfig = useMemo(() => [
    { speed: 0.00, z: 0.0, scale: 0.8, isSolid: true },  // Main (Static)
    { speed: 0.03, z: 0.1, scale: 0.8, isSolid: false }, // Rock 2 (Subtle Movement now)
    { speed: 0.08, z: 0.3, scale: 0.8, isSolid: false }, // Rock 3
    { speed: 0.12, z: 0.4, scale: 0.8, isSolid: false }, // Rock 4
    { speed: 0.15, z: 0.5, scale: 0.8, isSolid: false }, // Rock 5
    { speed: 0.10, z: 0.2, scale: 0.8, isSolid: false }, // Rock 6
    { speed: 0.20, z: 0.6, scale: 0.8, isSolid: false }, // Rock 7
    { speed: 0.18, z: 0.5, scale: 0.8, isSolid: false }, // Rock 8
    { speed: 0.25, z: 0.7, scale: 0.8, isSolid: false }, // Rock 9 (Max movement)
  ], []);

  // Parallax / Repulsion Logic
  useFrame((state) => {
    if (!group.current) return;
    
    // Mouse in Normalized Device Coordinates (-1 to +1)
    const mx = state.pointer.x;
    const my = state.pointer.y;
    
    // Lerp Helper
    const lerp = (current: number, target: number, factor: number) => 
      current + (target - current) * factor;

    // Rigid Body Repulsion
    group.current.children.forEach((child, i) => {
        const config = layerConfig[i];
        if (!config || config.isSolid) return; // Skip static rocks

        const targetX = mx * -1.0 * (config.speed * 0.4); 
        const targetY = my * -1.0 * (config.speed * 0.4);
        
        child.position.x = lerp(child.position.x, targetX, 0.05);
        child.position.y = lerp(child.position.y, targetY, 0.05);
    });
  });

  const baseScale = 1.2; 
  
  const ratio = 16 / 9;
  const width = viewport.width > viewport.height * ratio ? viewport.width : viewport.height * ratio;
  const height = width / ratio;

  return (
    <group ref={group}>
       {textures.map((tex, i) => {
         const config = layerConfig[i];
         return (
            <mesh 
              key={i} 
              position={[0, 0, config.z]} 
              scale={[width * baseScale * config.scale, height * baseScale * config.scale, 1]}
            >
               <planeGeometry /> {/* Revert to simple plane */}
               {/* Use MeshBasicMaterial for everything - Pure, clean image */}
               <meshBasicMaterial map={tex} transparent opacity={1} />
            </mesh>
         );
       })}
    </group>
  );
}
