import { useStore } from '@/store/useStore';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';



export default function LiquidPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, invalidate } = useThree();
  
  // Subscribe to global texture state
  const heroTextureUrl = useStore((state) => state.heroTexture);
  const texture = useTexture(heroTextureUrl);
  
  // Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uTexture: { value: texture },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: 16 / 9 },
    }),
    [] // Re-run when texture *object* changes? No, we update the uniform value.
  );

  // Update uniform when texture loads
  useEffect(() => {
    if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        const image = texture.image as { width?: number; height?: number } | undefined;
        material.uniforms.uTexture.value = texture;
        if (image?.width && image?.height) material.uniforms.uImageAspect.value = image.width / image.height;
        invalidate(); // The canvas renders on demand, so ask for a frame.
    }
  }, [texture, invalidate]);

  // Keep the cover crop in step with the screen shape.
  useEffect(() => {
    if (meshRef.current) {
        (meshRef.current.material as THREE.ShaderMaterial).uniforms.uPlaneAspect.value = viewport.width / viewport.height;
        invalidate();
    }
  }, [viewport.width, viewport.height, invalidate]);
  
  // Track mouse
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Update Time
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Update Mouse (normalized 0-1)
    // R3F mouse is -1 to 1. Convert to 0 to 1 for UVs.
    const mouseX = (state.mouse.x + 1) / 2;
    const mouseY = (state.mouse.y + 1) / 2;
    
    // Lerp for smoothness
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.x,
      mouseX,
      0.1
    );
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.y,
      mouseY,
      0.1
    );
  });
  
  // Need to sync scroll velocity if possible, or just scroll position
  // For now, let's just use a basic animation or verify interactions first.
  // Accessing lenis instance here is tricky without context, usually we pass it or use a store.
  // We'll leave uScroll as 0 for this step and focus on Mouse.

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
