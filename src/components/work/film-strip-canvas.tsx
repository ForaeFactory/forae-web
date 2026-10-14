'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { stripPointer } from './strip-state';

export type StripItem = { slug: string; image: string; video?: string };

// Optimised source for a texture: the same next/image endpoint the page uses.
const textureUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;

const vertexShader = /* glsl */ `
uniform float uVelocity;
uniform float uHover;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // The card bows sideways while the strip moves, like film pulled through a gate.
  // (The card's size never changes; hover zoom happens inside the image.)
  p.x += sin(uv.y * 3.14159265) * uVelocity * 0.06;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uImage;
uniform sampler2D uVideo;
uniform vec2 uImageSize;
uniform vec2 uVideoSize;
uniform float uVideoMix;
uniform vec2 uPlane;
uniform float uVelocity;
uniform float uHover;
uniform vec2 uMouse;
uniform float uTime;
uniform float uRadius;
varying vec2 vUv;

// object-fit: cover, in UV space.
vec2 cover(vec2 uv, vec2 plane, vec2 media) {
  float rp = plane.x / plane.y;
  float rm = media.x / media.y;
  vec2 scale = rp > rm ? vec2(1.0, rm / rp) : vec2(rp / rm, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  // Hover: a gentle zoom plus a liquid ripple spreading from the cursor.
  vec2 uv = (vUv - 0.5) * (1.0 - 0.05 * uHover) + 0.5;
  float d = distance(vUv * uPlane, uMouse * uPlane) / min(uPlane.x, uPlane.y);
  vec2 dir = normalize(vUv - uMouse + 1e-5);
  uv += dir * sin(d * 22.0 - uTime * 3.2) * exp(-d * 3.5) * 0.010 * uHover;

  // Speed splits the colour channels along the direction of travel.
  float shift = uVelocity * 0.012;
  vec2 iuv = cover(uv, uPlane, uImageSize);
  vec3 color = vec3(
    texture2D(uImage, iuv + vec2(shift, 0.0)).r,
    texture2D(uImage, iuv).g,
    texture2D(uImage, iuv - vec2(shift, 0.0)).b
  );
  if (uVideoMix > 0.001) {
    vec3 video = texture2D(uVideo, cover(uv, uPlane, uVideoSize)).rgb;
    color = mix(color, video, uVideoMix);
  }

  // Legibility shade for the title, drawn here so it moves and bends with the
  // image (black at the bottom, fading out by the top: 80% -> 32% -> 0%).
  float shade = vUv.y < 0.5 ? mix(0.8, 0.32, vUv.y / 0.5) : mix(0.32, 0.0, (vUv.y - 0.5) / 0.5);
  color = mix(color, vec3(0.0), shade);

  // Rounded corners to match the DOM card (rounded-xl).
  vec2 px = vUv * uPlane;
  vec2 q = abs(px - uPlane * 0.5) - (uPlane * 0.5 - uRadius);
  float edge = length(max(q, 0.0)) - uRadius;
  float alpha = 1.0 - smoothstep(-1.0, 0.5, edge);

  gl_FragColor = vec4(color, alpha);
}
`;

const shared = { velocity: 0 };

function useHoverVideo(src?: string) {
  return useMemo(() => {
    if (!src || typeof document === 'undefined') return null;
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.crossOrigin = 'anonymous';
    const texture = new THREE.VideoTexture(video);
    return { video, texture };
  }, [src]);
}

function StripPlane({ item, texture }: { item: StripItem; texture: THREE.Texture }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const hover = useRef(0);
  const videoMix = useRef(0);
  const hoverVideo = useHoverVideo(item.video);

  const uniforms = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    return {
      uImage: { value: texture },
      uVideo: { value: hoverVideo?.texture ?? texture },
      uImageSize: { value: new THREE.Vector2(image?.width ?? 16, image?.height ?? 9) },
      uVideoSize: { value: new THREE.Vector2(16, 9) },
      uVideoMix: { value: 0 },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uRadius: { value: 12 },
    };
  }, [texture, hoverVideo]);

  useEffect(() => {
    return () => {
      hoverVideo?.video.pause();
      hoverVideo?.texture.dispose();
    };
  }, [hoverVideo]);

  useFrame((state) => {
    const element = document.querySelector<HTMLElement>(`[data-strip-media="${item.slug}"]`);
    const plane = mesh.current;
    if (!element || !plane) return;

    // Mirror the DOM card's rect into canvas pixels (orthographic camera, 1 unit = 1 px).
    const canvasRect = gl.domElement.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    plane.visible = rect.right > canvasRect.left - 50 && rect.left < canvasRect.right + 50;
    if (!plane.visible) return;
    plane.position.set(
      rect.left - canvasRect.left + rect.width / 2 - canvasRect.width / 2,
      -(rect.top - canvasRect.top + rect.height / 2 - canvasRect.height / 2),
      0,
    );
    plane.scale.set(rect.width, rect.height, 1);

    const isHovered = stripPointer.hovered === item.slug;
    hover.current += ((isHovered ? 1 : 0) - hover.current) * 0.08;

    if (hoverVideo) {
      const { video } = hoverVideo;
      if (isHovered && video.paused) {
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(() => {});
      } else if (!isHovered && !video.paused && hover.current < 0.02) {
        video.pause();
      }
      const ready = isHovered && video.readyState >= 2;
      videoMix.current += ((ready ? 1 : 0) - videoMix.current) * 0.08;
      if (video.videoWidth) uniforms.uVideoSize.value.set(video.videoWidth, video.videoHeight);
    }

    uniforms.uPlane.value.set(rect.width, rect.height);
    uniforms.uMouse.value.set(
      (stripPointer.clientX - rect.left) / rect.width,
      1 - (stripPointer.clientY - rect.top) / rect.height,
    );
    uniforms.uHover.value = hover.current;
    uniforms.uVideoMix.value = videoMix.current;
    uniforms.uVelocity.value = shared.velocity;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 24, 24]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent />
    </mesh>
  );
}

// Strip speed, from how far the first card moved since the last frame.
function VelocityTracker({ firstSlug }: { firstSlug: string }) {
  const last = useRef<number | null>(null);
  useFrame(() => {
    const element = document.querySelector<HTMLElement>(`[data-strip-media="${firstSlug}"]`);
    if (!element) return;
    const left = element.getBoundingClientRect().left;
    const delta = last.current === null ? 0 : left - last.current;
    last.current = left;
    const target = THREE.MathUtils.clamp(delta / 30, -1, 1);
    shared.velocity += (target - shared.velocity) * 0.12;
  });
  return null;
}

function Planes({ items, onReady }: { items: StripItem[]; onReady: () => void }) {
  const textures = useTexture(items.map((item) => textureUrl(item.image)));
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <>
      <VelocityTracker firstSlug={items[0].slug} />
      {items.map((item, i) => (
        <StripPlane key={item.slug} item={item} texture={textures[i]} />
      ))}
    </>
  );
}

export default function FilmStripCanvas({
  items,
  active,
  onReady,
}: {
  items: StripItem[];
  active: boolean;
  onReady: () => void;
}) {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      stripPointer.clientX = event.clientX;
      stripPointer.clientY = event.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 500], near: 0.1, far: 1000 }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true }}
      className="!absolute inset-0"
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Planes items={items} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
